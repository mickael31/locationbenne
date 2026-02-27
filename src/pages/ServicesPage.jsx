import SectionCta from "../components/SectionCta";
import { servicesPage } from "../data/content";
import useScrollReveal from "../hooks/useScrollReveal";

export default function ServicesPage() {
  useScrollReveal();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{servicesPage.eyebrow}</p>
          <h1>{servicesPage.title}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container service-list">
          {servicesPage.items.map((item, i) => (
            <article key={item.title} className={`service-item fade-in stagger-${i + 1}`}>
              <img src={item.image} alt={item.title} />
              <div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SectionCta />
    </>
  );
}
