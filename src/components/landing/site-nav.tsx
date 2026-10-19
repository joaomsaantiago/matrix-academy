"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { Wordmark } from "./wordmark";

// Mapa de deslocamento da "lente": cinza neutro no meio, e nas bordas os canais R e G
// empurram a imagem de fundo para dentro, como o vidro líquido da Apple.
const LENS_MAP =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="l" x1="0" x2="1"><stop offset="0" stop-color="#ff8080"/><stop offset=".09" stop-color="#808080"/></linearGradient>
        <linearGradient id="r" x1="1" x2="0"><stop offset="0" stop-color="#008080"/><stop offset=".09" stop-color="#808080"/></linearGradient>
        <linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#80ff80"/><stop offset=".3" stop-color="#808080"/></linearGradient>
        <linearGradient id="b" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#800080"/><stop offset=".3" stop-color="#808080"/></linearGradient>
      </defs>
      <rect width="1000" height="100" fill="#808080"/>
      <rect width="1000" height="100" fill="url(#l)" style="mix-blend-mode:screen"/>
      <rect width="1000" height="100" fill="url(#r)" style="mix-blend-mode:multiply"/>
      <rect width="1000" height="100" fill="url(#t)" style="mix-blend-mode:screen"/>
      <rect width="1000" height="100" fill="url(#b)" style="mix-blend-mode:multiply"/>
    </svg>`,
  );

// A refração por filtro SVG só funciona em navegadores Chromium (Chrome, Edge).
function isChromium() {
  const brands =
    (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } })
      .userAgentData?.brands ?? [];
  return brands.some((b) => b.brand === "Chromium");
}

function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

// Lente dos cartões: bordas finas e iguais nos quatro lados.
const CARD_MAP =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" preserveAspectRatio="none">
      <defs>
        <linearGradient id="l" x1="0" x2="1"><stop offset="0" stop-color="#ff8080"/><stop offset=".07" stop-color="#808080"/></linearGradient>
        <linearGradient id="r" x1="1" x2="0"><stop offset="0" stop-color="#008080"/><stop offset=".07" stop-color="#808080"/></linearGradient>
        <linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#80ff80"/><stop offset=".07" stop-color="#808080"/></linearGradient>
        <linearGradient id="b" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#800080"/><stop offset=".07" stop-color="#808080"/></linearGradient>
      </defs>
      <rect width="400" height="400" fill="#808080"/>
      <rect width="400" height="400" fill="url(#l)" style="mix-blend-mode:screen"/>
      <rect width="400" height="400" fill="url(#r)" style="mix-blend-mode:multiply"/>
      <rect width="400" height="400" fill="url(#t)" style="mix-blend-mode:screen"/>
      <rect width="400" height="400" fill="url(#b)" style="mix-blend-mode:multiply"/>
    </svg>`,
  );

export function SiteNav() {
  // Avisa o CSS quando a refração por filtro SVG é possível (menu e cartões de vidro).
  useEffect(() => {
    if (isChromium()) document.documentElement.dataset.refract = "1";
  }, []);
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 24,
    () => false,
  );

  return (
    <>
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="glass-defs">
        <filter id="liquid-lens" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage href={LENS_MAP} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="38" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="liquid-lens-card" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage href={CARD_MAP} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="cmap" />
          <feDisplacementMap in="SourceGraphic" in2="cmap" scale="60" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
        <nav className="nav__glass" aria-label="Principal">
          <Wordmark className="nav__brand" />
          <div className="nav__actions">
            <Link href="/entrar" className="nav__login">
              Entrar
            </Link>
            <Link href="/cadastro" className="nav__cta">
              Criar conta
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
