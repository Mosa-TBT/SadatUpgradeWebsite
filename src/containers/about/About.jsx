import { useRef } from "react";
import { Feature } from "../../components";
import { useGSAP, reveals } from "../../lib/gsapSetup";
import "./About.css";

const capabilities = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "Digital Marketing",
  "Custom Software",
  "AI & Automation",
];

const About = () => {
  const scope = useRef(null);

  useGSAP(() => reveals(scope.current), { scope });

  return (
    <section className="about section__padding" id="about" ref={scope}>
      <div className="about__intro">
        <p className="eyebrow" data-reveal>
          About Us
        </p>

        <h2 data-split>
          A Digital Innovation Company Turning Ideas into Real Solutions
        </h2>

        <p className="about__lead" data-reveal>
          Sadat Upgrade is an IT services company focused on transforming ideas
          into practical digital solutions. From modern websites and custom
          software to mobile applications and AI-powered experiences, we help
          businesses simplify their work, strengthen their digital presence, and
          unlock new opportunities for growth.
        </p>
      </div>

      <div className="about__grid" data-reveal-group>
        <div className="about__card">
          <Feature
            title="What We Do"
            text="We deliver web development, mobile applications, UI/UX design, and digital marketing — alongside custom software and AI-powered solutions — so your whole digital presence is handled in one place."
          />
        </div>

        <div className="about__card">
          <Feature
            title="How We Work"
            text="We keep requirements clear, schedules realistic, and communication open. Each engagement moves from idea to launch with a focus on quality, usability, and long-term value."
          />
        </div>

        <div className="about__card">
          <Feature
            title="What Drives Us"
            text="We build technology that is genuinely useful and dependable. Our goal is to help businesses adopt the right tools, work smarter, and grow with confidence."
          />
        </div>
      </div>

      <ul className="about__capabilities" data-reveal-group>
        {capabilities.map((capability) => (
          <li key={capability}>{capability}</li>
        ))}
      </ul>
    </section>
  );
};

export default About;