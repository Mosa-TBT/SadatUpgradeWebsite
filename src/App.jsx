import { useState } from "react";
import { Footer, Blog, Possibility, Features, Main, Info, Team, ContactUs } from "./containers";
import { Cta, Brand, Navbar, Preloader } from "./components";
import "./App.css";

const App = () => {
  const [booted, setBooted] = useState(false);

  return (
    <div className="app">
      <Preloader onReveal={() => setBooted(true)} />
      <div className="app__grain" aria-hidden="true" />
      <Navbar />
      <Main booted={booted} />
      <Brand />
      <Info />
      <Features />
      <Possibility />
      <Cta />
      <Blog />
      <Team />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default App;
