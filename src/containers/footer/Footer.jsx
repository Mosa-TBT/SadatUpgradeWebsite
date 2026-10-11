import { useRef } from "react";
import { useGSAP, reveals } from "../../lib/gsapSetup";
import "./Footer.css";

const Footer = () => {
  const scope = useRef(null);

  useGSAP(() => reveals(scope.current), { scope });

  return (
    <footer className="footer" ref={scope}>
      <div className="floor floor--static" aria-hidden="true">
        <div className="floor__grid" />
      </div>

      <div className="footer__wrapper">
        <h2 className="footer__heading" data-split>
          Ready to build something extraordinary with technology?
        </h2>

        <a
          href="mailto:info@sadatupgrade.com"
          className="footer__btn"
          data-reveal
        >
          Start a Project
          <span aria-hidden="true">&rarr;</span>
        </a>

        <div className="footer__links" data-reveal-group>
          <div className="footer__brand">
            <a
              href="#home"
              className="footer__logo"
              aria-label="Sadat Upgrade home"
            >
              Sadat <span>Upgrade</span>
            </a>

            <p>
              We build modern websites, custom software, and intelligent
              digital solutions that help businesses move forward.
            </p>

            <p>
              Sadat Upgrade &copy; {new Date().getFullYear()} — All rights
              reserved.
            </p>
          </div>

          <div className="footer__section">
            <span>Our Services</span>
            <ul>
              <li>
                <a href="#services">Web Design & Development</a>
              </li>
              <li>
                <a href="#services">Custom Software</a>
              </li>
              <li>
                <a href="#services">AI & Automation</a>
              </li>
              <li>
                <a href="#services">Digital Solutions</a>
              </li>
            </ul>
          </div>

          <div className="footer__section">
            <span>Explore</span>
            <ul>
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#portfolio">Our Projects</a>
              </li>
              <li>
                <a href="#contact">Contact Us</a>
              </li>
            </ul>
          </div>

          <div className="footer__section">
            <span>Get in Touch</span>
            <ul>
              <li>
                <a href="mailto:info@sadatupgrade.com">
                  Email Us
                </a>
              </li>
              <li>
                <a href="#contact">Discuss Your Project</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__wordmark" aria-hidden="true" data-reveal>
        SADAT UPGRADE
      </div>

      <div className="footer__copyright">
        <p>
          We create digital experiences with a focus on quality, usability,
          and long-term value.
        </p>
      </div>
    </footer>
  );
};

export default Footer;