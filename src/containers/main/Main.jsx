import { useRef } from "react";
import PropTypes from "prop-types";
import {
  gsap,
  useGSAP,
  SplitText,
  isReducedMotion,
} from "../../lib/gsapSetup";

import people from "../../assets/people.png";
import robot from "../../assets/ai_robot.png";
import SoftAurora from "../../components/ui/SoftAurora";

import "./Main.css";

const phrases = [
  "Hi! I'm your Sadat Upgrade assistant.",
  "Need a website? Let's build something amazing.",
  "Have an idea? Let's turn it into reality.",
  "Your next digital upgrade starts here.",
];

const Main = ({ booted }) => {
  const scope = useRef(null);

  // Hero entrance animation and ambient robot animation.
  // Animations begin after the preloader has finished.
  useGSAP(
    () => {
      if (!booted) return;

      if (isReducedMotion()) return;

      const split = SplitText.create(".hero__title", {
        type: "lines,chars",
        mask: "lines",
      });

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      tl.from(".hero__eyebrow", {
        y: 24,
        autoAlpha: 0,
        duration: 0.6,
      })
        .from(
          split.chars,
          {
            yPercent: 120,
            duration: 0.8,
            stagger: 0.018,
          },
          "-=0.3",
        )
        .from(
          ".hero__sub",
          {
            y: 28,
            autoAlpha: 0,
            duration: 0.7,
          },
          "-=0.45",
        )
        .from(
          ".hero__form",
          {
            y: 28,
            autoAlpha: 0,
            duration: 0.7,
          },
          "-=0.5",
        )
        .from(
          ".hero__people",
          {
            y: 20,
            autoAlpha: 0,
            duration: 0.6,
          },
          "-=0.5",
        )
        .from(
          ".hero__visual",
          {
            y: 90,
            autoAlpha: 0,
            scale: 0.92,
            duration: 1.2,
            ease: "power3.out",
          },
          0.4,
        );

      // Floating robot animation.
      gsap.to(".hero__float", {
        y: -16,
        rotation: 1.4,
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Shadow breathes in sync with the robot.
      gsap.to(".hero__shadow", {
        scaleX: 0.78,
        autoAlpha: 0.45,
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Robot speech bubble.
      const bubble = scope.current?.querySelector(".hero__bubble");
      const bubbleText = scope.current?.querySelector(
        ".hero__bubble-text",
      );

      if (bubble && bubbleText) {
        gsap.set(bubble, {
          autoAlpha: 0,
          scale: 0.5,
        });

        const bubbleTl = gsap.timeline({
          repeat: -1,
          delay: 2.6,
        });

        phrases.forEach((phrase) => {
          bubbleTl
            .call(() => {
              bubbleText.textContent = phrase;
            })
            .fromTo(
              bubble,
              {
                scale: 0.5,
                autoAlpha: 0,
              },
              {
                scale: 1,
                autoAlpha: 1,
                duration: 0.45,
                ease: "back.out(2.2)",
              },
            )
            .to(
              bubble,
              {
                scale: 0.5,
                autoAlpha: 0,
                duration: 0.3,
                ease: "power2.in",
              },
              "+=2.6",
            );
        });
      }
    },
    {
      scope,
      dependencies: [booted],
      revertOnUpdate: true,
    },
  );

  // Cinematic scroll experience on desktop.
  useGSAP(
    () => {
      if (isReducedMotion()) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px)", () => {
        const tl = gsap.timeline({
          defaults: {
            ease: "none",
          },
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: "+=180%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        // Scene 1: Hero content moves upward.
        tl.to(
          ".hero__content",
          {
            yPercent: -8,
            duration: 2,
          },
          0,
        )
          .to(
            ".hero__title",
            {
              scale: 0.92,
              transformOrigin: "left top",
              duration: 2,
            },
            0,
          )

          // Scene 2: Animated floor and robot parallax.
          .to(
            ".floor__grid",
            {
              "--gy": "140px",
              opacity: 0.9,
              duration: 2.5,
            },
            0,
          )
          .to(
            ".hero__visual",
            {
              yPercent: -12,
              rotate: -2.5,
              duration: 2.5,
            },
            0,
          )

          // Scene 3: Brand wordmark appears.
          .to(
            ".hero__content",
            {
              autoAlpha: 0.15,
              duration: 1,
            },
            2,
          )
          .to(
            ".hero__visual",
            {
              autoAlpha: 0.25,
              scale: 0.94,
              duration: 1,
            },
            2,
          )
          .fromTo(
            ".hero__bigword",
            {
              autoAlpha: 0,
              scale: 0.8,
            },
            {
              autoAlpha: 1,
              scale: 1,
              duration: 1.2,
              ease: "power2.out",
            },
            2.2,
          );
      });

      return () => mm.revert();
    },
    {
      scope,
    },
  );

  return (
    <section className="hero" id="home" ref={scope}>
      {!isReducedMotion() && (
        <div className="hero__aurora" aria-hidden="true">
          <SoftAurora
            color1="#10b981"
            color2="#3b82f6"
            brightness={0.45}
            speed={0.6}
            mouseInfluence={0}
          />
        </div>
      )}

      <div className="floor" aria-hidden="true">
        <div className="floor__grid" />
        <div className="floor__horizon" />
      </div>

      <div className="hero__bigword" aria-hidden="true">
        SADAT UPGRADE
      </div>

      <div className="hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow eyebrow">
            SADAT UPGRADE — YOUR DIGITAL INNOVATION PARTNER
          </p>

          <h1 className="hero__title">
            <span className="hero__title-line">
              Build Smarter.
            </span>
            <span className="hero__title-line">
              Upgrade Your Future.
            </span>
          </h1>

          <p className="hero__sub">
            We turn ambitious ideas into powerful digital experiences.
            From modern websites and custom software to AI-powered
            solutions, Sadat Upgrade helps businesses innovate, grow,
            and stay ahead in a connected world.
          </p>

          <form
            className="hero__form"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="email"
              name="email"
              placeholder="Your Work Email Address"
              aria-label="Your work email address"
              autoComplete="email"
            />

            <button type="submit">
              Let's Build Together
            </button>
          </form>

          <div className="hero__people">
            <img
              src={people}
              alt="Businesses embracing digital innovation"
            />

            <span>
              Technology-driven solutions for businesses ready to grow.
            </span>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__float">
            <img
              className="hero__robot"
              src={robot}
              alt="Sadat Upgrade AI assistant robot"
            />

            <div
              className="hero__bubble"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="hero__bubble-text">
                Hi! I'm your Sadat Upgrade assistant.
              </p>
            </div>
          </div>

          <div
            className="hero__shadow"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

Main.propTypes = {
  booted: PropTypes.bool.isRequired,
};

export default Main;
