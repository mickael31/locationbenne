import { NavLink } from "react-router-dom";
import SectionCta from "../components/SectionCta";
import SiteImage from "../components/SiteImage";
import { company, home } from "../data/content";
import useScrollReveal from "../hooks/useScrollReveal";

export default function HomePage() {
  useScrollReveal();

  return (
    <>
      <section className="hero">
        <div className="container hero-grid hero-grid-pro">
          <div className="hero-copy fade-in-left">
            <p className="eyebrow">{home.hero.eyebrow}</p>
            <h1>{home.hero.title}</h1>
            <p className="hero-lead">{home.hero.description}</p>

            <ul className="hero-points">
              <li>Intervention locale rapide sur Montauban, Toulouse, Albi et alentours.</li>
              <li>Solution adaptée à chaque volume de déchets, de 3 à 15 m³.</li>
              <li>Accompagnement simple : conseil, livraison, enlèvement.</li>
            </ul>

            <div className="button-row">
              <NavLink to="/contact" className="btn btn-primary">
                Demander un devis
              </NavLink>
              <NavLink to="/bennes" className="btn btn-ghost">
                Voir les bennes
              </NavLink>
            </div>

            <div className="hero-kpis">
              <article className="hero-kpi">
                <strong>24-48h</strong>
                <span>Livraison rapide</span>
              </article>
              <article className="hero-kpi">
                <strong>3 à 15 m³</strong>
                <span>Tailles disponibles</span>
              </article>
              <article className="hero-kpi">
                <strong>Devis gratuit</strong>
                <span>Sans engagement</span>
              </article>
            </div>
          </div>

          <div className="hero-media fade-in-right">
            <SiteImage
              src={home.hero.image}
              alt="Camion benne en Occitanie"
              width={1024}
              height={683}
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 980px) 92vw, 44vw"
            />
            <aside className="hero-overlay-card">
              <p className="hero-overlay-title">Urgence chantier ?</p>
              <p className="hero-overlay-text">
                Contact direct pour planifier rapidement votre benne.
              </p>
              <a href={`tel:${company.phoneRaw}`} className="btn btn-primary small">
                Appeler {company.phoneLocalDisplay}
              </a>
            </aside>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-grid">
          <article className="trust-item fade-in">Particuliers et professionnels</article>
          <article className="trust-item fade-in stagger-1">Zones urbaines et périurbaines</article>
          <article className="trust-item fade-in stagger-2">Gestion responsable des déchets</article>
          <article className="trust-item fade-in stagger-3">Accompagnement de A à Z</article>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <SiteImage
            className="fade-in-left"
            src={home.intro.image}
            alt="Équipe Location Benne Occitanie"
            width={1024}
            height={1024}
            sizes="(max-width: 980px) 92vw, 44vw"
          />
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
          <div>
            <h2>Prêt à évacuer vos déchets ?</h2>
            <p className="quick-cta-note">Un appel suffit pour lancer votre demande.</p>
          </div>
          <div className="button-row">
            <NavLink to="/contact" className="btn btn-primary">
              Demander un devis
            </NavLink>
            <a href={`tel:${company.phoneRaw}`} className="btn btn-light">
              Appeler maintenant
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow fade-in">Nos atouts</p>
          <h2 className="fade-in">Des avantages concrets pour vos projets</h2>
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
          <p className="eyebrow fade-in">Étapes</p>
          <h2 className="fade-in">Un parcours simple, du devis à l'enlèvement</h2>
          <div className="process-grid">
            {home.process.map((item, i) => (
              <article className={`process-card scale-in stagger-${i + 1}`} key={item.title}>
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
          <div className="fade-in home-review-wrap">
            <iframe
              loading="lazy"
              onLoad={(e) => {
                if (window.iFrameResize) {
                  window.iFrameResize(e.target);
                }
              }}
              src="https://2ce195e1bf9e45548064458cdf627318.elf.site"
              className="home-review-frame"
              title="Avis clients - Trustindex"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="fade-in">Questions fréquentes</h2>
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
