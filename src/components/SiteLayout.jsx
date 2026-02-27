import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { company, navLinks } from "../data/content";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

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
        <button
          className={`menu-toggle${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={menuOpen ? "open" : ""}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setMenuOpen(false)}
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
