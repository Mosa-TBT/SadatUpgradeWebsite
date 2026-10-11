import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export const isReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Generic scroll reveals driven by data attributes:
 *  [data-split]        — line-masked SplitText heading reveal
 *  [data-reveal]       — single element fade/slide up
 *  [data-reveal-group] — children stagger in
 */
export function reveals(root) {
  if (isReducedMotion() || !root) return;
  const q = gsap.utils.selector(root);

  gsap.utils.toArray(q("[data-split]")).forEach((el) => {
    const split = SplitText.create(el, { type: "lines", mask: "lines" });
    gsap.from(split.lines, {
      yPercent: 115,
      duration: 0.9,
      ease: "power4.out",
      stagger: 0.09,
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });

  gsap.utils.toArray(q("[data-reveal]")).forEach((el) => {
    gsap.from(el, {
      y: 40,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });

  gsap.utils.toArray(q("[data-reveal-group]")).forEach((group) => {
    gsap.from(group.children, {
      y: 48,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: { trigger: group, start: "top 88%" },
    });
  });
}

// Recalculate pin distances once assets and fonts settle
if (typeof window !== "undefined") {
  window.addEventListener("load", () => ScrollTrigger.refresh());
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
