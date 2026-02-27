import { NavLink } from "react-router-dom";
import SectionCta from "../components/SectionCta";
import { home } from "../data/content";
import useScrollReveal from "../hooks/useScrollReveal";

export default function HomePage() {
  useScrollReveal();

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="fade-in-left">
            <p className="eyebrow">{home.hero.eyebrow}</p>
            <h1>{home.hero.title}</h1>
            <p>{home.hero.description}</p>
            <div className="button-row">
              <NavLink to="/contact" className="btn btn-primary">
                Demander un devis
              </NavLink>
              <NavLink to="/services" className="btn btn-ghost">
                Nos services
              </NavLink>
            </div>
          </div>
          <img className="fade-in-right" src={home.hero.image} alt="Camion benne en Occitanie" />
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <img className="fade-in-left" src={home.intro.image} alt="Équipe Location Benne Occitanie" />
          <div className="fade-in-right">
            <h2>{home.intro.title}</h2>
            <p>{home.intro.text}</p>
            <NavLink to="/about" className="btn btn-secondary">
              En savoir plus
            </NavLink>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <p className="eyebrow fade-in">Services</p>
          <h2 className="fade-in">Nos services de location de bennes en Occitanie</h2>
          <div className="cards">
            {home.services.map((service, i) => (
              <article className={`card scale-in stagger-${i + 1}`} key={service.number}>
                <p className="card-index">{service.number}</p>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section quick-cta">
        <div className="container quick-cta-content fade-in">
          <h2>Pr\u00EAt \u00E0 \u00E9vacuer vos d\u00E9chets ?</h2>
          <NavLink to="/contact" className="btn btn-primary">
            Demander un devis
          </NavLink>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow fade-in">Nos atouts</p>
          <h2 className="fade-in">D\u00E9couvrez nos avantages uniques pour vos projets</h2>
          <div className="cards">
            {home.benefits.map((item, i) => (
              <article className={`card scale-in stagger-${i + 1}`} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <p className="eyebrow fade-in">Comment \u00E7a fonctionne</p>
          <h2 className="fade-in">D\u00E9couvrez notre processus de location de bennes</h2>
          <div className="cards">
            {home.process.map((item, i) => (
              <article className={`card scale-in stagger-${i + 1}`} key={item.step}>
                <p className="card-index">{item.step}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow fade-in">Engagement</p>
          <h2 className="fade-in">Pourquoi choisir Location Benne Occitanie ?</h2>
          <div className="cards">
            {home.commitments.map((item, i) => (
              <article className={`card scale-in stagger-${i + 1}`} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2 className="fade-in">Ce que nos clients disent de nous</h2>
          <div className="fade-in" style={{ marginTop: "1.4rem" }}>
            <iframe
              onLoad={(e) => {
                if (window.iFrameResize) window.iFrameResize(e.target);
              }}
              src="https://2ce195e1bf9e45548064458cdf627318.elf.site"
              style={{ border: "none", width: "100%", minHeight: "300px" }}
              title="Avis clients - Trustindex"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="fade-in">Questions Fréquemment Posées</h2>
          <div className="faq-list">
            {home.faqs.map((faq) => (
              <details className="fade-in" key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SectionCta />
    </>
  );
}
