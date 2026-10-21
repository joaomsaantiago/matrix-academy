/** O seu professor. A foto do Thiago ainda vai chegar: o retrato é um espaço reservado com as iniciais. */
export function Instructor() {
  return (
    <section id="quem-ensina" className="teacher" aria-labelledby="quem-ensina-title">
      <h2 id="quem-ensina-title" className="teacher__title" data-reveal>
        <svg className="teacher__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 9 12 4 2 9l10 5 10-5Z" />
          <path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" />
          <path d="M22 9v6" />
        </svg>
        o seu professor
      </h2>

      <div className="teacher__grid">
        <div className="teacher__portrait" aria-hidden="true" data-reveal>
          <span>TS</span>
        </div>

        <div className="teacher__body">
          <h3 className="teacher__name" data-reveal>
            Thiago Santiago
          </h3>
          <p className="teacher__role" data-reveal>
            Fundador da Bless Technology e fundador da Bless Academy.
          </p>
          <div className="teacher__text" data-reveal>
            <p>
              Com experiência no mercado de áudio profissional desde 2001, Thiago André Santiago
              construiu uma trajetória marcada pelo conhecimento técnico, pela vivência prática e
              pelo compromisso com a excelência em sonorização.
            </p>
            <p>
              À frente da Bless Technology, atua no desenvolvimento de soluções e sistemas de áudio
              profissional, contribuindo para o avanço tecnológico e a qualidade sonora no setor.
            </p>
            <p>
              Como fundador da Bless Academy, transformou sua experiência de mercado em conhecimento
              compartilhado, capacitando profissionais por meio de cursos especializados em
              acústica, mixagem, mesas digitais, alinhamento de sistemas e sonorização profissional.
            </p>
            <p>
              Sua atuação integra tecnologia, experiência prática e educação, com o propósito de
              formar profissionais mais preparados, elevar o nível técnico do mercado e promover a
              excelência em áudio profissional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
