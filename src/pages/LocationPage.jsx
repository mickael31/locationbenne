import { NavLink } from "react-router-dom";
import PhoneFirstNotice from "../components/PhoneFirstNotice";
import SectionCta from "../components/SectionCta";
import { company } from "../data/content";
import { getLocationPage } from "../data/locationPages";
import useScrollReveal from "../hooks/useScrollReveal";

export default function LocationPage({ locationKey }) {
  const page = getLocationPage(locationKey);
  useScrollReveal();

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
          <h2 className="fade-in">Une location préparée avec vous</h2>
          <p className="fade-in">{page.introduction}</p>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <p className="eyebrow fade-in">Besoins courants</p>
          <h2 className="fade-in">Une benne adaptée à ce que vous évacuez</h2>
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
              Comparer les volumes de bennes
            </NavLink>
            <NavLink to="/services/" className="btn btn-ghost">
              Découvrir nos services
            </NavLink>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <p className="eyebrow fade-in">Pose de la benne à {page.city}</p>
          <h2 className="fade-in">Préparer l'emplacement et la voirie</h2>
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
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="fade-in">Questions fréquentes</h2>
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

      <SectionCta showPhoneNotice={false} />
    </>
  );
}
