import { useRef } from "react";
import { Feature } from "../../components";
import { useGSAP, reveals } from "../../lib/gsapSetup";
import "./Services.css";

const servicesData = [
  {
    id: 1,
    title: "Web Development",
    text: "Modern, responsive, high-performance websites that communicate your brand clearly, deliver a polished user experience, and turn visitors into customers.",
  },
  {
    id: 2,
    title: "Mobile App Development",
    text: "Cross-platform mobile applications built to feel fast, intuitive, and reliable on every screen — from the first interaction through to release.",
  },
  {
    id: 3,
    title: "UI/UX Design",
    text: "Clear, accessible interfaces and thoughtful user journeys designed around real people and real goals, so every interaction feels effortless.",
  },
  {
    id: 4,
    title: "Digital Marketing",
    text: "Focused digital campaigns and a strong online presence that help your brand reach the right audience and grow with confidence.",
  },
  {
    id: 5,
    title: "Custom Software",
    text: "Tailored software and digital systems that streamline workflows, improve efficiency, and help your organization operate smarter.",
  },
  {
    id: 6,
    title: "AI & Intelligent Automation",
    text: "AI-powered tools and intelligent automation that reduce repetitive work, simplify operations, and open new possibilities.",
  },
];

const Services = () => {
  const scope = useRef(null);

  useGSAP(() => reveals(scope.current), { scope });

  // Cursor-follow glow, positioned via --mx/--my (same pattern as Features).
  const trackGlow = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <section className="services section__padding" id="services" ref={scope}>
      <div className="services__heading">
        <p className="eyebrow" data-reveal>
          Our Services
        </p>

        <h2 data-split>What We Do to Move Your Business Forward</h2>

        <p className="services__intro" data-reveal>
          From design and development to marketing and automation, we deliver
          complete digital solutions under one roof — practical, reliable, and
          built to last.
        </p>
      </div>

      <div className="services__grid" data-reveal-group>
        {servicesData.map((service) => (
          <div
            className="services__card"
            key={service.id}
            onMouseMove={trackGlow}
          >
            <Feature title={service.title} text={service.text} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;