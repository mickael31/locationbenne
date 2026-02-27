import { NavLink } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="page-hero minimal">
      <div className="container">
        <h1>Page non trouvée</h1>
        <p>La page demandée n'existe pas.</p>
        <NavLink to="/" className="btn btn-primary">
          Retour à l'accueil
        </NavLink>
      </div>
    </section>
  );
}
