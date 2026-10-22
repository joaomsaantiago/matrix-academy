"use client";

import { useEffect, useRef } from "react";

/** Sequência extraída de public/videopronto.mp4 (1920x1076, WebP, 30 fps). */
const FRAME_COUNT = 494;
const frameUrl = (i: number) => `/hero-frames/f${String(i + 1).padStart(4, "0")}.webp`;

/** Quantos frames decodificados ficam na memória: atrás / à frente do atual. */
const KEEP_BEHIND = 6;
const KEEP_AHEAD = 14;
const FETCH_CONCURRENCY = 6;
/**
 * Como o texto da capa sai quando a rolagem começa:
 *  - "zoom": o texto cresce e vem para frente até passar da tela (versão atual);
 *  - "rise": o texto sobe um pouco e some (versão original; para voltar, troque aqui).
 */
const COPY_MOTION: "zoom" | "rise" = "zoom";
/** Trecho inicial da rolagem (0 a 1) em que o texto sai de cena. */
const COPY_SPAN = COPY_MOTION === "zoom" ? 0.3 : 0.22;
/** Constante de tempo da roda do mouse suavizada (só dentro da capa): maior = mais macio. */
const WHEEL_SECONDS = 0.14;
/** Constante de tempo da suavização: maior = mais macio (e com mais atraso). */
const SMOOTH_SECONDS = 0.15;

/**
 * Animação da capa controlada pela rolagem. A seção externa é alta e o palco fica
 * "sticky": a posição de rolagem escolhe o frame desenhado no canvas.
 *
 * Pré-carregamento:
 *  1. baixa os frames (arquivos WebP) em ordem esparsa, 1 a cada 8, depois o resto,
 *     então já dá para rolar com a sequência inteira cobrindo o trecho;
 *  2. só uma janela de frames fica decodificada (ImageBitmap) ao redor do frame atual,
 *     para não estourar a memória (1080p decodificado = ~8 MB por frame);
 *  3. se o frame pedido ainda não está pronto, o canvas mantém o último desenhado.
 */
export function HeroScrollVideo({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapEl = wrap.current;
    const stageEl = stage.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d", { alpha: false });
    if (!wrapEl || !stageEl || !cv || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // celular: usa 1 de cada 2 frames (metade do download, ainda fluido a 15 fps + suavização)
    const step = window.innerWidth < 768 ? 2 : 1;
    const frames: number[] = [];
    for (let i = 0; i < FRAME_COUNT; i += step) frames.push(i);
    if (frames[frames.length - 1] !== FRAME_COUNT - 1) frames.push(FRAME_COUNT - 1);
    const n = frames.length;

    const blobs: (Blob | undefined)[] = new Array(n);
    const bitmaps: (ImageBitmap | undefined)[] = new Array(n);
    const decoding = new Set<number>();
    let loadedCount = 0;
    let disposed = false;

    let target = 0; // progresso 0..1 vindo da rolagem
    let current = 0; // progresso suavizado
    let drawn = -1; // índice do frame desenhado
    let raf = 0;
    let last = 0;
    let sized = false;

    // ---------- download ----------
    const order: number[] = [];
    const seen = new Set<number>();
    for (const stride of [8, 1]) {
      for (let i = 0; i < n; i += stride) {
        if (!seen.has(i)) {
          seen.add(i);
          order.push(i);
        }
      }
    }
    if (!seen.has(n - 1)) order.splice(1, 0, n - 1);

    let cursor = 0;
    const worker = async () => {
      while (!disposed && cursor < order.length) {
        const idx = order[cursor++];
        try {
          const res = await fetch(frameUrl(frames[idx]));
          if (!res.ok) throw new Error(String(res.status));
          blobs[idx] = await res.blob();
        } catch {
          // frame perdido: o vizinho mais próximo cobre a lacuna
        }
        loadedCount++;
        if (bar.current) {
          const done = loadedCount / n;
          bar.current.style.setProperty("--load", done.toFixed(3));
          bar.current.dataset.done = done >= 1 ? "1" : "0";
        }
        request();
      }
    };

    // ---------- decodificação em janela ----------
    async function decode(idx: number) {
      if (bitmaps[idx] || decoding.has(idx) || !blobs[idx]) return;
      decoding.add(idx);
      try {
        const bmp = await createImageBitmap(blobs[idx]!);
        if (disposed) {
          bmp.close();
          return;
        }
        bitmaps[idx] = bmp;
      } catch {
        // ignora; tenta de novo se voltar a ficar na janela
      } finally {
        decoding.delete(idx);
      }
      request();
    }

    const refreshWindow = (center: number) => {
      const lo = Math.max(0, center - KEEP_BEHIND);
      const hi = Math.min(n - 1, center + KEEP_AHEAD);
      for (let i = 0; i < n; i++) {
        const b = bitmaps[i];
        if (b && (i < lo || i > hi) && i !== 0) {
          b.close();
          bitmaps[i] = undefined;
        }
      }
      // decodifica primeiro o que está mais perto
      for (let d = 0; d <= KEEP_AHEAD; d++) {
        if (center + d <= hi) void decode(center + d);
        if (d > 0 && d <= KEEP_BEHIND && center - d >= lo) void decode(center - d);
      }
    };

    // ---------- desenho ----------
    const nearestReady = (idx: number) => {
      for (let d = 0; d < n; d++) {
        if (bitmaps[idx + d]) return idx + d;
        if (bitmaps[idx - d]) return idx - d;
      }
      return -1;
    };

    const draw = (bmp: ImageBitmap) => {
      if (!sized) {
        cv.width = bmp.width;
        cv.height = bmp.height;
        sized = true;
      }
      ctx.drawImage(bmp, 0, 0);
    };

    const render = (now: number) => {
      raf = 0;
      // suavização por tempo (igual em 60/120/144 Hz): ~0,3 s para alcançar a rolagem
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      last = now;
      const ease = reduced ? 1 : 1 - Math.exp(-dt / SMOOTH_SECONDS);
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.00002) {
        current = target;
        last = 0;
      }

      // o texto da capa sai de cena nos primeiros COPY_SPAN da rolagem, no mesmo ritmo suavizado do vídeo
      const copy = Math.max(0, 1 - current / COPY_SPAN);
      stageEl.style.setProperty("--copy", copy.toFixed(4));
      stageEl.dataset.copy = copy < 0.02 ? "0" : "1";
      stageEl.style.setProperty("--p", current.toFixed(4));

      const want = Math.min(n - 1, Math.max(0, Math.round(current * (n - 1))));
      refreshWindow(want);
      const use = nearestReady(want);
      if (use >= 0 && use !== drawn && bitmaps[use]) {
        draw(bitmaps[use]!);
        drawn = use;
      }
      // continua enquanto estiver alcançando o alvo (downloads e decodificações pedem novo quadro)
      if (current !== target) request();
    };

    function request() {
      if (!raf && !disposed) raf = requestAnimationFrame(render);
    }

    // ---------- rolagem ----------
    const measure = () => {
      const rect = wrapEl.getBoundingClientRect();
      // a última tela de rolagem é da cortina: a próxima seção sobe por cima da capa
      const span = rect.height - window.innerHeight * 2;
      target = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      // quanto da capa já está coberto (0 a 1), para escurecê-la enquanto a seção sobe
      const next = wrapEl.nextElementSibling;
      const cover = next ? 1 - next.getBoundingClientRect().top / window.innerHeight : 0;
      stageEl.style.setProperty("--cover", Math.min(1, Math.max(0, cover)).toFixed(3));
      request();
    };
    measure();
    current = target;
    request();

    // ---------- roda do mouse suave, só dentro da capa ----------
    // A roda normalmente salta em degraus. Aqui acumulamos o movimento e rolamos a página em
    // direção a ele com suavização. Fora da capa (e no celular, sem roda) a rolagem é a nativa.
    let wheelTarget = 0;
    let wheelPos = 0;
    let wheelRaf = 0;
    let wheelLast = 0;
    const zoneEnd = () => wrapEl.offsetTop + wrapEl.offsetHeight - window.innerHeight;
    const wheelStep = (now: number) => {
      const dt = wheelLast ? Math.min(0.1, (now - wheelLast) / 1000) : 0.016;
      wheelLast = now;
      // alguém rolou por outro meio (teclado, barra, âncora): abandona a animação
      if (Math.abs(window.scrollY - wheelPos) > 3) {
        wheelRaf = 0;
        return;
      }
      wheelPos += (wheelTarget - wheelPos) * (1 - Math.exp(-dt / WHEEL_SECONDS));
      if (Math.abs(wheelTarget - wheelPos) < 0.4) wheelPos = wheelTarget;
      window.scrollTo({ top: wheelPos, behavior: "instant" });
      if (wheelPos !== wheelTarget) wheelRaf = requestAnimationFrame(wheelStep);
      else wheelRaf = 0;
    };
    const onWheel = (e: WheelEvent) => {
      if (reduced || e.ctrlKey || e.defaultPrevented) return;
      const end = zoneEnd();
      const y = window.scrollY;
      // fora da capa, ou saindo dela para baixo: rolagem nativa
      if (y >= end && e.deltaY > 0) return;
      if (y > end) return;
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const delta = e.deltaY * unit;
      e.preventDefault();
      if (!wheelRaf) {
        wheelPos = y;
        wheelTarget = y;
        wheelLast = 0;
      }
      wheelTarget = Math.min(end, Math.max(0, wheelTarget + delta));
      if (!wheelRaf) wheelRaf = requestAnimationFrame(wheelStep);
    };
    window.addEventListener("wheel", onWheel, { passive: false });

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    for (let w = 0; w < FETCH_CONCURRENCY; w++) void worker();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(wheelRaf);
      bitmaps.forEach((b) => b?.close());
    };
  }, []);

  return (
    <section ref={wrap} className="hero-scroll" aria-label="Apresentação">
      <div ref={stage} className="hero hero--video" data-motion={COPY_MOTION}>
        <canvas ref={canvas} className="hero__video" aria-hidden="true" />
        <div className="hero__shade" aria-hidden="true" />
        {children}
        <div ref={bar} className="hero__load" data-done="0" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
