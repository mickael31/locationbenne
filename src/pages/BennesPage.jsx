import { NavLink } from "react-router-dom";
import SectionCta from "../components/SectionCta";
import { bennes, company } from "../data/content";
import useScrollReveal from "../hooks/useScrollReveal";

const benneUsage = {
  "Benne 3 m³": "Ideal pour petits debarras, jardins et travaux ponctuels.",
  "Benne 7 m³": "Le meilleur compromis pour renovation et volume intermediaire.",
  "Benne 10 m³": "Parfait pour gros travaux de maison et debarras complets.",
  "Benne 15 m³": "Concue pour gros chantiers et besoins professionnels lourds.",
};

export default function BennesPage() {
  useScrollReveal();

  return (
    <>
      <section className="page-hero page-hero-bennes">
        <div className="container">
          <p className="eyebrow">{bennes.eyebrow}</p>
          <h1>{bennes.title}</h1>
          <p className="bennes-hero-lead">{bennes.intro}</p>
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

      <section className="bennes-volume-strip">
        <div className="container bennes-volume-grid">
          {bennes.types.map((item, i) => (
            <article
              key={item.title}
              className={`bennes-volume-item fade-in stagger-${i + 1}`}
            >
              <h3>{item.title}</h3>
              <p>{benneUsage[item.title]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="fade-in">{bennes.heading}</h2>
          <div className="cards bennes-cards-pro">
            {bennes.types.map((item, i) => (
              <article
                className={`card benne-card benne-card-pro scale-in stagger-${i + 1}`}
                key={item.title}
              >
                <img src={item.image} alt={item.title} />
                <p className="service-tag">{item.title.replace("Benne ", "Volume ")}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="service-actions">
                  <NavLink to="/contact" className="btn btn-secondary small">
                    Choisir cette benne
                  </NavLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <p className="eyebrow fade-in">Comparatif rapide</p>
          <h2 className="fade-in">Choisissez le volume selon votre besoin</h2>
          <div className="bennes-compare-grid">
            <article className="process-card scale-in stagger-1">
              <h3>Petit chantier</h3>
              <p>Debarras de cave, garage, taille de haies et petits gravats.</p>
            </article>
            <article className="process-card scale-in stagger-2">
              <h3>Projet intermediaire</h3>
              <p>Renovation de pieces, demenagement, dechets mixtes.</p>
            </article>
            <article className="process-card scale-in stagger-3">
              <h3>Gros volume</h3>
              <p>Renovation lourde, demoliton, chantier professionnel.</p>
            </article>
          </div>
        </div>
      </section>

      <SectionCta />
    </>
  );
}
