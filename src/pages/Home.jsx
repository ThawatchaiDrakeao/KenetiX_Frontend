import { Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Features from "../components/Features.jsx";
import HowItWorksSection from "../components/HowItWorksSection.jsx";
import HowItWorksPage from "../pages/HowItWorksPage.jsx";
import Showcase from "../components/Showcase.jsx";
import Reviews from "../components/Reviews.jsx";
import Pricing from "../components/Pricing.jsx";
import Community from "../components/Community.jsx";
import OurStory from "../components/OurStory.jsx";
import FAQ from "../components/FAQ.jsx";
import TermsSection from "../components/TermsSection.jsx";
import PrivacySection from "../components/PrivacySection.jsx";
import DamagePolicySection from "../components/DamagePolicySection.jsx";
import ContactPage from "../pages/ContactPage.jsx";
import Catalog from "../pages/Catalog.jsx";
import CTA from "../components/CTA.jsx";
import Footer from "../components/Footer.jsx";
import Login from "../pages/Login.jsx";
import SignupPage from "../components/SignupPage.jsx";
import ScrollArrow from "../components/ScrollArrow.jsx";
import UserDashboard from "../pages/UserDashboard.jsx";
import CheckOut from "./CheckOut.jsx";
import ProtectedUserRoute from "../components/ProtectedUserRoute.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function FadeSection({ children }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      variants={fadeUp}
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

function HomeContent() {
  return (
    <>
      <ScrollArrow />
      <Hero />
      <FadeSection>
        <Features />
      </FadeSection>
      <FadeSection>
        <HowItWorksSection />
      </FadeSection>
      <FadeSection>
        <Showcase />
      </FadeSection>
      <FadeSection>
        <Reviews />
      </FadeSection>
      <FadeSection>
        <Pricing />
      </FadeSection>
      <FadeSection>
        <Community />
      </FadeSection>
      <FadeSection>
        <OurStory />
      </FadeSection>
      <FadeSection>
        <FAQ />
      </FadeSection>
      <FadeSection>
        <CTA />
      </FadeSection>
    </>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-dark font-sora overflow-x-hidden">
      <Navbar />
      <main>
        <Routes>
          {/*<Route index element={<HomeContent />} /> */}
          <Route path="/*" element={<HomeContent />} />
          <Route path="howitworkspage" element={<HowItWorksPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="login" element={<Login />} />
          <Route path="catalog" element={<Catalog />} />
          <Route
            path="userdashboard"
            element={
              <ProtectedUserRoute>
                <UserDashboard />
              </ProtectedUserRoute>
            }
          />
          {/* <Route path="catalognavbar" element={<CatalogNavbar />} /> */}
          <Route path="checkout" element={<CheckOut />} />
          <Route path="terms" element={<TermsSection />} />
          <Route path="privacy" element={<PrivacySection />} />
          <Route path="damage" element={<DamagePolicySection />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
