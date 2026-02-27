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

  useEffect(() => {
    function handleContactLinkClick(event) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const contactLink = target.closest('a[href^="tel:"], a[href^="mailto:"]');
      if (!contactLink) return;

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const href = contactLink.getAttribute("href");
      if (!href) return;

      event.preventDefault();
      window.location.assign(href);
    }

    document.addEventListener("click", handleContactLinkClick);
    return () => {
      document.removeEventListener("click", handleContactLinkClick);
    };
  }, []);

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
