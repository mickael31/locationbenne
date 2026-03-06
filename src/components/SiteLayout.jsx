import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { getMailtoHref } from "../contactLinks";
import SiteImage from "./SiteImage";
import { company, navLinks } from "../data/content";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuId = "site-navigation";

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    function handlePhoneClick(event) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const phoneLink = target.closest('a[href^="tel:"]');
      if (!phoneLink) return;

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

      const href = phoneLink.getAttribute("href");
      if (!href) return;

      event.preventDefault();
      const confirmed = window.confirm(
        `Voulez-vous appeler le ${company.phoneLocalDisplay} ?`,
      );

      if (confirmed) {
        window.location.assign(href);
      }
    }

    document.addEventListener("click", handlePhoneClick);
    return () => {
      document.removeEventListener("click", handlePhoneClick);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="top-bar">
        <a href={`tel:${company.phoneRaw}`}>{company.phoneLocalDisplay}</a>
        <a href={getMailtoHref()}>{company.email}</a>
      </div>
      <div className="nav-wrap">
        <NavLink className="logo-link" to="/">
          <SiteImage
            src={company.logoHeader || company.logo}
            alt={company.name}
            width={300}
            height={208}
            responsive={false}
            loading="eager"
            fetchPriority="high"
          />
          <span>{company.name}</span>
        </NavLink>
        <button
          type="button"
          className={`menu-toggle${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          aria-controls={menuId}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          id={menuId}
          className={menuOpen ? "open" : ""}
          aria-label="Navigation principale"
        >
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
      <a
        className="floating-call"
        href={`tel:${company.phoneRaw}`}
        aria-label={`Appeler ${company.phoneLocalDisplay}`}
      >
        Appeler maintenant
      </a>
      <Footer />
    </>
  );
}
