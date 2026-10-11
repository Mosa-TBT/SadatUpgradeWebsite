import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { gsap, useGSAP, isReducedMotion } from "../../lib/gsapSetup";
import "./Preloader.css";

const Preloader = ({ onReveal }) => {
  const scope = useRef(null);
  const [finished, setFinished] = useState(false);

  useGSAP(
    () => {
      if (isReducedMotion()) {
        onReveal();
        setFinished(true);
        return;
      }

      const counter = { value: 0 };
      const counterEl = scope.current.querySelector(".preloader__count");

      const tl = gsap.timeline({
        onComplete: () => setFinished(true),
      });

      tl.to(counter, {
        value: 100,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => {
          counterEl.textContent = String(Math.round(counter.value)).padStart(
            3,
            "0",
          );
        },
      })
        .to(
          ".preloader__bar-fill",
          { scaleX: 1, duration: 1.6, ease: "power2.inOut" },
          0,
        )
        .to(
          ".preloader__center",
          { yPercent: -40, autoAlpha: 0, duration: 0.45, ease: "power2.in" },
          1.75,
        )
        // curtain lifts — hero intro starts now
        .call(onReveal, null, 2)
        .to(".preloader__panel--front", {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
        }, 2)
        .to(
          ".preloader__panel--back",
          { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
          2.1,
        );
    },
    { scope },
  );

  if (finished) return null;

  return (
    <div className="preloader" ref={scope} aria-hidden="true">
      <div className="preloader__panel preloader__panel--back" />
      <div className="preloader__panel preloader__panel--front" />
      <div className="preloader__center">
        <p className="preloader__label">Initializing GPT-Bot</p>
        <p className="preloader__count">000</p>
        <div className="preloader__bar">
          <div className="preloader__bar-fill" />
        </div>
      </div>
    </div>
  );
};

Preloader.propTypes = {
  onReveal: PropTypes.func.isRequired,
};

export default Preloader;
