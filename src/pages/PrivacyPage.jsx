import { privacy } from "../data/content";

export default function PrivacyPage() {
  return (
    <>
      <section className="page-hero minimal">
        <div className="container">
          <h1>Politique de confidentialité</h1>
          <p>{privacy.lastUpdate}</p>
        </div>
      </section>

      <section className="section">
        <div className="container legal">
          {privacy.sections.map((section) => (
            <article key={section.title}>
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
    </>
  );
}
