import { NavLink } from "react-router-dom";
import { company } from "../data/content";

export default function SectionCta() {
  return (
    <section className="cta-section">
      <div className="container cta-content">
        <h2>Ne laissez pas vos encombrants s'accumuler !</h2>
        <p>
          Contactez-nous dès aujourd'hui pour un devis gratuit et rapide sur la
          location de bennes.
        </p>
        <div className="cta-actions">
          <NavLink to="/contact" className="btn btn-light">
            Nous contacter
          </NavLink>
          <a href={`tel:${company.phoneRaw}`} className="btn btn-primary">
            Appeler {company.phoneLocalDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
