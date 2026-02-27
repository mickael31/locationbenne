import { NavLink } from "react-router-dom";
import { company } from "../data/content";

export default function NotFoundPage() {
  return (
    <section className="page-hero page-hero-not-found">
      <div className="container not-found-wrap">
        <article className="not-found-card">
          <p className="not-found-code">404</p>
          <h1>Page introuvable</h1>
          <p>
            Le lien demande n'existe pas ou a ete deplace. Vous pouvez revenir
            a l'accueil ou nous contacter directement.
          </p>
          <div className="button-row">
            <NavLink to="/" className="btn btn-primary">
              Retour a l'accueil
            </NavLink>
            <NavLink to="/contact" className="btn btn-light">
              Nous contacter
            </NavLink>
            <a href={`tel:${company.phoneRaw}`} className="btn btn-ghost">
              Appeler {company.phoneLocalDisplay}
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
