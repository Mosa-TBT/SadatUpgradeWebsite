import { useState } from "react";
import { Footer, Blog, Possibility, Features, Main, Info, About, Services, Team, ContactUs } from "./containers";
// Workstation section disabled for now. To re-enable: add `Workstation` to the
// import above and render `<Workstation />` right after `<Main />` below.
// import { Brand } from "./components"; // Brand section commented out
import { Cta, Navbar, Preloader } from "./components";
import "./App.css";

const App = () => {
  const [booted, setBooted] = useState(false);

  return (
    <div className="app">
      <Preloader onReveal={() => setBooted(true)} />
      <div className="app__grain" aria-hidden="true" />
      <Navbar />
      <Main booted={booted} />
      {/* <Workstation /> */}
      {/* <Brand /> */}
      <Info />
      <Services />
      <About />
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
