import { company, privacy } from "../data/content";
import useScrollReveal from "../hooks/useScrollReveal";

export default function PrivacyPage() {
  useScrollReveal();

  return (
    <>
      <section className="page-hero page-hero-privacy">
        <div className="container">
          <p className="eyebrow">Confidentialite</p>
          <h1>Politique de confidentialite</h1>
          <p className="privacy-hero-lead">
            Nous traitons vos donnees uniquement pour repondre a vos demandes
            et assurer nos prestations de location de bennes, dans le respect
            du RGPD.
          </p>
          <p className="privacy-last-update">{privacy.lastUpdate}</p>
        </div>
      </section>

      <section className="section">
        <div className="container privacy-summary-grid">
          <article className="privacy-summary-card fade-in">
            <h2>Donnees limitees</h2>
            <p>Nous collectons uniquement les informations necessaires a votre demande.</p>
          </article>
          <article className="privacy-summary-card fade-in stagger-1">
            <h2>Usage clair</h2>
            <p>Vos informations servent a traiter vos demandes, jamais a etre revendues.</p>
          </article>
          <article className="privacy-summary-card fade-in stagger-2">
            <h2>Vos droits</h2>
            <p>Vous pouvez demander acces, modification ou suppression de vos donnees.</p>
          </article>
        </div>
      </section>

      <section className="section alt">
        <div className="container legal legal-pro">
          {privacy.sections.map((section, i) => (
            <article
              className={`privacy-legal-card fade-in stagger-${(i % 5) + 1}`}
              key={section.title}
            >
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.list ? (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.footer ? <p>{section.footer}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article className="privacy-contact-card fade-in">
            <h2>Besoin d'un renseignement sur vos donnees ?</h2>
            <p>
              Contactez-nous directement pour toute demande relative a la
              confidentialite de vos informations.
            </p>
            <a href={`mailto:${company.email}`} className="btn btn-primary">
              Ecrire a {company.email}
            </a>
          </article>
        </div>
      </section>
    </>
  );
}
