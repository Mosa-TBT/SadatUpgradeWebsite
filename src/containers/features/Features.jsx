import { useRef } from "react";
import { Feature } from "../../components";
import { useGSAP, reveals } from "../../lib/gsapSetup";
import "./Features.css";

const featuresData = [
  {
    id: 1,
    title: "Modern Web Experiences",
    text: "We design and develop responsive, high-performance websites that combine elegant design, smooth interactions, and intuitive user experiences to help your business stand out online.",
  },
  {
    id: 2,
    title: "Custom Software Development",
    text: "Turn complex business challenges into practical digital solutions. We build tailored software that streamlines workflows, improves productivity, and adapts to your organization's needs.",
  },
  {
    id: 3,
    title: "AI & Intelligent Automation",
    text: "Make technology work smarter for your business. We integrate AI-powered tools and intelligent automation to reduce repetitive tasks, simplify operations, and create new opportunities.",
  },
  {
    id: 4,
    title: "Reliable Digital Transformation",
    text: "From the first idea to deployment and ongoing improvements, we help businesses adopt the right technologies, strengthen their digital presence, and grow with confidence.",
  },
];

const Features = () => {
  const scope = useRef(null);

  useGSAP(() => reveals(scope.current), { scope });

  const trackGlow = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <section className="features section__padding" id="features" ref={scope}>
      <div className="features__heading">
        <p className="eyebrow" data-reveal>
          What Sets Us Apart
        </p>

        <h2 data-split>
          Smart Technology. Meaningful Solutions. A Better Digital Future.
        </h2>

        <a className="features__link" href="#contact" data-reveal>
          Let&apos;s Build Something Great
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div className="features__grid" data-reveal-group>
        {featuresData.map((feature) => (
          <div
            className="features__card"
            key={feature.id}
            onMouseMove={trackGlow}
          >
            <Feature
              title={feature.title}
              text={feature.text}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
