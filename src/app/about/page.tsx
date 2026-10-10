
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Heart,
  Target,
  Users,
  CheckCircle,
  Sparkles,
  Workflow,
  ShieldCheck,
  Lightbulb,
  Blocks,
  Rocket,
  Check,
  Code2,
  Compass,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TeamSection } from "@/components/team-section";

const HEADING =
  "font-[family-name:var(--font-display)] tracking-[-0.055em]";

interface ValueItem {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface PrincipleItem {
  icon: LucideIcon;
  title: string;
  text: string;
}

const VALUES: ValueItem[] = [
  {
    number: "01",
    icon: Target,
    title: "Excellence",
    description:
      "We care about the details. Every product, interface and technical decision should create a better outcome for the people using it.",
  },
  {
    number: "02",
    icon: Users,
    title: "Collaboration",
    description:
      "We work alongside our clients rather than simply working for them. The best products come from shared understanding and clear communication.",
  },
  {
    number: "03",
    icon: Award,
    title: "Innovation",
    description:
      "We stay curious about technology and continuously look for better ways to solve difficult problems without chasing trends for their own sake.",
  },
  {
    number: "04",
    icon: Heart,
    title: "Passion",
    description:
      "We genuinely care about what we build. That commitment shows in the quality of our work, our relationships and the products we deliver.",
  },
];

const PRINCIPLES: PrincipleItem[] = [
  {
    icon: Target,
    title: "Purpose before technology",
    text: "We first understand the problem and the outcome. Technology comes after the strategy.",
  },
  {
    icon: Workflow,
    title: "Clarity over complexity",
    text: "Good software should make work easier, not introduce another layer of confusion.",
  },
  {
    icon: ShieldCheck,
    title: "Built for the long term",
    text: "We value maintainable systems, thoughtful architecture and products that can grow with the organization.",
  },
];

const SERVICES = [
  {
    icon: Code2,
    number: "01",
    title: "Web development",
    description:
      "Fast, responsive websites and web applications designed around your business goals.",
    tag: "Web experiences",
  },
  {
    icon: Blocks,
    number: "02",
    title: "Digital solutions",
    description:
      "Purpose-built software that simplifies workflows and helps teams work smarter.",
    tag: "Business systems",
  },
  {
    icon: Compass,
    number: "03",
    title: "UI/UX design",
    description:
      "Clear, intuitive interfaces that make digital experiences easier to understand and use.",
    tag: "Product design",
  },
  {
    icon: Zap,
    number: "04",
    title: "Technical support",
    description:
      "Practical technical guidance to help your digital operations run smoothly.",
    tag: "Ongoing support",
  },
];

const PROJECT_STAGES = [
  { label: "Discover", complete: true },
  { label: "Design", complete: true },
  { label: "Build", complete: false },
  { label: "Launch", complete: false },
];

function DashboardIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[610px]">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -left-8 top-16 h-52 w-52 rounded-full bg-blue-300/30 blur-[85px]" />
      <div className="pointer-events-none absolute -right-4 bottom-8 h-48 w-48 rounded-full bg-yellow-200/60 blur-[75px]" />

      {/* Fine grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[32px] opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(37,99,235,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.09) 1px, transparent 1px)",
          backgroundSize: "27px 27px",
          maskImage: "linear-gradient(to bottom, black, transparent 90%)",
        }}
      />

      {/* Status label */}
      <div className="absolute right-1 top-3 z-20 flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[9px] font-semibold tracking-wide text-slate-600">
          IDEAS IN PROGRESS
        </span>
      </div>

      {/* Main dashboard */}
      <div className="relative z-10 px-2 pb-10 pt-12 sm:px-5">
        <div className="group relative rotate-[-3deg] rounded-[22px] border border-white bg-white/80 p-2 shadow-[0_35px_100px_-35px_rgba(37,99,235,0.38)] backdrop-blur-sm transition-transform duration-700 hover:rotate-0 sm:p-3">
          <div className="overflow-hidden rounded-[15px] border border-slate-200 bg-[#F8FAFF]">
            {/* Browser bar */}
            <div className="flex h-10 items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#FF827A]" />
                <span className="h-2 w-2 rounded-full bg-[#F5C65D]" />
                <span className="h-2 w-2 rounded-full bg-[#58C99A]" />
              </div>

              <div className="flex h-5 w-[42%] items-center justify-center rounded-md bg-slate-100 px-2">
                <span className="truncate text-[8px] text-slate-400">
                  sadaatupgrade.com/workspace
                </span>
              </div>

              <div className="h-4 w-4 rounded-full border border-slate-200" />
            </div>

            <div className="flex min-h-[330px] sm:min-h-[375px]">
              {/* Sidebar */}
              <aside className="flex w-10 shrink-0 flex-col items-center gap-4 border-r border-slate-200 bg-white py-4 sm:w-[54px] sm:gap-5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-700 text-white">
                  <Blocks size={13} />
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Workflow size={13} />
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400">
                  <Target size={13} />
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400">
                  <Users size={13} />
                </div>
                <div className="mt-auto flex h-6 w-6 items-center justify-center rounded-lg text-slate-400">
                  <Rocket size={13} />
                </div>
              </aside>

              {/* Dashboard content */}
              <div className="min-w-0 flex-1 p-3 sm:p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-slate-400 sm:text-[9px]">
                      WORKSPACE / OVERVIEW
                    </p>
                    <h3 className="mt-1 text-[17px] font-bold tracking-[-0.06em] text-slate-900 sm:text-[23px]">
                      Make it happen<span className="text-blue-700">.</span>
                    </h3>
                    <p className="mt-1 text-[9px] text-slate-500 sm:text-[10px]">
                      Great work starts with a clear direction.
                    </p>
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-yellow-300 text-slate-950">
                    <Sparkles size={15} />
                  </div>
                </div>

                {/* Statistics */}
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[
                    {
                      label: "Projects",
                      value: "12",
                      color: "bg-blue-600",
                    },
                    {
                      label: "In progress",
                      value: "04",
                      color: "bg-yellow-400",
                    },
                    {
                      label: "Completed",
                      value: "08",
                      color: "bg-emerald-500",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-slate-200 bg-white p-2 sm:p-3"
                    >
                      <div
                        className={`mb-2 h-1 w-5 rounded-full ${stat.color}`}
                      />
                      <p className="text-[7px] text-slate-500 sm:text-[9px]">
                        {stat.label}
                      </p>
                      <p className="mt-0.5 text-[17px] font-bold tracking-tight text-slate-900 sm:text-[22px]">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Project overview */}
                <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 sm:mt-4 sm:p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[8px] font-semibold text-slate-800 sm:text-[10px]">
                        Website transformation
                      </p>
                      <p className="mt-1 text-[7px] text-slate-400 sm:text-[9px]">
                        Project overview
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-[7px] font-semibold text-blue-700 sm:text-[9px]">
                      Active
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="relative flex h-[62px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#EAF1FF] sm:h-[76px] sm:w-[100px]">
                      <div className="absolute -right-4 -top-5 h-16 w-16 rounded-full bg-yellow-300/80" />
                      <div className="relative w-[65%] rounded-md border border-blue-200 bg-white p-1.5 shadow-sm">
                        <div className="h-1 w-1/2 rounded-full bg-blue-700" />
                        <div className="mt-1.5 h-1 w-full rounded-full bg-slate-200" />
                        <div className="mt-1 h-1 w-3/4 rounded-full bg-slate-200" />
                        <div className="mt-2 h-3 rounded-sm bg-blue-100" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[8px] font-medium text-slate-600 sm:text-[10px]">
                          Design &amp; development
                        </span>
                        <span className="text-[8px] font-bold text-blue-700 sm:text-[10px]">
                          75%
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full w-3/4 rounded-full bg-blue-700" />
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex -space-x-1.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-[7px] font-bold text-blue-700">
                            S
                          </span>
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-yellow-200 text-[7px] font-bold text-slate-800">
                            U
                          </span>
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-[7px] font-bold text-emerald-700">
                            +
                          </span>
                        </div>
                        <span className="text-[7px] text-slate-400 sm:text-[9px]">
                          Moving forward
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workflow */}
                <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 sm:mt-4 sm:p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[8px] font-semibold text-slate-800 sm:text-[10px]">
                      From idea to impact
                    </p>
                    <ArrowUpRight size={13} className="text-slate-400" />
                  </div>

                  <div className="mt-3 flex items-center">
                    {PROJECT_STAGES.map((stage, index) => (
                      <div
                        key={stage.label}
                        className="flex min-w-0 flex-1 items-center"
                      >
                        <div className="flex min-w-0 flex-col items-center">
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full ${
                              stage.complete
                                ? "bg-blue-700 text-white"
                                : "border border-slate-200 bg-white text-slate-400"
                            }`}
                          >
                            {stage.complete ? (
                              <Check size={10} />
                            ) : (
                              <span className="text-[8px]">{index + 1}</span>
                            )}
                          </div>
                          <span className="mt-1.5 text-[6px] text-slate-500 sm:text-[8px]">
                            {stage.label}
                          </span>
                        </div>

                        {index < PROJECT_STAGES.length - 1 && (
                          <div
                            className={`mx-1 mb-4 h-px flex-1 ${
                              index < 2 ? "bg-blue-300" : "bg-slate-200"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating yellow card */}
      <div className="absolute -left-1 bottom-8 z-20 max-w-[185px] rotate-[-5deg] rounded-2xl bg-yellow-300 p-4 shadow-[0_18px_45px_-18px_rgba(202,138,4,0.5)] sm:-left-2 sm:bottom-10 sm:p-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-yellow-300">
          <Lightbulb size={15} />
        </div>
        <p className="mt-3 text-[15px] font-bold leading-tight tracking-[-0.045em] text-slate-900 sm:text-[18px]">
          Big ideas,
          <br />
          made real.
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-[9px] font-medium text-slate-700">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-700" />
          Let&apos;s build something better
        </div>
      </div>

      {/* Floating white card */}
      <div className="absolute -right-1 bottom-1 z-20 flex rotate-[4deg] items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_18px_45px_-18px_rgba(15,23,42,0.25)] sm:-right-2 sm:bottom-3 sm:p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Rocket size={18} />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-900 sm:text-[12px]">
            Built for what&apos;s next
          </p>
          <p className="mt-1 text-[9px] text-slate-500">
            Thoughtful. Reliable. Ready.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const elements = root.querySelectorAll<HTMLElement>("[data-reveal]");

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      elements.forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      elements.forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main
      ref={pageRef}
      className="min-h-screen overflow-x-clip bg-white text-slate-950"
    >
      <style jsx global>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(20px);
          transition:
            opacity 650ms ease,
            transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        [data-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          [data-reveal],
          [data-reveal].is-visible {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative isolate overflow-hidden border-b border-slate-100 bg-[#F7FAFF]">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(rgba(37,99,235,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.055) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
              maskImage: "linear-gradient(to bottom, black, transparent 90%)",
            }}
          />
          <div className="absolute -left-36 top-0 h-96 w-96 rounded-full bg-blue-200/30 blur-[110px]" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-yellow-200/40 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-9 sm:px-8 sm:pb-20 sm:pt-12 lg:px-10 lg:pb-24 lg:pt-14">
          <div
            data-reveal
            className="mb-12 flex items-center justify-between border-b border-slate-200/80 pb-5 sm:mb-14"
          >
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-700" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                About Sadaat Upgrade
              </span>
            </div>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:block">
              People · Purpose · Technology
            </span>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-12">
            {/* Hero text */}
            <div data-reveal className="relative z-10">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-medium text-blue-700 shadow-sm shadow-blue-900/[0.03]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-300 text-slate-950">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                Digital technology partner
              </div>

              <h1
                className={`${HEADING} max-w-4xl text-[3.4rem] font-semibold leading-[0.94] text-slate-950 sm:text-6xl lg:text-[5.7rem]`}
              >
                We build
                <span className="block">with purpose.</span>
                <span className="relative mt-1 block w-fit text-blue-700">
                  Not just technology.
                  <svg
                    aria-hidden="true"
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 440 14"
                    fill="none"
                  >
                    <path
                      d="M4 9C100 2 290 2 434 8"
                      stroke="#FACC15"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Sadaat Upgrade helps organizations turn ideas, operational
                challenges and business goals into thoughtful digital
                products and reliable software systems.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-blue-700 px-7 font-semibold text-white shadow-lg shadow-blue-700/20 transition-all hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-xl hover:shadow-blue-700/25"
                >
                  <Link href="/contact">
                    Work with us
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-slate-200 bg-white/80 px-7 text-slate-800 hover:border-blue-200 hover:bg-white hover:text-blue-700"
                >
                  <Link href="/services">
                    Explore our services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-500 sm:text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-700" />
                  Business-first
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-700" />
                  Human-centered
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-700" />
                  Built to last
                </span>
              </div>
            </div>

            {/* Dashboard illustration instead of about-us.jpg */}
            <div data-reveal className="relative min-w-0">
              <DashboardIllustration />
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between border-t border-slate-200/80 pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
              Ideas · Design · Engineering
            </p>
            <a
              href="#our-story"
              className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-blue-700"
            >
              Discover our story
              <ArrowDownRight
                size={15}
                className="transition-transform group-hover:translate-y-1"
              />
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          INTRO / STORY
      ============================================================ */}

      <section
        id="our-story"
        className="scroll-mt-24 border-b border-slate-100 bg-white"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
            <div data-reveal>
              <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                <span className="h-px w-8 bg-yellow-400" />
                Who we are
              </div>

              <h2
                className={`${HEADING} text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl`}
              >
                Technology is only useful when it improves something.
              </h2>

              <div className="mt-7 h-1 w-16 rounded-full bg-yellow-300" />
            </div>

            <div
              data-reveal
              className="space-y-6 text-base leading-8 text-slate-600 sm:text-lg"
            >
              <p>
                We believe digital products should solve real problems. A
                beautiful interface is valuable, but only when it makes a
                process clearer, a service more accessible or a business
                more effective.
              </p>

              <p>
                That belief shapes how we work. We listen first, understand
                the environment, map the workflow and then design the
                technology around the people who will actually use it.
              </p>

              <p>
                From websites and mobile applications to business platforms
                and custom software systems, our goal is the same: create
                technology that feels intentional, dependable and genuinely
                useful.
              </p>

              <div className="flex items-center gap-3 border-t border-slate-100 pt-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-300 text-slate-950">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Better thinking. Better building.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Technology designed around real needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SERVICES / CAPABILITIES
      ============================================================ */}

      <section className="relative overflow-hidden border-b border-slate-100 bg-[#F7FAFF]">
        <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-[90px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
          <div
            data-reveal
            className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
          >
            <div>
              <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                <span className="h-px w-8 bg-yellow-400" />
                What we do
              </div>

              <h2
                className={`${HEADING} max-w-2xl text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl`}
              >
                The right tools for your next big step.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-slate-600 sm:text-base">
              From the first sketch to the final line of code, we help turn
              business needs into useful digital experiences.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.number}
                  data-reveal
                  style={{ transitionDelay: `${index * 75}ms` }}
                  className="group relative flex min-h-[275px] flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-[0_24px_55px_-30px_rgba(37,99,235,0.3)] sm:p-7"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition-colors duration-300 group-hover:bg-blue-700 group-hover:text-white">
                      <Icon size={21} strokeWidth={1.8} />
                    </div>
                    <span className="text-sm font-semibold text-slate-300">
                      {service.number}
                    </span>
                  </div>

                  <h3 className="mt-8 text-lg font-bold tracking-[-0.04em] text-slate-900">
                    {service.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                    {service.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                      {service.tag}
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-slate-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-700"
                    />
                  </div>

                  <div className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-blue-50 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                </article>
              );
            })}
          </div>

          <div data-reveal className="mt-8 flex justify-center">
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-slate-200 bg-white px-6 text-slate-700 hover:border-blue-200 hover:text-blue-700"
            >
              <Link href="/services">
                Explore all services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================
          VALUES
      ============================================================ */}

      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
          <div
            data-reveal
            className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
          >
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                <span className="h-px w-8 bg-yellow-400" />
                Our values
              </div>

              <h2
                className={`${HEADING} text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl`}
              >
                What drives the work.
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                The principles behind how we think, collaborate, design and
                build.
              </p>
            </div>

            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Four principles
            </div>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {VALUES.map((value, index) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.number}
                  data-reveal
                  style={{ transitionDelay: `${index * 75}ms` }}
                  className="group rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/[0.025] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/[0.06] sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition-colors group-hover:bg-yellow-300 group-hover:text-slate-950">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold tracking-[0.18em] text-slate-300">
                      {value.number}
                    </span>
                  </div>

                  <h3
                    className={`${HEADING} mt-9 text-2xl font-semibold text-slate-900`}
                  >
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          PRINCIPLES
      ============================================================ */}

      <section className="relative isolate overflow-hidden border-b border-slate-100 bg-[#F7FAFF]">
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-yellow-200/30 blur-[100px]" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-blue-200/30 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
            <div data-reveal>
              <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                <span className="h-px w-8 bg-yellow-400" />
                How we think
              </div>

              <h2
                className={`${HEADING} text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl`}
              >
                Better decisions.
                <span className="block text-slate-400">
                  Better products.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
                We combine business thinking, design and engineering so
                technology serves a clear purpose instead of becoming
                complexity for its own sake.
              </p>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm">
                <Sparkles size={14} className="text-blue-700" />
                Small details. Meaningful differences.
              </div>
            </div>

            <div className="grid gap-4" data-reveal>
              {PRINCIPLES.map((principle, index) => {
                const Icon = principle.icon;

                return (
                  <article
                    key={principle.title}
                    className="group flex gap-5 rounded-[26px] border border-slate-200 bg-white/90 p-6 transition duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/[0.04] sm:p-7"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition-colors group-hover:bg-yellow-300 group-hover:text-slate-950">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <h3
                          className={`${HEADING} text-xl font-semibold text-slate-900`}
                        >
                          {principle.title}
                        </h3>
                        <span className="text-xs font-semibold tracking-[0.18em] text-slate-300">
                          0{index + 1}
                        </span>
                      </div>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        {principle.text}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          TEAM — existing component preserved
      ============================================================ */}

      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
          <div
            data-reveal
            className="mb-12 grid gap-8 lg:mb-16 lg:grid-cols-[1fr_auto] lg:items-end"
          >
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                <span className="h-px w-8 bg-yellow-400" />
                Our team
              </div>

              <h2
                className={`${HEADING} text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl`}
              >
                People behind
                <span className="block">the work.</span>
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Designers, developers and strategists working together to
                turn complex ideas into useful digital products.
              </p>
            </div>

            <div className="hidden text-right text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:block">
              The people
              <br />
              behind the product
            </div>
          </div>

          <div data-reveal>
            <TeamSection />
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA
      ============================================================ */}

      <section className="relative isolate overflow-hidden bg-blue-700">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "38px 38px",
            }}
          />

          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full border-[55px] border-blue-500/40" />
          <div className="absolute -bottom-28 right-[22%] h-64 w-64 rounded-full bg-yellow-300/20 blur-[75px]" />
          <div className="absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-cyan-400/20 blur-[90px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
          <div
            data-reveal
            className="relative overflow-hidden rounded-[32px] border border-white/15 bg-white/[0.06] px-6 py-12 backdrop-blur-sm sm:px-10 sm:py-16 lg:px-16 lg:py-20"
          >
            <div className="relative z-10 grid items-end gap-9 lg:grid-cols-[1fr_auto] lg:gap-12">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-50">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />
                  Your next chapter starts here
                </div>

                <h2
                  className={`${HEADING} mt-6 text-4xl font-semibold leading-[1.02] text-white sm:text-5xl lg:text-7xl`}
                >
                  Have something
                  <br />
                  worth building?
                  <span className="block text-yellow-300">
                    Let&apos;s make it happen.
                  </span>
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-7 text-blue-100 sm:text-base sm:leading-8">
                  Let&apos;s discuss your idea, your challenge and where you
                  want to go. We&apos;ll help turn it into a practical digital
                  solution.
                </p>
              </div>

              <Link
                href="/contact"
                className="group inline-flex min-h-14 w-fit items-center justify-center gap-3 rounded-full bg-yellow-300 px-6 text-sm font-bold text-slate-950 shadow-xl shadow-blue-950/15 transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-200"
              >
                Start a conversation
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="relative z-10 mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-blue-100 sm:text-xs">
                Sadaat Upgrade · Technology with purpose
              </p>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 transition-colors hover:text-yellow-300"
              >
                Let&apos;s talk
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
