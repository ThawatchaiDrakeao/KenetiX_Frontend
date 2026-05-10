// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "./assets/vite.svg";
// import heroImg from "./assets/hero.png";
import "./App.css";
import ButtonMain from "./componente/ButtonMain";
import Secondbutton from "./componente/Secondbutton";
import HeroButton from "./componente/HeroButton";
import Section_03 from "./componente/Section_03";

function App() {

  return (
    <div className="flex-col">
      <ButtonMain />
      <HeroButton />
      <Secondbutton />
       <Section_03 />
    </div>
  );
}

export default App;
