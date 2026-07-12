import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import AboutPage from "./pages/AboutPage";
import BennesPage from "./pages/BennesPage";
import ContactPage from "./pages/ContactPage";
import LocationPage from "./pages/LocationPage";
import NotFoundPage from "./pages/NotFoundPage";
import PartnerPage from "./pages/PartnerPage";
import PrivacyPage from "./pages/PrivacyPage";
import ServicesPage from "./pages/ServicesPage";

const serverPages = {
  AboutPage,
  BennesPage,
  ContactPage,
  LocationPage,
  NotFoundPage,
  PartnerPage,
  PrivacyPage,
  ServicesPage,
};

export function renderApp(pathname) {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={pathname}>
        <App pages={serverPages} />
      </StaticRouter>
    </React.StrictMode>,
  );
}
