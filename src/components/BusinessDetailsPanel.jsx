import { useLocation } from "react-router-dom";
import { businessDetails } from "../data/businessDetails";

export default function BusinessDetailsPanel() {
  const { pathname } = useLocation();
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";

  if (normalizedPath !== "/contact") return null;

  return (
    <section className="section" aria-labelledby="business-details-title">
      <div className="container">
        <article className="card contact-info-card fade-in">
          <p className="service-tag">Informations de l'entreprise</p>
          <h2 id="business-details-title">Horaires et identification</h2>
          <div className="contact-meta-grid">
            <article>
              <h3>Horaires</h3>
              <p>{businessDetails.openingHoursLabel}</p>
            </article>
            <article>
              <h3>Mode d'intervention</h3>
              <p>{businessDetails.serviceModeLabel}</p>
            </article>
            <article>
              <h3>Zone desservie</h3>
              <p>{businessDetails.serviceAreaLabel}</p>
            </article>
            <article>
              <h3>Exploitant</h3>
              <p>{businessDetails.legalName}</p>
            </article>
            <article>
              <h3>SIREN</h3>
              <p>{businessDetails.siren}</p>
            </article>
            <article>
              <h3>SIRET</h3>
              <p>{businessDetails.siret}</p>
            </article>
          </div>
        </article>
      </div>
    </section>
  );
}
