import { useRef } from "react";
import {
  gsap,
  useGSAP,
  reveals,
  isReducedMotion,
} from "../../lib/gsapSetup";
import "./CTA.css";

const Cta = () => {
  const scope = useRef(null);

  useGSAP(
    () => {
      reveals(scope.current);

      if (isReducedMotion()) return;

      // Magnetic button effect
      const btn = scope.current.querySelector(".cta__btn");

      if (!btn) return;

      const xTo = gsap.quickTo(btn, "x", {
        duration: 0.4,
        ease: "power3",
      });

      const yTo = gsap.quickTo(btn, "y", {
        duration: 0.4,
        ease: "power3",
      });

      const move = (e) => {
        const r = btn.getBoundingClientRect();

        xTo((e.clientX - r.left - r.width / 2) * 0.35);
        yTo((e.clientY - r.top - r.height / 2) * 0.45);
      };

      const reset = () => {
        xTo(0);
        yTo(0);
      };

      btn.addEventListener("mousemove", move);
      btn.addEventListener("mouseleave", reset);

      return () => {
        btn.removeEventListener("mousemove", move);
        btn.removeEventListener("mouseleave", reset);
      };
    },
    { scope },
  );

  return (
    <section className="cta section__margin" id="cta" ref={scope}>
      <div className="cta__wrapper" data-reveal>
        <div className="cta__content">
          <p>Ready to Upgrade Your Business?</p>

          <h3>
            Let's turn your ideas into powerful digital solutions.
          </h3>
        </div>

        <a
          className="cta__btn"
          href="mailto:info@sadatupgrade.com"
          aria-label="Contact Sadat Upgrade by email"
        >
          Let's Talk
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </section>
  );
};

export default Cta;