import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  isReducedMotion,
} from "../../lib/gsapSetup";
import "./Navbar.css";

const navigationLinks = [
  { label: "Home", href: "#home" },
  { label: "Our Services", href: "#services" },
  { label: "About Us", href: "#about" },
  { label: "Our Work", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

const Menu = ({ onNavigate, mobile = false }) => (
  <ul>
    {navigationLinks.map((item) => (
      <li key={item.href}>
        <a
          href={item.href}
          onClick={onNavigate}
          className={mobile ? "navbar__mobile-link" : undefined}
        >
          {item.label}
        </a>
      </li>
    ))}
  </ul>
);

Menu.propTypes = {
  onNavigate: PropTypes.func,
  mobile: PropTypes.bool,
};

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const scope = useRef(null);

  // Hide the navbar on scroll down and reveal it on scroll up.
  useGSAP(
    () => {
      if (isReducedMotion()) return;

      const header = scope.current;
      if (!header) return;

      let hidden = false;

      const st = ScrollTrigger.create({
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          // Keep the navbar visible while the mobile menu is open.
          if (toggleMenu) {
            if (hidden) {
              hidden = false;
              gsap.to(header, {
                yPercent: 0,
                duration: 0.3,
                ease: "power3.out",
                overwrite: "auto",
              });
            }
            return;
          }

          const shouldHide = self.direction === 1 && self.scroll() > 120;

          if (shouldHide === hidden) return;

          hidden = shouldHide;

          gsap.to(header, {
            yPercent: hidden ? -140 : 0,
            duration: 0.4,
            ease: "power3.out",
            overwrite: "auto",
          });
        },
      });

      return () => st.kill();
    },
    { scope, dependencies: [toggleMenu] },
  );

  // Animate the mobile menu when it opens.
  useGSAP(
    () => {
      if (!toggleMenu || isReducedMotion()) return;

      gsap.from(".navbar__mobile", {
        y: -16,
        autoAlpha: 0,
        duration: 0.35,
        ease: "power3.out",
      });

      gsap.from(".navbar__mobile li", {
        y: 14,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 0.3,
        ease: "power2.out",
      });
    },
    { scope, dependencies: [toggleMenu] },
  );

  const closeMobileMenu = () => setToggleMenu(false);

  return (
    <header className="navbar" ref={scope}>
      <nav className="navbar__pill" aria-label="Main navigation">
        {/* Brand logo */}
        <a
          href="#home"
          className="navbar__logo"
          aria-label="Sadat Upgrade home"
          onClick={closeMobileMenu}
        >
          <img
            src="/susvg.svg"
            alt="Sadat Upgrade"
            className="navbar__logo-image"
          />
        </a>

        {/* Desktop navigation */}
        <div className="navbar__links">
          <Menu />
        </div>

        {/* Desktop call to action */}
        <div className="navbar__sign">
          <ul>
            <li>
              <a href="#services" className="navbar__explore">
                Explore Services
              </a>
            </li>
            <li>
              <a href="#contact" className="navbar__cta">
                Let&apos;s Talk
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="navbar__toggle"
          aria-label={toggleMenu ? "Close navigation" : "Open navigation"}
          aria-expanded={toggleMenu}
          aria-controls="navbar-mobile-menu"
          onClick={() => setToggleMenu((open) => !open)}
        >
          {toggleMenu ? (
            <RiCloseLine size={27} aria-hidden="true" />
          ) : (
            <RiMenu3Line size={27} aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile navigation */}
      {toggleMenu && (
        <div
          id="navbar-mobile-menu"
          className="navbar__mobile"
        >
          <div className="navbar__mobile-links">
            <p className="navbar__mobile-eyebrow">
              DISCOVER SADAT UPGRADE
            </p>

            <Menu
              mobile
              onNavigate={closeMobileMenu}
            />
          </div>

          <div className="navbar__mobile-sign">
            <a
              href="#contact"
              className="navbar__cta"
              onClick={closeMobileMenu}
            >
              Let&apos;s Talk
              <span aria-hidden="true">↗</span>
            </a>

            <p className="navbar__mobile-caption">
              Thoughtful technology. Meaningful results.
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
