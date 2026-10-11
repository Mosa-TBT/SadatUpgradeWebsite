import { useRef } from "react";
import { gsap, useGSAP, isReducedMotion } from "../../lib/gsapSetup";
import { google, slack, atlassian, dropbox, shopify } from "./brand.data";
import "./Brand.css";

const logos = [
  { src: google, alt: "Google" },
  { src: slack, alt: "Slack" },
  { src: atlassian, alt: "Atlassian" },
  { src: dropbox, alt: "Dropbox" },
  { src: shopify, alt: "Shopify" },
];

const Brand = () => {
  const scope = useRef(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      const tween = gsap.to(".brand__track", {
        xPercent: -50,
        ease: "none",
        duration: 24,
        repeat: -1,
      });

      const track = scope.current.querySelector(".brand__track");
      const slow = () => gsap.to(tween, { timeScale: 0.2, duration: 0.4 });
      const resume = () => gsap.to(tween, { timeScale: 1, duration: 0.4 });

      track.addEventListener("mouseenter", slow);
      track.addEventListener("mouseleave", resume);
      return () => {
        track.removeEventListener("mouseenter", slow);
        track.removeEventListener("mouseleave", resume);
      };
    },
    { scope },
  );

  return (
    <section className="brand" ref={scope} aria-label="Partners">
      <div className="brand__track">
        <ul className="brand__group">
          {logos.map((logo) => (
            <li key={logo.alt}>
              <img src={logo.src} alt={logo.alt} />
            </li>
          ))}
        </ul>
        <ul className="brand__group" aria-hidden="true">
          {logos.map((logo) => (
            <li key={logo.alt}>
              <img src={logo.src} alt="" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Brand;
