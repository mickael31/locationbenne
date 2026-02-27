import SectionCta from "../components/SectionCta";
import { bennes } from "../data/content";

export default function BennesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{bennes.eyebrow}</p>
          <h1>{bennes.title}</h1>
          <p>{bennes.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{bennes.heading}</h2>
          <div className="cards">
            {bennes.types.map((item) => (
              <article className="card benne-card" key={item.title}>
                <img src={item.image} alt={item.title} />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SectionCta />
    </>
  );
}
