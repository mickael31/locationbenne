import { NavLink } from "react-router-dom";
import SectionCta from "../components/SectionCta";
import { home } from "../data/content";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
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
          <img src={home.hero.image} alt="Camion benne en Occitanie" />
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <img src={home.intro.image} alt="Equipe Location Benne Occitanie" />
          <div>
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
          <p className="eyebrow">Services</p>
          <h2>Nos services de location de bennes en Occitanie</h2>
          <div className="cards">
            {home.services.map((service) => (
              <article className="card" key={service.number}>
                <p className="card-index">{service.number}</p>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section quick-cta">
        <div className="container quick-cta-content">
          <h2>Prêt à évacuer vos déchets ?</h2>
          <NavLink to="/contact" className="btn btn-primary">
            Demander un devis
          </NavLink>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Nos atouts</p>
          <h2>Découvrez nos avantages uniques pour vos projets</h2>
          <div className="cards">
            {home.benefits.map((item) => (
              <article className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <p className="eyebrow">Comment ça fonctionne</p>
          <h2>Découvrez notre processus de location de bennes</h2>
          <div className="cards">
            {home.process.map((item) => (
              <article className="card" key={item.step}>
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
          <p className="eyebrow">Engagement</p>
          <h2>Pourquoi choisir Location Benne Occitanie ?</h2>
          <div className="cards">
            {home.commitments.map((item) => (
              <article className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2>Ce que nos clients disent de nous</h2>
          <div className="cards">
            {home.testimonials.map((testimonial) => (
              <article className="card testimonial" key={testimonial.author}>
                <p className="meta">
                  Publié sur Google • Source vérifiée Trustindex
                </p>
                <p>{testimonial.text}</p>
                <h3>{testimonial.author}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Questions Fréquemment Posées</h2>
          <div className="faq-list">
            {home.faqs.map((faq) => (
              <details key={faq.question}>
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
