"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "./reveal";
import { MODULES, TOTAL_LESSONS } from "./data";

/**
 * A jornada do curso na própria mesa: cada botão SEL (canais 1 a 8) abre um módulo
 * no display da Matrix 26. Foto da mesa + peças em código por cima.
 *
 * As medidas abaixo vêm da foto (1200x1450 px). Mostramos só o recorte CROP: a parte de
 * cima da mesa, onde ficam a tela e os SEL, com a base se dissolvendo no fundo escuro.
 */
const PHOTO = { src: "/img/matrix/matrix26-mesa.png", w: 1200, h: 1450 };
const CROP = { x: 170, y: 200, w: 840, h: 830 };
const LCD = { x: 337, y: 390, w: 430, h: 267 };
const SEL_X = [370, 422.5, 475, 527.5, 580, 632.5, 685, 737.5];
const SEL_Y = (i: number) => 777 - i * 0.4; // a fileira de botões tem uma leve inclinação na foto
const HOTSPOT = { w: 38, h: 26 };
const LED = { w: 29, h: 17 };

const pctX = (px: number) => `${(px / CROP.w) * 100}%`;
const pctY = (px: number) => `${(px / CROP.h) * 100}%`;

const FADE = "linear-gradient(to bottom, #000 0%, #000 74%, transparent 98%)";

export function CourseConsole() {
  const [index, setIndex] = useState(0);
  const current = MODULES[index];
  const channel = `CH${index + 1}`;

  return (
    <section id="conteudo" className="rig" aria-labelledby="conteudo-title">
      <Reveal className="rig__inner">
        <header className="rig__head">
          <h2 id="conteudo-title" className="rig__title" data-reveal="left">a sua jornada</h2>
          <p className="rig__hint" data-reveal="right">
            <span className="rig__hint-dot" aria-hidden="true" />
            Aperte o botão SEL de cada canal para abrir um módulo
          </p>
        </header>

        <div className="rig__machine" data-reveal="rise">
          <div className="rig__photo" style={{ maskImage: FADE, WebkitMaskImage: FADE }}>
            <Image
              src={PHOTO.src}
              alt="Mesa de som digital Waldman Matrix 26 vista de cima"
              width={PHOTO.w}
              height={PHOTO.h}
              sizes="(min-width: 1024px) 1340px, 150vw"
              style={{
                position: "absolute",
                maxWidth: "none",
                width: `${(PHOTO.w / CROP.w) * 100}%`,
                left: `${(-CROP.x / CROP.w) * 100}%`,
                top: `${(-CROP.y / CROP.h) * 100}%`,
                height: "auto",
              }}
            />
          </div>

          {/* o display: o texto do módulo escolhido */}
          <div
            className="rig__lcd"
            style={{
              left: pctX(LCD.x - CROP.x),
              top: pctY(LCD.y - CROP.y),
              width: pctX(LCD.w),
              height: pctY(LCD.h),
            }}
          >
            <div className="lcd" key={index} aria-live="polite">
              <div className="lcd__bar">
                <span className="lcd__tag">{channel}</span>
                <span className="lcd__step">
                  Módulo {index + 1} de {MODULES.length}
                </span>
                <span className="lcd__lessons">{current.lessons} aulas</span>
              </div>
              <h3 className="lcd__title">{current.title}</h3>
              <p className="lcd__text">{current.text}</p>
              <ol className="lcd__cells" aria-label={`${current.lessons} aulas`}>
                {Array.from({ length: current.lessons }, (_, n) => (
                  <li key={n} className="lcd__cell">
                    {n + 1}
                  </li>
                ))}
              </ol>
            </div>
            <div className="lcd__tabs" role="group" aria-label="Canais">
              {MODULES.map((m, i) => (
                <button
                  key={m.title}
                  type="button"
                  className={`lcd__tab${i === index ? " is-on" : ""}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Canal ${i + 1}: ${m.title}`}
                  aria-pressed={i === index}
                >
                  CH{i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* os botões SEL de verdade da foto, agora clicáveis */}
          {MODULES.map((m, i) => (
            <button
              key={m.title}
              type="button"
              className={`rig__sel${i === index ? " is-on" : ""}`}
              style={{
                left: pctX(SEL_X[i] - CROP.x),
                top: pctY(SEL_Y(i) - CROP.y),
                width: pctX(HOTSPOT.w),
                height: pctY(HOTSPOT.h),
              }}
              onClick={() => setIndex(i)}
              aria-label={`SEL do canal ${i + 1}: ${m.title}`}
              aria-pressed={i === index}
            >
              <span
                className="rig__led"
                style={{ width: `${(LED.w / HOTSPOT.w) * 100}%`, height: `${(LED.h / HOTSPOT.h) * 100}%` }}
              >
                SEL
              </span>
            </button>
          ))}
        </div>

        {/* celular: o display fica pequeno, então o módulo também aparece aqui embaixo */}
        <div className="rig__card" key={`card-${index}`} data-reveal>
          <p className="rig__count">
            {channel} · Módulo {index + 1} de {MODULES.length} · {current.lessons} aulas
          </p>
          <h3 className="rig__name">{current.title}</h3>
          <p className="rig__text">{current.text}</p>
        </div>

        <p className="rig__total" data-reveal>
          {MODULES.length} módulos · {TOTAL_LESSONS} aulas no total
        </p>
      </Reveal>
    </section>
  );
}
