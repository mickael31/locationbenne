import { NavLink } from "react-router-dom";
import SectionCta from "../components/SectionCta";
import SiteImage from "../components/SiteImage";
import { company, servicesPage } from "../data/content";
import useScrollReveal from "../hooks/useScrollReveal";

const serviceImageDimensions = [
  { width: 1024, height: 1024 },
  { width: 1024, height: 683 },
  { width: 683, height: 1024 },
  { width: 1024, height: 1024 },
];

export default function ServicesPage() {
  useScrollReveal();

  return (
    <>
      <section className="page-hero page-hero-services">
        <div className="container">
          <p className="eyebrow">{servicesPage.eyebrow}</p>
          <h1>{servicesPage.title}</h1>
          <p className="services-hero-lead">
            Une organisation claire, des interventions rapides et une exécution
            fiable pour vos besoins d'évacuation de déchets en Occitanie.
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
            Suivi de A à Z
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container service-list">
          {servicesPage.items.map((item, i) => {
            const dimensions = serviceImageDimensions[i] || {
              width: 1024,
              height: 1024,
            };

            return (
              <article
                key={item.title}
                className={`service-item service-item-pro fade-in stagger-${i + 1}`}
              >
                <SiteImage
                  src={item.image}
                  alt={item.title}
                  width={dimensions.width}
                  height={dimensions.height}
                  sizes="(max-width: 980px) 92vw, 310px"
                />
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
            );
          })}
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <p className="eyebrow fade-in">Méthode</p>
          <h2 className="fade-in">Comment se déroule votre prestation</h2>
          <div className="services-flow-grid">
            <article className="process-card scale-in stagger-1">
              <h3>Brief rapide</h3>
              <p>
                Nous analysons votre volume, votre type de déchets et vos contraintes
                d'accès.
              </p>
            </article>
            <article className="process-card scale-in stagger-2">
              <h3>Livraison adaptée</h3>
              <p>
                Nous planifions la benne sur le bon créneau pour éviter les retards de
                chantier.
              </p>
            </article>
            <article className="process-card scale-in stagger-3">
              <h3>Enlèvement et suivi</h3>
              <p>
                Une fois remplie, nous récupérons la benne et assurons un traitement
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
