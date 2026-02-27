import { NavLink } from "react-router-dom";
import SectionCta from "../components/SectionCta";
import { about, company } from "../data/content";
import useScrollReveal from "../hooks/useScrollReveal";

export default function AboutPage() {
  useScrollReveal();

  return (
    <>
      <section className="page-hero page-hero-about">
        <div className="container">
          <p className="eyebrow">{about.subtitle}</p>
          <h1>{about.title}</h1>
          <p className="about-hero-lead">
            Une équipe locale engagée pour livrer un service fiable, rapide et
            parfaitement adapté à chaque chantier en Occitanie.
          </p>
          <div className="services-hero-actions">
            <NavLink to="/contact" className="btn btn-primary">
              Demander un devis
            </NavLink>
            <a href={`tel:${company.phoneRaw}`} className="btn btn-light">
              Appeler {company.phoneLocalDisplay}
            </a>
          </div>
        </div>
      </section>

      <section className="about-pillars">
        <div className="container about-pillars-grid">
          <article className="about-pillar fade-in">Réactivité terrain</article>
          <article className="about-pillar fade-in stagger-1">Conseil utile, sans blabla</article>
          <article className="about-pillar fade-in stagger-2">Service local de confiance</article>
        </div>
      </section>

      <section className="section">
        <div className="container split about-block">
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
        <div className="container split reverse about-block">
          <img className="fade-in-right" src={about.images[1]} alt="Historique de l'entreprise" />
          <div className="fade-in-left">
            <p className="eyebrow">{about.storyTitle}</p>
            <h2>{about.storyHeading}</h2>
            <p>{about.storyText}</p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container split about-block">
          <img className="fade-in-left" src={about.images[2]} alt="Experts locaux" />
          <div className="fade-in-right">
            <p className="eyebrow">{about.teamTitle}</p>
            <h2>{about.teamHeading}</h2>
            <p>{about.teamText}</p>
            <div className="service-actions">
              <NavLink to="/services" className="btn btn-secondary small">
                Voir nos services
              </NavLink>
              <NavLink to="/contact" className="btn btn-ghost small">
                Nous contacter
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      <SectionCta />
    </>
  );
}
