import { NavLink } from "react-router-dom";
import SectionCta from "../components/SectionCta";
import { company } from "../data/content";
import useScrollReveal from "../hooks/useScrollReveal";

const upcomingTopics = [
  {
    title: "Choisir le bon volume",
    text: "Comment eviter une benne trop petite ou surdimensionnee selon vos travaux.",
  },
  {
    title: "Dechets acceptes",
    text: "Les bons reflexes pour trier et gagner du temps sur votre chantier.",
  },
  {
    title: "Organisation chantier",
    text: "Comment planifier livraison et enlevement pour ne pas bloquer vos equipes.",
  },
];

export default function BlogPage() {
  useScrollReveal();

  return (
    <>
      <section className="page-hero page-hero-blog">
        <div className="container">
          <p className="eyebrow">Blog</p>
          <h1>Conseils benne et chantier</h1>
          <p className="blog-hero-lead">
            Nous preparons des contenus utiles et concrets pour vous aider a
            mieux organiser vos debarras, renovations et evacuations de dechets.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article className="blog-placeholder-card fade-in">
            <p className="service-tag">Bientot en ligne</p>
            <h2>Les premiers articles arrivent</h2>
            <p>
              Le blog sera alimente avec des guides pratiques, des retours
              terrain et des conseils pour gagner en efficacite sur vos
              chantiers en Occitanie.
            </p>
            <div className="button-row">
              <NavLink to="/contact" className="btn btn-primary">
                Demander un devis
              </NavLink>
              <a href={`tel:${company.phoneRaw}`} className="btn btn-ghost">
                Appeler {company.phoneLocalDisplay}
              </a>
            </div>
          </article>

          <div className="blog-topic-grid">
            {upcomingTopics.map((topic, i) => (
              <article className={`process-card scale-in stagger-${i + 1}`} key={topic.title}>
                <p className="process-step">Sujet {(i + 1).toString().padStart(2, "0")}</p>
                <h3>{topic.title}</h3>
                <p>{topic.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SectionCta />
    </>
  );
}
