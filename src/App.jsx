import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import HomePage from "./pages/HomePage";
import SeoManager from "./components/SeoManager";

const clientPages = {
  AboutPage: lazy(() => import("./pages/AboutPage")),
  BennesPage: lazy(() => import("./pages/BennesPage")),
  ContactPage: lazy(() => import("./pages/ContactPage")),
  LocationPage: lazy(() => import("./pages/LocationPage")),
  NotFoundPage: lazy(() => import("./pages/NotFoundPage")),
  PartnerPage: lazy(() => import("./pages/PartnerPage")),
  PrivacyPage: lazy(() => import("./pages/PrivacyPage")),
  ServicesPage: lazy(() => import("./pages/ServicesPage")),
};

function RouteFallback() {
  return (
    <div className="route-fallback">
      <div className="container">
        <div className="route-fallback-card">Chargement...</div>
      </div>
    </div>
  );
}

export default function App({ pages = clientPages }) {
  const {
    AboutPage,
    BennesPage,
    ContactPage,
    LocationPage,
    NotFoundPage,
    PartnerPage,
    PrivacyPage,
    ServicesPage,
  } = pages;

  return (
    <>
      <SeoManager />
      <SiteLayout>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" caseSensitive element={<HomePage />} />
            <Route path="/about/" caseSensitive element={<AboutPage />} />
            <Route path="/contact/" caseSensitive element={<ContactPage />} />
            <Route path="/bennes/" caseSensitive element={<BennesPage />} />
            <Route
              path="/357-2/"
              caseSensitive
              element={<Navigate to="/bennes/" replace />}
            />
            <Route path="/services/" caseSensitive element={<ServicesPage />} />
            <Route
              path="/location-benne-montauban/"
              caseSensitive
              element={<LocationPage locationKey="montauban" />}
            />
            <Route
              path="/location-benne-toulouse/"
              caseSensitive
              element={<LocationPage locationKey="toulouse" />}
            />
            <Route
              path="/location-benne-albi/"
              caseSensitive
              element={<LocationPage locationKey="albi" />}
            />
            <Route
              path="/partenaire-elagage/"
              caseSensitive
              element={<PartnerPage />}
            />
            <Route
              path="/politique-de-confidentialite/"
              caseSensitive
              element={<PrivacyPage />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </SiteLayout>
    </>
  );
}
