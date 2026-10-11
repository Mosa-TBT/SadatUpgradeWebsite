import { useRef } from "react";
import { Feature } from "../../components";
import { useGSAP, reveals } from "../../lib/gsapSetup";
import "./Info.css";

const Info = () => {
  const scope = useRef(null);

  useGSAP(() => reveals(scope.current), { scope });

  return (
    <section className="info section__padding" id="info" ref={scope}>
      {/* Section introduction */}
      <div className="info__intro" data-reveal>
        <Feature
          title="What Is Sadat Upgrade?"
          text="Sadat Upgrade is an IT services company focused on transforming ideas into practical digital solutions. From modern websites and custom software to AI-powered experiences, we help businesses simplify their work, strengthen their digital presence, and unlock new opportunities for growth."
        />
      </div>

      <div className="info__layout">
        {/* Sticky heading */}
        <div className="info__sticky">
          <h2 className="info__heading" data-split>
            Technology that transforms ideas into possibilities.
          </h2>

          <a className="info__link" href="#services" data-reveal>
            Explore Our Services
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        {/* Service highlights */}
        <div className="info__cards" data-reveal-group>
          <div className="info__card">
            <Feature
              title="Web Design & Development"
              text="We create modern, responsive, and high-performance websites that communicate your brand, deliver exceptional user experiences, and turn visitors into customers."
            />
          </div>

          <div className="info__card">
            <Feature
              title="Custom Software Solutions"
              text="Every business has unique challenges. We develop tailored software and digital systems that streamline workflows, improve efficiency, and help your organization operate smarter."
            />
          </div>

          <div className="info__card">
            <Feature
              title="AI & Digital Innovation"
              text="Bring artificial intelligence into your business with intelligent automation, AI-powered experiences, and innovative digital tools designed to reduce repetitive work and open new possibilities."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Info;