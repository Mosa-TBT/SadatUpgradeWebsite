import { useRef } from "react";
import {
  gsap,
  useGSAP,
  reveals,
  isReducedMotion,
} from "../../lib/gsapSetup";
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

  useGSAP(
    () => {
      reveals(scope.current);

      if (isReducedMotion()) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px)", () => {
        const track = scope.current?.querySelector(".blog__track");
        const progressFill = scope.current?.querySelector(
          ".blog__progress-fill",
        );

        if (!track) return;

        const getDistance = () =>
          Math.max(0, track.scrollWidth - window.innerWidth);

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(
          track,
          {
            x: () => -getDistance(),
            ease: "none",
          },
          0,
        );

        if (progressFill) {
          timeline.fromTo(
            progressFill,
            { scaleX: 0 },
            { scaleX: 1, ease: "none" },
            0,
          );
        }
      });

      return () => mm.revert();
    },
    { scope },
  );

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
            requirements into practical digital solutions.
          </p>

          <div className="blog__progress" aria-hidden="true">
            <div className="blog__progress-fill" />
          </div>
        </div>

        <div className="blog__track projects__track">
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