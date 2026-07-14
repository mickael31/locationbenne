import { NavLink } from "react-router-dom";
import { company } from "../data/content";
import PhoneFirstNotice from "./PhoneFirstNotice";

export default function SectionCta({ showPhoneNotice = true }) {
  return (
    <section className="cta-section">
      <div className="container cta-content">
        <h2>Préparons votre location de benne</h2>
        <p>
          Indiquez-nous les déchets, le volume estimé et l'adresse du chantier
          pour recevoir un devis gratuit adapté à votre demande.
        </p>
        <div className="cta-actions">
          <NavLink to="/contact/" className="btn btn-light">
            Nous contacter
          </NavLink>
          <a href={`tel:${company.phoneRaw}`} className="btn btn-primary">
            Appeler {company.phoneLocalDisplay}
          </a>
        </div>
        {showPhoneNotice ? <PhoneFirstNotice compact /> : null}
      </div>
    </section>
  );
}
