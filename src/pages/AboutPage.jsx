import SectionCta from "../components/SectionCta";
import { about } from "../data/content";
import useScrollReveal from "../hooks/useScrollReveal";

export default function AboutPage() {
  useScrollReveal();

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
          <img className="fade-in-left" src={about.images[0]} alt="Équipe sur chantier" />
          <div className="fade-in-right">
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
          {about.counters.map((counter, i) => (
            <article className={`counter scale-in stagger-${i + 1}`} key={counter.label}>
              <p className="counter-value">{counter.value}</p>
              <p>{counter.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container split reverse">
          <img className="fade-in-right" src={about.images[1]} alt="Historique de l'entreprise" />
          <div className="fade-in-left">
            <p className="eyebrow">{about.storyTitle}</p>
            <h2>{about.storyHeading}</h2>
            <p>{about.storyText}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <img className="fade-in-left" src={about.images[2]} alt="Experts locaux" />
          <div className="fade-in-right">
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
