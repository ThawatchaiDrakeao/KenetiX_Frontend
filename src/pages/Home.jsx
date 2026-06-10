import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import Features from '../components/Features.jsx';
import HowItWorksSection from '../components/HowItWorksSection.jsx';
import HowItWorksPage from '../pages/HowItWorksPage.jsx';
import Showcase from '../components/Showcase.jsx';
import Reviews from '../components/Reviews.jsx';
import Pricing from '../components/Pricing.jsx';
import Community from '../components/Community.jsx';
import OurStory from '../components/OurStory.jsx';
import FAQ from '../components/FAQ.jsx';
import ContactPage from '../pages/ContactPage.jsx';
import Catalog from '../pages/Catalog.jsx';
import CTA from '../components/CTA.jsx';
import Footer from '../components/Footer.jsx';
import Login from "../pages/Login.jsx";
import SignupPage from "../components/SignupPage.jsx";
import ScrollArrow from "../components/ScrollArrow.jsx";
import UserDashboard from "../pages/UserDashboard.jsx"
//import CatalogNavbar from "../components/catalog/CatalogNavbar";
import CheckOut from "./CheckOut.jsx";
import OrderConfirmation from "./Orderconfirmation.jsx";

function HomeContent() {
  return (
    <>
      <ScrollArrow />
      <Hero />
      <Features />
      <HowItWorksSection />
      <Showcase />
      <Reviews />
      <Pricing />
      <Community />
      <OurStory />
      <FAQ />
      <CTA />
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
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="userdashboard" element={<UserDashboard />} />
          {/* <Route path="catalognavbar" element={<CatalogNavbar />} /> */}
          <Route path="checkout" element={<CheckOut />} />
          <Route path="orderconfirmation" element={<OrderConfirmation />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}