import { useCallback, useEffect, useRef, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { useGSAP, reveals } from "../../lib/gsapSetup";
import "./Team.css";

const MEMBERS = [
  {
    id: "sayeed",
    name: "Sayeed Najmuldin Sadat",
    role: "Manager",
    image: "/SayeedNajmuldinSadatManager.png",
    alt: "Portrait of Sayeed Najmuldin Sadat",
    summary:
      "Leads Sadat Upgrade, keeping projects aligned, clients informed, and the team focused on practical, high-quality delivery.",
    description:
      "As the manager of Sadat Upgrade, Sayeed oversees the studio's projects, client relationships, and day-to-day operations. He works to keep requirements clear, schedules realistic, and communication open, so each engagement moves from idea to launch with confidence and clarity.",
    portfolio: null,
  },
  {
    id: "mosa",
    name: "Mosa Barekzai",
    role: "Developer",
    image: "/mosaBarekzaiDeveloper.jpeg",
    alt: "Portrait of Mosa Barekzai",
    summary:
      "Builds responsive front-ends and clean components that turn designs into fast, usable web experiences.",
    description:
      "Mosa is a developer at Sadat Upgrade focused on turning designs into working interfaces. His work covers modern, responsive front-ends, reusable components, and keeping performance and usability at the centre of every page he ships.",
    portfolio: null,
  },
  {
    id: "sediqullah",
    name: "Sediqullah Sediqi",
    role: "Developer",
    image: "/sediqullahSediqiDeveloper.jpeg",
    alt: "Portrait of Sediqullah Sediqi",
    summary:
      "Builds web applications with a focus on structure, quality, and reliable delivery.",
    description:
      "Sediqullah is a developer at Sadat Upgrade who focuses on building solid web applications. He works across features, structure, and integration, aiming for code that stays dependable, maintainable, and easy to build on as projects grow.",
    portfolio: "https://sediqullah-portfolio.vercel.app",
  },
];

export default function Team() {
  const scope = useRef(null);
  const [active, setActive] = useState(null);
  const lastTrigger = useRef(null);

  useGSAP(() => reveals(scope.current), { scope });

  const openProfile = useCallback((member) => {
    lastTrigger.current = document.activeElement;
    setActive(member);
  }, []);

  const closeProfile = useCallback(() => {
    setActive(null);
    if (lastTrigger.current && typeof lastTrigger.current.focus === "function") {
      lastTrigger.current.focus();
    }
    lastTrigger.current = null;
  }, []);

  useEffect(() => {
    if (!active) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape") closeProfile();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [active, closeProfile]);

  const selected = active ? MEMBERS.find((member) => member.id === active.id) : null;

  return (
    <section className="team section__padding" id="about" ref={scope}>
      <div className="team__intro" data-reveal>
        <p className="eyebrow">Our Team</p>
        <h2 data-split>The people who build, ship, and support your success.</h2>
      </div>

      <div className="team__grid" data-reveal-group>
        {MEMBERS.map((member) => (
          <button
            type="button"
            key={member.id}
            className="team__card"
            onClick={() => openProfile(member)}
            aria-label={`Open ${member.name} profile`}
          >
            <span className="team__avatar">
              <img src={member.image} alt={member.alt} loading="lazy" />
            </span>
            <span className="team__meta">
              <span className="team__name">{member.name}</span>
              <span className="team__role">{member.role}</span>
              <span className="team__summary">{member.summary}</span>
              <span className="team__open-hint" aria-hidden="true">
                View profile
              </span>
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="team__backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeProfile();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-modal-title"
            className="team__modal"
          >
            <button
              type="button"
              className="team__modal-close"
              onClick={closeProfile}
              aria-label="Close profile"
            >
              <FaXmark aria-hidden="true" />
            </button>

            <div className="team__modal-media">
              <img src={selected.image} alt={selected.alt} />
            </div>

            <div className="team__modal-body">
              <p className="team__modal-role">{selected.role}</p>
              <h3 id="team-modal-title">{selected.name}</h3>
              <p className="team__modal-description">{selected.description}</p>
              {selected.portfolio ? (
                <a
                  href={selected.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team__modal-link"
                >
                  View Portfolio
                  <span aria-hidden="true">&rarr;</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}