import { useCallback, useEffect, useRef } from "react";
import { useGSAP, reveals } from "../../lib/gsapSetup";
import "./Blog.css";

const projects = [
  {
    id: 1,
    name: "Time Travel Caravan",
    category: "Tourism & Travel",
    image: "/TIMETRAVELCARAVAN.png",
    description:
      "A modern tourism platform showcasing Afghanistan's historical landmarks, rich cultural heritage, breathtaking landscapes, and unique travel experiences. Built to help travelers discover the country's destinations through an engaging digital experience.",
    technologies: ["Tourism Platform", "Responsive Design", "Web Development"],
  },
  {
    id: 2,
    name: "MCIT Task Management System",
    category: "Government & Enterprise",
    image: "/MCIT.png",
    description:
      "A web-based task planning, reporting, and monitoring system developed for Afghanistan's Ministry of Communications and Information Technology. It supports task assignment, progress tracking, departmental workflows, role-based access, dashboards, notifications, and organizational reporting.",
    technologies: ["Laravel", "Next.js", "MySQL"],
  },
  {
    id: 3,
    name: "Danisha Zad",
    category: "Digital Solutions",
    image: "/DANISHAZAD.png",
    description:
      "A digital project featured in the Sadat Upgrade portfolio. Its specific purpose and functionality will be described accurately once the project's details are confirmed.",
    technologies: ["Web Development", "Digital Experience"],
  },
  {
    id: 4,
    name: "ACF APR System",
    category: "NGO & Reporting",
    image: "/ACF.png",
    description:
      "A reporting and workflow platform built to support ACF's APR operations. The system combines a Laravel backend and Next.js frontend, with reporting-related services and Kobo form submission synchronization to support structured data collection and reporting workflows.",
    technologies: ["Laravel", "Next.js", "Kobo Integration"],
  },
];

const Projects = () => {
  const scope = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);

  useGSAP(() => reveals(scope.current), { scope });

  const updateProgress = useCallback(() => {
    const el = trackRef.current;
    const fill = progressRef.current;
    if (!el || !fill) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = max > 0 ? el.scrollLeft / max : 0;
    fill.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;

    const canScroll = () => el.scrollWidth - el.clientWidth > 4;

    // Map a plain mouse wheel (vertical) onto horizontal scrolling so the
    // cards are reachable without a trackpad or shift+wheel.
    const onWheel = (e) => {
      if (!canScroll()) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      el.scrollLeft += delta;
      e.preventDefault();
    };

    // Optional drag-to-scroll for mice. Starts only after a small threshold so
    // clicks, links and text selection keep working.
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;

    const onPointerDown = (e) => {
      if (e.pointerType === "touch") return; // native touch scrolling
      if (e.button !== 0) return;
      if (!canScroll()) return;
      const selection = typeof window.getSelection === "function" ? String(window.getSelection()) : "";
      if (selection) return; // do not start a drag while text is selected
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 6) return;
      moved = true;
      el.classList.add("is-dragging");
      el.scrollLeft = startLeft - dx;
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove("is-dragging");
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    updateProgress();

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("scroll", updateProgress);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [updateProgress]);

  return (
    <section className="blog projects" id="portfolio" ref={scope}>
      <div className="blog__pin">
        <div className="blog__header">
          <p className="eyebrow" data-reveal>
            Selected Work
          </p>

          <h2 data-split>
            Real Projects. Meaningful Impact. Digital Experiences That Matter.
          </h2>

          <p className="projects__intro" data-reveal>
            From tourism platforms to enterprise systems, we turn complex
            requirements into practical digital solutions. Drag or scroll to
            explore.
          </p>

          <div className="blog__progress" aria-hidden="true">
            <div className="blog__progress-fill" ref={progressRef} />
          </div>
        </div>

        <div
          className="blog__track projects__track"
          ref={trackRef}
          tabIndex={0}
          role="region"
          aria-label="Featured projects — scroll horizontally"
        >
          {projects.map((project) => (
            <article className="projects__card" key={project.id}>
              <div className="projects__image">
                <img
                  src={project.image}
                  alt={`${project.name} project preview`}
                  loading="lazy"
                />
              </div>

              <div className="projects__content">
                <p className="projects__category">{project.category}</p>

                <h3>{project.name}</h3>

                <p className="projects__description">
                  {project.description}
                </p>

                <div
                  className="projects__technologies"
                  aria-label="Project technologies and capabilities"
                >
                  {project.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
