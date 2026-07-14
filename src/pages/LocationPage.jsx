import { NavLink } from "react-router-dom";
import PhoneFirstNotice from "../components/PhoneFirstNotice";
import SectionCta from "../components/SectionCta";
import { company } from "../data/content";
import { getLocationPage, locationPages } from "../data/locationPages";
import useScrollReveal from "../hooks/useScrollReveal";

export default function LocationPage({ locationKey }) {
  const page = getLocationPage(locationKey);
  const otherLocations = locationPages.filter(({ key }) => key !== locationKey);
  useScrollReveal(locationKey);

  if (!page) return null;

  return (
    <>
      <section className="page-hero page-hero-location">
        <div className="container">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className="location-hero-lead">{page.lead}</p>
          <div className="location-actions">
            <a href={`tel:${company.phoneRaw}`} className="btn btn-primary">
              Appeler {company.phoneLocalDisplay}
            </a>
            <NavLink to="/contact/" className="btn btn-light">
              Demander un devis
            </NavLink>
          </div>
          <PhoneFirstNotice compact />
        </div>
      </section>

      <section className="section">
        <div className="container location-intro">
          <p className="eyebrow fade-in">Votre projet à {page.city}</p>
          <h2 className="fade-in">
            Une location préparée pour votre adresse à {page.city}
          </h2>
          <p className="fade-in">{page.introduction}</p>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <p className="eyebrow fade-in">Besoins courants</p>
          <h2 className="fade-in">{page.useCasesTitle}</h2>
          <div className="cards">
            {page.useCases.map((item, index) => (
              <article className={`card scale-in stagger-${index + 1}`} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow fade-in">Avant la livraison</p>
          <h2 className="fade-in">Les informations utiles à nous communiquer</h2>
          <div className="process-grid">
            {page.checklist.map((item, index) => (
              <article className={`process-card scale-in stagger-${index + 1}`} key={item}>
                <h3>Point {index + 1}</h3>
                <p>{item}</p>
              </article>
            ))}
          </div>
          <div className="location-links fade-in">
            <NavLink to="/bennes/" className="btn btn-secondary">
              Voir les bennes de 3 à 15 m³
            </NavLink>
            <NavLink to="/services/" className="btn btn-ghost">
              Comprendre la livraison et l'enlèvement
            </NavLink>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <p className="eyebrow fade-in">Volume et chargement</p>
          <h2 className="fade-in">{page.volumeTitle}</h2>
          <div className="cards">
            {page.volumeGuidance.map((item, index) => (
              <article
                className={`card scale-in stagger-${index + 1}`}
                key={item.title}
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow fade-in">Pose de la benne à {page.city}</p>
          <h2 className="fade-in">{page.preparationTitle}</h2>
          <div className="cards">
            {page.preparation.map((item, index) => (
              <article
                className={`card scale-in stagger-${index + 1}`}
                key={item.title}
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <div className="location-intro fade-in">
            <p>{page.officialGuidance.note}</p>
            <a
              href={page.officialGuidance.url}
              className="btn btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              {page.officialGuidance.label}
            </a>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <p className="eyebrow fade-in">De la demande à l'enlèvement</p>
          <h2 className="fade-in">{page.processTitle}</h2>
          <div className="process-grid">
            {page.rentalSteps.map((item, index) => (
              <article
                className={`process-card scale-in stagger-${index + 1}`}
                key={item.title}
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="fade-in">
            Questions fréquentes sur la location de benne à {page.city}
          </h2>
          <div className="faq-list">
            {page.faqs.map((faq) => (
              <details className="fade-in" key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <p className="eyebrow fade-in">Nos zones principales</p>
          <h2 className="fade-in">Autres secteurs desservis</h2>
          <p className="section-lead fade-in">
            Consultez les informations propres aux deux autres villes ou
            indiquez-nous votre adresse pour vérifier la desserte.
          </p>
          <nav
            className="location-links fade-in"
            aria-label="Autres villes desservies"
          >
            {otherLocations.map((location) => (
              <NavLink
                key={location.path}
                to={location.path}
                className="btn btn-secondary"
              >
                Location de benne à {location.city}
              </NavLink>
            ))}
          </nav>
        </div>
      </section>

      <SectionCta showPhoneNotice={false} />
    </>
  );
}
