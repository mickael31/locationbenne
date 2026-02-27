import { NavLink } from "react-router-dom";
import { company, navLinks } from "../data/content";

function Header() {
  return (
    <header className="site-header">
      <div className="top-bar">
        <a href={`tel:${company.phoneRaw}`}>{company.phoneDisplay}</a>
        <a href={`mailto:${company.email}`}>{company.email}</a>
      </div>
      <div className="nav-wrap">
        <NavLink className="logo-link" to="/">
          <img src={company.logo} alt={company.name} />
          <span>{company.name}</span>
        </NavLink>
        <nav>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <NavLink to="/contact" className="btn btn-primary small">
          Demander un devis
        </NavLink>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <NavLink to="/politique-de-confidentialite">
          Politique de confidentialité
        </NavLink>
        <p>Droit d'auteur © 2026 Location Benne Occitanie</p>
      </div>
    </footer>
  );
}

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <a className="floating-call" href={`tel:${company.phoneRaw}`}>
        Appeler maintenant
      </a>
      <Footer />
    </>
  );
}
