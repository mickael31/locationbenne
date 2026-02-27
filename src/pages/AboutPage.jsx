import SectionCta from "../components/SectionCta";
import { about } from "../data/content";

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{about.subtitle}</p>
          <h1>{about.title}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <img src={about.images[0]} alt="Equipe sur chantier" />
          <div>
            <p className="eyebrow">{about.companyTitle}</p>
            <h2>{about.companyHeading}</h2>
            {about.companyParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container counter-grid">
          {about.counters.map((counter) => (
            <article className="counter" key={counter.label}>
              <p className="counter-value">{counter.value}</p>
              <p>{counter.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container split reverse">
          <img src={about.images[1]} alt="Historique de l'entreprise" />
          <div>
            <p className="eyebrow">{about.storyTitle}</p>
            <h2>{about.storyHeading}</h2>
            <p>{about.storyText}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <img src={about.images[2]} alt="Experts locaux" />
          <div>
            <p className="eyebrow">{about.teamTitle}</p>
            <h2>{about.teamHeading}</h2>
            <p>{about.teamText}</p>
          </div>
        </div>
      </section>

      <SectionCta />
    </>
  );
}
