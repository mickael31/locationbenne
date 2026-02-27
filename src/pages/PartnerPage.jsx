import { NavLink } from "react-router-dom";
import SectionCta from "../components/SectionCta";
import { company, partnerPage } from "../data/content";
import useScrollReveal from "../hooks/useScrollReveal";

export default function PartnerPage() {
  useScrollReveal();

  return (
    <>
      <section className="page-hero page-hero-services">
        <div className="container">
          <p className="eyebrow">{partnerPage.eyebrow}</p>
          <h1>{partnerPage.title}</h1>
          <p className="services-hero-lead">{partnerPage.lead}</p>
          <div className="services-hero-actions">
            <a
              href={partnerPage.website}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir {partnerPage.websiteLabel}
            </a>
            <a href={`tel:${company.phoneRaw}`} className="btn btn-light">
              Appeler {company.phoneLocalDisplay}
            </a>
          </div>
        </div>
      </section>

      <section className="services-proof">
        <div className="container services-proof-grid">
          {partnerPage.highlights.map((item, i) => (
            <article
              key={item}
              className={`services-proof-item fade-in stagger-${i + 1}`}
            >
              {item}
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="fade-in-left">
            <p className="eyebrow">Même direction</p>
            <h2>{partnerPage.partnerName}</h2>
            <p>
              Si votre projet comprend des travaux d'élagage ou d'abattage, vous
              pouvez passer par <strong>{partnerPage.partnerName}</strong>, notre
              activité dédiée aux travaux arboricoles.
            </p>
            <p>
              Nous restons votre interlocuteur pour la location de benne et
              l'évacuation des déchets, avec la même personne à la direction des
              deux services.
            </p>
            <div className="service-actions">
              <a
                href={partnerPage.website}
                className="btn btn-secondary small"
                target="_blank"
                rel="noopener noreferrer"
              >
                Accéder au site Natur'Elag 82
              </a>
              <NavLink to="/contact" className="btn btn-ghost small">
                Demander un devis benne
              </NavLink>
            </div>
          </div>
          <article className="card fade-in-right">
            <h3>Services complémentaires</h3>
            <p>
              Cette organisation vous permet de gérer plus simplement vos
              chantiers extérieurs, avec deux expertises coordonnées.
            </p>
            <ul>
              <li>Élagage, taille et entretien des arbres</li>
              <li>Abattage selon les contraintes de sécurité</li>
              <li>Benne et évacuation sur la même période</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <p className="eyebrow fade-in">Pourquoi cette activité</p>
          <h2 className="fade-in">Un service local complémentaire</h2>
          <div className="cards">
            {partnerPage.reasons.map((reason, i) => (
              <article
                key={reason.title}
                className={`card scale-in stagger-${i + 1}`}
              >
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SectionCta />
    </>
  );
}
