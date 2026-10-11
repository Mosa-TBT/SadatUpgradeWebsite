import { useRef } from "react";
import {
  gsap,
  useGSAP,
  reveals,
  isReducedMotion,
} from "../../lib/gsapSetup";
import possibilityImage from "../../assets/possibility.webp";
import "./Possibility.css";

const Possibility = () => {
  const scope = useRef(null);

  useGSAP(
    () => {
      reveals(scope.current);

      if (isReducedMotion()) return;

      // Masked parallax reveal on the visual
      const st = {
        trigger: ".possibility__image",
        start: "top 90%",
        end: "top 30%",
        scrub: 1,
      };

      gsap.fromTo(
        ".possibility__image",
        { clipPath: "inset(18% 18% 18% 18% round 28px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 28px)",
          ease: "none",
          scrollTrigger: st,
        },
      );

      gsap.fromTo(
        ".possibility__image img",
        { scale: 1.3 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { ...st },
        },
      );
    },
    { scope },
  );

  return (
    <section
      className="possibility section__padding"
      id="possibility"
      ref={scope}
    >
      <div className="possibility__image">
        <img
          src={possibilityImage}
          alt="Innovative digital solutions by Sadat Upgrade"
        />
      </div>

      <div className="possibility__content">
        <p className="eyebrow" data-reveal>
          Our Vision
        </p>

        <h2 data-split>
          We imagine. We build. We transform.
        </h2>

        <p className="possibility__text" data-reveal>
          At Sadat Upgrade, we turn ambitious ideas into practical digital
          solutions. From modern websites and custom software to AI-powered
          tools and intelligent automation, we help businesses work smarter,
          deliver better experiences, and embrace the opportunities of a
          connected world.
        </p>

        <a className="possibility__link" href="#contact" data-reveal>
          Let's Bring Your Idea to Life
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </section>
  );
};

export default Possibility;
