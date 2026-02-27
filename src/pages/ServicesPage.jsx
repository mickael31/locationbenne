import { NavLink } from "react-router-dom";
import SectionCta from "../components/SectionCta";
import { company, servicesPage } from "../data/content";
import useScrollReveal from "../hooks/useScrollReveal";

export default function ServicesPage() {
  useScrollReveal();

  return (
    <>
      <section className="page-hero page-hero-services">
        <div className="container">
          <p className="eyebrow">{servicesPage.eyebrow}</p>
          <h1>{servicesPage.title}</h1>
          <p className="services-hero-lead">
            Une organisation claire, des interventions rapides et une execution
            fiable pour vos besoins d'evacuation de dechets en Occitanie.
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

      <section className="services-proof">
        <div className="container services-proof-grid">
          <article className="services-proof-item fade-in">Devis gratuit</article>
          <article className="services-proof-item fade-in stagger-1">
            Intervention locale rapide
          </article>
          <article className="services-proof-item fade-in stagger-2">
            Solutions particuliers / pros
          </article>
          <article className="services-proof-item fade-in stagger-3">
            Suivi de A a Z
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container service-list">
          {servicesPage.items.map((item, i) => (
            <article
              key={item.title}
              className={`service-item service-item-pro fade-in stagger-${i + 1}`}
            >
              <img src={item.image} alt={item.title} />
              <div>
                <p className="service-tag">Service {(i + 1).toString().padStart(2, "0")}</p>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <div className="service-actions">
                  <NavLink to="/contact" className="btn btn-secondary small">
                    Demander ce service
                  </NavLink>
                  <a href={`tel:${company.phoneRaw}`} className="btn btn-ghost small">
                    Appeler
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <p className="eyebrow fade-in">Methode</p>
          <h2 className="fade-in">Comment se deroule votre prestation</h2>
          <div className="services-flow-grid">
            <article className="process-card scale-in stagger-1">
              <p className="process-step">ETAPE 01</p>
              <h3>Brief rapide</h3>
              <p>
                Nous analysons votre volume, votre type de dechets et vos contraintes
                d'acces.
              </p>
            </article>
            <article className="process-card scale-in stagger-2">
              <p className="process-step">ETAPE 02</p>
              <h3>Livraison adaptee</h3>
              <p>
                Nous planifions la benne sur le bon creneau pour eviter les retards de
                chantier.
              </p>
            </article>
            <article className="process-card scale-in stagger-3">
              <p className="process-step">ETAPE 03</p>
              <h3>Enlevement et suivi</h3>
              <p>
                Une fois remplie, nous recuperons la benne et assurons un traitement
                responsable.
              </p>
            </article>
          </div>
        </div>
      </section>

      <SectionCta />
    </>
  );
}
