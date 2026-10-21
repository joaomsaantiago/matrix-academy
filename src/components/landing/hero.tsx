import { CreateAccountButton, HeroSpotlight } from "./hero-effects";
import { HeroScrollVideo } from "./hero-scroll-video";

export function Hero() {
  return (
    <HeroScrollVideo>
      <div className="hero__glow" aria-hidden="true" />
      <HeroSpotlight />

      <div className="hero__copy">
        <h1 className="hero__title">
          <span className="hero__kicker">domine a waldman</span>
          <span className="hero__word">matrix</span>
        </h1>
        <p className="hero__lead hero__lead--ghost" aria-hidden="true">
          Curso gratuito em vídeo para operar as mesas digitais Matrix 20 e Matrix 26, com
          certificado ao final.
        </p>
        <CreateAccountButton />
      </div>

      <div className="hero__foot">
        <p className="hero__tags">Matrix 20 · Matrix 26</p>
        <a href="#conteudo" className="scrollbadge" aria-label="Role para explorar o curso">
          <svg viewBox="0 0 120 120" className="scrollbadge__ring" aria-hidden="true">
            <defs>
              <path id="scroll-circle" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
            </defs>
            <text className="scrollbadge__text">
              <textPath href="#scroll-circle" textLength="288" lengthAdjust="spacing">
                ROLE PARA EXPLORAR •
              </textPath>
            </text>
          </svg>
          <span className="scrollbadge__arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M12 5v14M6 13l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
        <p className="hero__tags hero__tags--end">Gratuito</p>
      </div>
    </HeroScrollVideo>
  );
}
