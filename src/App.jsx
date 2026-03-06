import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import HomePage from "./pages/HomePage";
import SeoManager from "./components/SeoManager";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const BennesPage = lazy(() => import("./pages/BennesPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const PartnerPage = lazy(() => import("./pages/PartnerPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));

function RouteFallback() {
  return (
    <div className="route-fallback">
      <div className="container">
        <div className="route-fallback-card">Chargement...</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <SeoManager />
      <SiteLayout>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/bennes" element={<BennesPage />} />
            <Route path="/357-2" element={<Navigate to="/bennes" replace />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/partenaire-elagage" element={<PartnerPage />} />
            <Route
              path="/politique-de-confidentialite"
              element={<PrivacyPage />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </SiteLayout>
    </>
  );
}
