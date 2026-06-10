import { Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorksSection from '../components/HowItWorksSection';
import HowItWorksPage from '../pages/HowItWorksPage';
import Showcase from '../components/Showcase';
import Reviews from '../components/Reviews';
import Pricing from '../components/Pricing';
import Community from '../components/Community';
import OurStory from '../components/OurStory';
import FAQ from '../components/FAQ';
import TermsSection from '../components/TermsSection';
import PrivacySection from '../components/PrivacySection';
import DamagePolicySection from '../components/DamagePolicySection';
import ContactPage from '../pages/ContactPage';
import Catalog from '../pages/Catalog';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import Login from "../pages/Login";
import SignupPage from "../components/SignupPage";
import ScrollArrow from "../components/ScrollArrow";
import UserDashboard from "../pages/UserDashboard";
import CheckOut from "./CheckOut";
import OrderConfirmation from "./OrderConfirmation";

function HomeContent() {
  return (
    <>
      <ScrollArrow />
      <Hero />
      <FadeSection><Features /></FadeSection>
      <FadeSection><HowItWorksSection /></FadeSection>
      <FadeSection><Showcase /></FadeSection>
      <FadeSection><Reviews /></FadeSection>
      <FadeSection><Pricing /></FadeSection>
      <FadeSection><Community /></FadeSection>
      <FadeSection><OurStory /></FadeSection>
      <FadeSection><FAQ /></FadeSection>
      <FadeSection><CTA /></FadeSection>
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
          <Route path="userdashboard" element={<ProtectedUserRoute><UserDashboard /></ProtectedUserRoute>} />
          {/* <Route path="catalognavbar" element={<CatalogNavbar />} /> */}
          <Route path="checkout" element={<CheckOut />} />
          <Route path="orderconfirmation" element={<OrderConfirmation />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}