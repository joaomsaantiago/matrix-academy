import Image from "next/image";
import type { ModuleCard } from "@/lib/modules";
import { GlowList } from "./glow-list";

/** A foto da mesa é retrato (1200x1450): fração da altura que aparece num cartão 16:10. */
const BAND = Math.min(0.99, 4 / 3 / (1450 / 1200));

/** Os cards dos módulos do curso, logo abaixo do destaque. */
export function ModuleCards({
  modules,
  isSample,
}: {
  modules: ModuleCard[];
  isSample: boolean;
}) {
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons, 0);
  const totalDone = modules.reduce((sum, m) => sum + m.completed, 0);

  return (
    <section className="mods" aria-labelledby="mods-title">
      <header className="mods__head">
        <h2 id="mods-title" className="mods__title">
          Módulos do curso
        </h2>
        <p className="mods__count">
          {modules.length} módulos · {totalLessons} aulas
          {totalDone > 0 ? ` · ${totalDone} concluídas` : ""}
        </p>
      </header>

      <GlowList className="mods__grid">
        {modules.map((m, i) => {
          const py = Math.min(100, Math.max(0, ((m.focus.y / 100 - BAND / 2) / (1 - BAND)) * 100));
          const percent = m.lessons ? Math.round((m.completed / m.lessons) * 100) : 0;
          const state =
            m.completed === 0 ? "Não iniciado" : m.completed >= m.lessons ? "Concluído" : `${percent}%`;
          return (
            <li
              key={m.number}
              className="mcard"
              style={{ "--i": i } as React.CSSProperties}
              tabIndex={0}
              aria-label={`Módulo ${m.number}: ${m.title}`}
            >
              <Image
                src={m.photo}
                alt=""
                fill
                sizes="(min-width: 1280px) 24vw, (min-width: 768px) 32vw, 90vw"
                className="mcard__img"
                style={{
                  objectPosition: `50% ${py}%`,
                  transformOrigin: `${m.focus.x}% 50%`,
                  transform: `scale(${Math.max(1.5, m.focus.zoom)})`,
                }}
              />

              {/* aparece no hover (ou no foco pelo teclado) */}
              <div className="mcard__info">
                <h3 className="mcard__name">{m.title}</h3>
                <p className="mcard__meta">
                  {m.lessons} {m.lessons === 1 ? "aula" : "aulas"} <span aria-hidden="true">·</span> {state}
                </p>
              </div>

              {/* sempre à vista */}
              <div className="mcard__foot">
                <span className="mcard__no" aria-hidden="true">
                  {String(m.number).padStart(2, "0")}
                </span>
                <span
                  className="mcard__bar"
                  role="progressbar"
                  aria-label={`Progresso do módulo ${m.number}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                >
                  <span style={{ width: `${percent}%` }} />
                </span>
              </div>
            </li>
          );
        })}
      </GlowList>

      {isSample ? (
        <p className="mods__note">Exemplo: os módulos reais aparecem aqui quando forem publicados.</p>
      ) : null}
    </section>
  );
}
