import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { getMailtoHref } from "../contactLinks";
import SiteImage from "./SiteImage";
import { company, navLinks } from "../data/content";
import { locationPages } from "../data/locationPages";
import { getBreadcrumbItems } from "../seo/seoConfig";

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
            alt=""
            width={64}
            height={64}
            responsive={false}
            loading="eager"
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
              end={link.to === "/"}
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <NavLink to="/contact/" className="btn btn-primary small">
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
        <div className="footer-business">
          <strong>{company.name}</strong>
          <span>{company.address}</span>
          <a href={`tel:${company.phoneRaw}`}>{company.phoneLocalDisplay}</a>
        </div>
        <nav className="footer-locations" aria-label="Zones desservies">
          <strong>Location de benne par ville</strong>
          {locationPages.map((locationPage) => (
            <NavLink key={locationPage.key} to={locationPage.path}>
              {locationPage.city}
            </NavLink>
          ))}
        </nav>
        <div className="footer-legal">
          <NavLink to="/politique-de-confidentialite/">
            Politique de confidentialité
          </NavLink>
          <p>Droit d'auteur © 2026 Location Benne Occitanie</p>
        </div>
      </div>
    </footer>
  );
}

function Breadcrumbs({ pathname }) {
  if (pathname === "/") return null;

  const items = getBreadcrumbItems(pathname);
  if (items.length < 2) return null;

  return (
    <nav className="breadcrumb" aria-label="Fil d'Ariane">
      <ol className="container breadcrumb-list">
        {items.map((item, index) => {
          const isCurrentPage = index === items.length - 1 && item.path !== "/";

          return (
            <li key={`${item.path}-${item.name}`}>
              {isCurrentPage ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <NavLink to={item.path}>{item.name}</NavLink>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function SiteLayout({ children }) {
  const location = useLocation();

  return (
    <>
      <a className="skip-link" href="#main-content">
        Aller au contenu principal
      </a>
      <Header />
      <main id="main-content" tabIndex="-1">
        <Breadcrumbs pathname={location.pathname} />
        {children}
      </main>
      <a
        className="floating-call"
        href={`tel:${company.phoneRaw}`}
        aria-label={`Appeler maintenant : ${company.phoneLocalDisplay}`}
      >
        Appeler maintenant
      </a>
      <Footer />
    </>
  );
}
