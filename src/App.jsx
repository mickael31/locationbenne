import { Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import AboutPage from "./pages/AboutPage";
import BennesPage from "./pages/BennesPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PartnerPage from "./pages/PartnerPage";
import PrivacyPage from "./pages/PrivacyPage";
import ServicesPage from "./pages/ServicesPage";
import SeoManager from "./components/SeoManager";

export default function App() {
  return (
    <>
      <SeoManager />
      <SiteLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/357-2" element={<BennesPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/partenaire-elagage" element={<PartnerPage />} />
          <Route
            path="/politique-de-confidentialite"
            element={<PrivacyPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </SiteLayout>
    </>
  );
}
