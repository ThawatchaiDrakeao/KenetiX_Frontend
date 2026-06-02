import "./App.css";
import HeroButton from "./componente/HeroButton";
import Secondbutton from "./componente/Secondbutton";
import Section01 from "./componente/Section01";
import Section_03 from "./componente/Section_03";
import SignupPage from "./componente/SignupPage";
import HowItWorks from "./componente/HowItWorks";
import SingleProductPage from "./componente/SingleProductPage";
import Navbar from "./componente/Navbar";
import { LanguageProvider } from "./context/LanguageProvider";

function AppContent() {
  const currentPath = window.location.pathname.replace(/\/$/, "");

  if (currentPath === "/how-it-works") {
    return <HowItWorks />;
  }

  if (currentPath === "/product") {
    return <SingleProductPage />;
  }

  return (
    <>
      <Navbar />
      <Section01 />
      <SignupPage />

      <div className="flex-col">
        <HeroButton />
        <Secondbutton />
        <Section_03 />
      </div>
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
