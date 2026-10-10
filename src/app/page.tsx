"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import Image from "next/image";
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Blocks,
  Check,
  ChevronDown,
  Code2,
  ExternalLink,
  Globe2,
  Github,
  Layers3,
  Lightbulb,
  Mail,
  Palette,
  Quote,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Target,
  Users,
  Workflow,
  Zap,
  X,
} from "lucide-react";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { usePublic } from "@/hooks/use-public";
import { useSiteConfig } from "@/components/config-provider";
import { BrandLogo } from "@/components/brand-logo";

const displayFont = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const bodyFont = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });
const heading = "font-[family-name:var(--font-display)] tracking-[-0.055em]";

type Service = {
  id?: string | number;
  title?: string;
  name?: string;
  description?: string;
  short_description?: string;
  icon?: string;
  slug?: string;
};

type Project = {
  id?: string | number;
  title?: string;
  name?: string;
  description?: string;
  image?: string;
  image_url?: string;
  category?: string;
  client?: string;
  year?: string | number;
  technologies?: string[];
  tech_stack?: string[];
  live_url?: string;
  website_url?: string;
  github_url?: string;
};

type Testimonial = {
  id?: string | number;
  name?: string;
  client_name?: string;
  role?: string;
  company?: string;
  content?: string;
  quote?: string;
  avatar?: string;
  avatar_url?: string;
};

const serviceIcons: Record<string, ComponentType<{ className?: string }>> = {
  Globe: Globe2,
  Globe2,
  Smartphone,
  Palette,
  Code: Code2,
  Code2,
  BarChart3,
  ShoppingCart,
  Layers3,
  Workflow,
  ShieldCheck,
};

const fallbackServices: Service[] = [
  { title: "Web Development", description: "Fast, accessible websites and web platforms built around the way your business works.", icon: "Globe2" },
  { title: "Mobile Applications", description: "Useful, intuitive mobile products that keep your customers and teams connected.", icon: "Smartphone" },
  { title: "UI/UX Design", description: "Thoughtful product experiences that make complex tasks feel clear and effortless.", icon: "Palette" },
  { title: "Custom Software", description: "Purpose-built systems that replace repetitive work and connect your operations.", icon: "Code2" },
  { title: "E-Commerce", description: "Reliable digital storefronts designed to turn browsing into confident purchases.", icon: "ShoppingCart" },
  { title: "Digital Strategy", description: "A practical technology roadmap that connects your goals with measurable outcomes.", icon: "BarChart3" },
];

const processSteps = [
  { number: "01", title: "Discover", description: "We listen, ask the right questions and get clear on the problem worth solving.", icon: Lightbulb },
  { number: "02", title: "Shape", description: "We map the experience, scope the work and agree on what success looks like.", icon: Target },
  { number: "03", title: "Build", description: "We design, engineer and test in focused iterations—with progress you can see.", icon: Code2 },
  { number: "04", title: "Improve", description: "We launch carefully, measure what matters and keep making the product better.", icon: Zap },
];

const faqItems = [
  { question: "What kind of projects do you take on?", answer: "We work on websites, mobile applications, business platforms, e-commerce experiences and custom software. We can help from an early idea through launch, or join an existing project that needs a clearer direction." },
  { question: "Can you improve a website or product we already have?", answer: "Absolutely. We can review the current experience, improve the design, modernize the technical foundation, fix performance issues or add features without needlessly rebuilding what already works." },
  { question: "How do you estimate project cost and timeline?", answer: "After an initial conversation, we clarify goals, scope, priorities and constraints. We then share a realistic plan with milestones and an estimate before implementation begins." },
  { question: "Do you provide support after launch?", answer: "Yes. We can continue with maintenance, security updates, performance optimization, analytics, feature development and technical support based on your needs." },
];

function SectionIntro({ eyebrow, title, description, dark = false }: { eyebrow: string; title: string; description?: string; dark?: boolean }) {
  return (
    <div className="mb-12 max-w-3xl sm:mb-16">
      <div className={`mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[.2em] ${dark ? "text-yellow-300" : "text-blue-700"}`}>
        <span className={`h-px w-8 ${dark ? "bg-yellow-300" : "bg-blue-700"}`} />{eyebrow}
      </div>
      <h2 className={`${heading} text-4xl font-semibold leading-[1.02] sm:text-5xl lg:text-6xl ${dark ? "text-white" : "text-slate-950"}`}>{title}</h2>
      {description && <p className={`mt-5 max-w-2xl text-base leading-8 sm:text-lg ${dark ? "text-blue-100/75" : "text-slate-600"}`}>{description}</p>}
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = serviceIcons[service.icon || ""] || Layers3;
  const title = service.title || service.name || "Digital service";
  const description = service.short_description || service.description || "Practical digital solutions tailored to your goals.";
  return (
    <article className={`group relative flex min-h-[260px] flex-col overflow-hidden rounded-[1.6rem] border p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(24,65,130,.12)] sm:p-8 ${index % 3 === 1 ? "border-yellow-200 bg-[#FFF9E8]" : "border-blue-100 bg-white"}`}>
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100/70 blur-2xl transition duration-500 group-hover:bg-yellow-200/70" />
      <div className="relative mb-8 flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${index % 3 === 1 ? "bg-yellow-300 text-slate-900" : "bg-blue-700 text-white"}`}><Icon className="h-5 w-5" /></div>
        <span className="text-xs font-semibold tracking-[.15em] text-slate-400">0{index + 1}</span>
      </div>
      <h3 className={`${heading} relative text-2xl font-semibold text-slate-950`}>{title}</h3>
      <p className="relative mt-3 flex-1 text-sm leading-7 text-slate-600">{description}</p>
      <div className="relative mt-6 flex items-center gap-2 text-sm font-bold text-blue-800 transition group-hover:gap-3">Explore service <ArrowRight className="h-4 w-4" /></div>
    </article>
  );
}

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: (project: Project) => void }) {
  const image = project.image_url || project.image;
  const title = project.title || project.name || "Digital project";
  return (
    <button type="button" onClick={() => onOpen(project)} className={`group block w-full overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,35,70,.14)] ${index === 0 ? "md:col-span-7" : index === 1 ? "md:col-span-5" : "md:col-span-4"}`}>
      <div className={`relative overflow-hidden bg-gradient-to-br ${index % 2 ? "from-yellow-100 via-amber-50 to-blue-100" : "from-blue-100 via-sky-50 to-yellow-100"} ${index < 2 ? "aspect-[1.35]" : "aspect-[1.18]"}`}>
        {image ? <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" unoptimized /> : (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="absolute h-[80%] w-[80%] rounded-full border border-blue-300/60" />
            <div className="absolute h-[60%] w-[60%] rounded-full border border-blue-300/60" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-blue-700 text-white shadow-2xl shadow-blue-900/20"><Blocks className="h-10 w-10" /></div>
            <div className="absolute right-[15%] top-[17%] h-7 w-7 rounded-lg bg-yellow-300 shadow-lg" />
            <div className="absolute bottom-[16%] left-[17%] h-4 w-20 rounded-full bg-blue-300/80" />
          </div>
        )}
        <div className="absolute left-5 top-5 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-blue-800 backdrop-blur">{project.category || "Selected work"}</div>
        <div className="absolute bottom-5 right-5 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-yellow-300 text-slate-950 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowDownRight className="h-5 w-5" /></div>
      </div>
      <div className="flex items-end justify-between gap-4 p-6 sm:p-7">
        <div><p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-slate-400">{project.client || project.year || "Digital experience"}</p><h3 className={`${heading} text-2xl font-semibold text-slate-950 sm:text-3xl`}>{title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{project.description || "A tailored digital solution built around real-world needs."}</p></div>
        <span className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition group-hover:border-blue-700 group-hover:bg-blue-700 group-hover:text-white"><ArrowRight className="h-4 w-4" /></span>
      </div>
    </button>
  );
}

export default function HomePage() {
  const { config } = useSiteConfig();
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { data: servicesData } = usePublic<Service>("services");
  const { data: projectsData } = usePublic<Project>("projects");
  const { data: testimonialsData } = usePublic<Testimonial>("testimonials");

  const services = useMemo<Service[]>(() => {
    const raw = Array.isArray(servicesData) ? servicesData : Array.isArray((servicesData as unknown as { data?: Service[] })?.data) ? (servicesData as unknown as { data?: Service[] }).data ?? [] : [];
    return raw.length ? raw : fallbackServices;
  }, [servicesData]);
  const projects = useMemo<Project[]>(() => Array.isArray(projectsData) ? projectsData : Array.isArray((projectsData as unknown as { data?: Project[] })?.data) ? (projectsData as unknown as { data?: Project[] }).data ?? [] : [], [projectsData]);
  const testimonials = useMemo<Testimonial[]>(() => Array.isArray(testimonialsData) ? testimonialsData : Array.isArray((testimonialsData as unknown as { data?: Testimonial[] })?.data) ? (testimonialsData as unknown as { data?: Testimonial[] }).data ?? [] : [], [testimonialsData]);

  const general = (config?.settings?.general ?? {}) as Record<string, unknown>;
  const rawEmails: string[] = Array.isArray(general.contact_emails)
    ? general.contact_emails.filter(
        (e): e is string => typeof e === "string" && e.trim().length > 0,
      )
    : [];
  const contactEmail =
    (rawEmails.length > 0
      ? rawEmails[0]
      : typeof general.contact_email === "string" && general.contact_email
        ? general.contact_email
        : null) ?? "info@sadaatupgrade.com";

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => { element.style.opacity = "1"; element.style.transform = "none"; });
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [services.length, projects.length, testimonials.length]);

  return (
    <main className={`${displayFont.variable} ${bodyFont.variable} overflow-hidden bg-[#F7FAFF] font-[family-name:var(--font-body)] text-slate-950`}>
      <style jsx global>{`
        [data-reveal] { opacity: 0; transform: translateY(22px); transition: opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1); }
        [data-reveal].is-visible { opacity: 1; transform: translateY(0); }
        @media (prefers-reduced-motion: reduce) { [data-reveal] { opacity: 1; transform: none; transition: none; } html { scroll-behavior: auto !important; } }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* HERO: editorial layout, not a generic centered template */}
      <section className="relative isolate overflow-hidden bg-[#F7FAFF]">
        <div className="pointer-events-none absolute -right-40 -top-44 h-[620px] w-[620px] rounded-full bg-blue-200/55 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-48 left-[22%] h-[420px] w-[420px] rounded-full bg-yellow-200/55 blur-[90px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[.045] [background-image:linear-gradient(#16325c_1px,transparent_1px),linear-gradient(90deg,#16325c_1px,transparent_1px)] [background-size:54px_54px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="relative mx-auto grid min-h-[720px] max-w-[1400px] items-center gap-12 px-5 pb-24 pt-20 sm:px-8 lg:min-h-[790px] lg:grid-cols-[1.03fr_.97fr] lg:px-12 lg:pb-28 lg:pt-24">
          <div className="relative z-10" data-reveal>
            <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-[11px] font-bold uppercase tracking-[.17em] text-blue-800 shadow-sm"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-50" /><span className="relative inline-flex h-2 w-2 rounded-full bg-blue-700" /></span> Independent digital studio · Afghanistan</div>
            <h1 className={`${heading} max-w-3xl text-[3.65rem] font-semibold leading-[.91] sm:text-7xl lg:text-[6.8rem] xl:text-[7.5rem]`}>Make your next <span className="relative inline-block text-blue-700">move<span className="absolute -bottom-1 left-1 right-0 h-[.12em] -rotate-2 rounded-full bg-yellow-300 sm:-bottom-2" /></span> count<span className="text-blue-700">.</span></h1>
            <p className="mt-8 max-w-xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">We turn ambitious ideas into clear, useful digital experiences—from your first website to the software that moves your business forward.</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#contact" className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-700 px-7 text-sm font-bold text-white shadow-[0_12px_30px_rgba(29,78,216,.22)] transition hover:-translate-y-0.5 hover:bg-blue-800">Let’s build something <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></a>
              <a href="#work" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/70 px-7 text-sm font-bold text-slate-800 transition hover:border-blue-300 hover:bg-white">See our work <ArrowDownRight className="h-4 w-4" /></a>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200/80 pt-6 text-xs font-semibold text-slate-500"><span className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-700" /> Strategy-led</span><span className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-700" /> Thoughtful design</span><span className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-700" /> Reliable engineering</span></div>
          </div>

          {/* Custom product dashboard illustration */}
          <div className="relative mx-auto w-full max-w-[600px]" data-reveal>
            <div className="absolute inset-[7%] rounded-[3rem] bg-blue-200/50 blur-3xl" />
            <div className="absolute -right-1 top-[7%] z-20 hidden rotate-6 rounded-2xl border border-yellow-200 bg-yellow-300 px-4 py-3 shadow-lg shadow-yellow-900/10 sm:block"><div className="flex items-center gap-2 text-xs font-bold"><Sparkles className="h-4 w-4" /> Big ideas, made real</div></div>
            <div className="relative rotate-[1.2deg] rounded-[2rem] border border-white bg-white/85 p-3 shadow-[0_40px_100px_rgba(22,50,92,.17)] backdrop-blur-xl sm:p-4">
              <div className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-[#F8FAFF]">
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-300" /><span className="h-2.5 w-2.5 rounded-full bg-yellow-300" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" /></div><div className="rounded-full bg-slate-100 px-4 py-1.5 text-[10px] font-semibold tracking-wide text-slate-400">YOUR NEXT CHAPTER</div><div className="h-7 w-7 rounded-full bg-blue-100" /></div>
                <div className="grid grid-cols-[58px_1fr] sm:grid-cols-[76px_1fr]">
                  <div className="flex flex-col items-center gap-5 border-r border-slate-200 bg-white py-6"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white"><Blocks className="h-4 w-4" /></div><span className="h-7 w-7 rounded-lg bg-blue-50" /><span className="h-7 w-7 rounded-lg bg-yellow-100" /><span className="h-7 w-7 rounded-lg bg-slate-100" /><span className="h-7 w-7 rounded-lg bg-slate-100" /><div className="mt-auto h-7 w-7 rounded-full bg-slate-200" /></div>
                  <div className="p-4 sm:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-700">Digital progress</p><h3 className={`${heading} mt-1 text-xl font-semibold sm:text-2xl`}>Good things take shape.</h3></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">IN MOTION</span></div>
                    <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><BarChart3 className="h-4 w-4" /></div><p className="mt-4 text-[10px] text-slate-500">Clarity</p><p className={`${heading} text-2xl font-semibold sm:text-3xl`}>01 <span className="text-sm text-blue-700">/ 04</span></p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-1/4 rounded-full bg-blue-700" /></div></div><div className="rounded-2xl bg-blue-700 p-3 text-white sm:p-4"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15"><Target className="h-4 w-4" /></div><p className="mt-4 text-[10px] text-blue-100">The focus</p><p className={`${heading} text-xl font-semibold sm:text-2xl`}>Real impact</p><p className="mt-1 text-[10px] leading-4 text-blue-100/80">Less friction. More possibility.</p></div></div>
                    <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">From idea to impact</p><p className="mt-1 text-xs font-semibold text-slate-700">A thoughtful process, built around you</p></div><Workflow className="h-5 w-5 text-blue-700" /></div><div className="mt-5 flex items-center"><div className="flex flex-1 items-center"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-white"><Lightbulb className="h-3.5 w-3.5" /></span><span className="h-px flex-1 bg-blue-200" /></div><div className="flex flex-1 items-center"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300 text-slate-900"><Palette className="h-3.5 w-3.5" /></span><span className="h-px flex-1 bg-blue-200" /></div><div className="flex flex-1 items-center"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800"><Code2 className="h-3.5 w-3.5" /></span><span className="h-px flex-1 bg-slate-200" /></div><span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Zap className="h-3.5 w-3.5" /></span></div><div className="mt-2 flex justify-between text-[9px] font-medium text-slate-400"><span>Discover</span><span>Design</span><span>Build</span><span>Launch</span></div></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-2 z-20 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl sm:-left-7 sm:p-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-300"><Zap className="h-5 w-5" /></div><div><p className="text-xs font-bold text-slate-900">Built for what’s next</p><p className="mt-1 text-[10px] text-slate-500">Practical. Polished. Purposeful.</p></div></div>
          </div>
        </div>
        <a href="#services" aria-label="Scroll to services" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-slate-400 transition hover:text-blue-700 lg:flex">Scroll to explore <ChevronDown className="h-4 w-4" /></a>
      </section>

      {/* Trust strip */}
      <section className="border-y border-blue-100 bg-white">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-y divide-blue-100 px-5 sm:grid-cols-4 sm:divide-y-0 sm:px-8 lg:px-12">
          {[{ value: "Ideas", label: "Turned into experiences" }, { value: "People", label: "At the heart of the work" }, { value: "Purpose", label: "Behind every decision" }, { value: "Progress", label: "Measured by real impact" }].map((item, index) => <div key={item.value} className="flex min-h-[112px] flex-col justify-center px-5 py-5 sm:px-7"><span className={`${heading} text-2xl font-semibold ${index === 1 ? "text-blue-700" : "text-slate-950"}`}>{item.value}<span className="text-yellow-400">.</span></span><span className="mt-1 text-xs text-slate-500 sm:text-sm">{item.label}</span></div>)}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="relative py-24 sm:py-32 lg:py-36">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end" data-reveal><SectionIntro eyebrow="What we do" title="The right tools for your next chapter." description="Technology should make the hard things easier. We bring strategy, design and engineering together to create digital products that work beautifully in the real world." /><a href="#contact" className="mb-12 hidden items-center gap-2 text-sm font-bold text-blue-800 transition hover:gap-3 lg:inline-flex">Discuss your idea <ArrowRight className="h-4 w-4" /></a></div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{services.slice(0, 6).map((service, index) => <div key={service.id ?? service.slug ?? service.title ?? service.name ?? index} data-reveal><ServiceCard service={service} index={index} /></div>)}</div>
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:px-7"><div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-300"><Sparkles className="h-5 w-5" /></div><p className="text-sm leading-6 text-slate-700">Have a challenge that doesn’t fit neatly into a category? <span className="font-bold text-slate-950">Let’s figure it out together.</span></p></div><a href="#contact" aria-label="Contact us about a custom project" className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-700 text-white transition hover:bg-blue-800"><ArrowRight className="h-4 w-4" /></a></div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="relative overflow-hidden bg-[#EEF4FF] py-24 sm:py-32 lg:py-36">
        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-yellow-200/40 blur-[90px]" />
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end" data-reveal><SectionIntro eyebrow="Selected work" title="Good work speaks for itself." description="Every project starts with a real need. The result should feel considered, work reliably and give people a better way to get things done." />{projects.length > 0 && <span className="mb-12 hidden rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-xs font-bold text-blue-800 md:inline-flex">{String(projects.length).padStart(2, "0")} projects in the portfolio</span>}</div>
          {projects.length > 0 ? <div className="grid gap-5 md:grid-cols-12">{projects.slice(0, 6).map((project, index) => <div key={project.id ?? project.title ?? project.name ?? index} data-reveal className={index === 0 ? "md:col-span-7" : index === 1 ? "md:col-span-5" : "md:col-span-4"}><ProjectCard project={project} index={index} onOpen={setActiveProject} /></div>)}</div> : <div className="grid gap-5 md:grid-cols-2"><div className="rounded-[1.7rem] border border-blue-100 bg-white p-8 sm:p-10" data-reveal><span className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white"><Globe2 className="h-6 w-6" /></span><p className="text-xs font-bold uppercase tracking-[.18em] text-blue-700">Digital foundations</p><h3 className={`${heading} mt-3 text-3xl font-semibold sm:text-4xl`}>A web presence that earns attention.</h3><p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">Clear messaging, thoughtful visuals and a responsive experience—designed to make your business easier to understand and trust.</p><div className="mt-8 flex gap-2">{["Design", "Development", "Performance"].map((tag) => <span key={tag} className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-800">{tag}</span>)}</div></div><div className="rounded-[1.7rem] border border-yellow-200 bg-yellow-100/70 p-8 sm:p-10" data-reveal><span className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-300 text-slate-950"><Workflow className="h-6 w-6" /></span><p className="text-xs font-bold uppercase tracking-[.18em] text-blue-800">Systems that scale</p><h3 className={`${heading} mt-3 text-3xl font-semibold sm:text-4xl`}>Less busywork. Better flow.</h3><p className="mt-4 max-w-lg text-sm leading-7 text-slate-700">Custom tools that bring scattered tasks into one coherent system and help teams spend more time on work that matters.</p><div className="mt-8 flex gap-2">{["Workflow", "Integration", "Clarity"].map((tag) => <span key={tag} className="rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-bold text-slate-800">{tag}</span>)}</div></div></div>}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-blue-800 p-6 text-white sm:px-8 sm:py-7" data-reveal><div><p className="text-xs font-bold uppercase tracking-[.17em] text-yellow-300">Your project could be next</p><p className={`${heading} mt-2 text-2xl font-semibold sm:text-3xl`}>Let’s make something worth sharing.</p></div><a href="#contact" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-yellow-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-yellow-200">Start a conversation <ArrowRight className="h-4 w-4" /></a></div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-24 sm:py-32 lg:py-36">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
            <div data-reveal><SectionIntro eyebrow="How we work" title="Thoughtful by design. Practical by nature." description="A good result isn’t just a beautiful screen or clever code. It’s a solution that fits your people, your priorities and the reality of your business." /><div className="rounded-[1.5rem] bg-blue-800 p-7 text-white sm:p-8"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-300 text-slate-950"><ShieldCheck className="h-6 w-6" /></div><h3 className={`${heading} mt-6 text-2xl font-semibold`}>No mystery process.</h3><p className="mt-3 text-sm leading-7 text-blue-100/80">You stay involved, understand the trade-offs and know what’s happening next. We believe the best work comes from shared clarity.</p></div></div>
            <div className="relative" data-reveal><div className="absolute bottom-8 left-[23px] top-8 hidden w-px bg-blue-200 sm:block" />{processSteps.map((step, index) => { const Icon = step.icon; return <div key={step.number} className="group relative grid gap-4 border-b border-slate-200 py-7 first:pt-0 last:border-0 sm:grid-cols-[48px_1fr] sm:gap-6 sm:pl-0"><div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl ${index === 1 ? "bg-yellow-300 text-slate-950" : "bg-blue-50 text-blue-800"}`}><Icon className="h-5 w-5" /></div><div className="flex gap-4"><div className="flex-1"><div className="mb-2 flex items-center gap-3"><span className="text-[10px] font-bold tracking-[.16em] text-blue-700">STEP {step.number}</span></div><h3 className={`${heading} text-2xl font-semibold sm:text-3xl`}>{step.title}</h3><p className="mt-2 max-w-xl text-sm leading-7 text-slate-600">{step.description}</p></div><span className={`${heading} hidden text-5xl font-semibold text-slate-100 transition group-hover:text-blue-100 sm:block`}>{step.number}</span></div></div>; })}</div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-[#FFF7DF] py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12"><div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div data-reveal><SectionIntro eyebrow="Why Sadaat Upgrade" title="Technology with a human point of view." description="We pair modern technical thinking with a grounded understanding of what businesses actually need: less complexity, more confidence and room to grow." /><a href="#contact" className="inline-flex items-center gap-2 text-sm font-bold text-blue-800 hover:gap-3">Meet your next technology partner <ArrowRight className="h-4 w-4" /></a></div><div className="grid gap-3 sm:grid-cols-2" data-reveal>{[{ icon: Users, title: "People first", text: "We design for the people who will use the product every day." }, { icon: Target, title: "Purposeful choices", text: "Every feature and design decision should solve a real problem." }, { icon: ShieldCheck, title: "Built with care", text: "We value maintainability, security and dependable delivery." }, { icon: Sparkles, title: "Room to evolve", text: "We build foundations that can adapt as your needs change." }].map((item, index) => { const Icon = item.icon; return <article key={item.title} className={`rounded-[1.5rem] border p-6 sm:p-7 ${index === 1 || index === 2 ? "border-yellow-300 bg-yellow-200/50" : "border-white/90 bg-white/75"}`}><div className="mb-7 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-800 text-white"><Icon className="h-5 w-5" /></div><h3 className={`${heading} text-xl font-semibold`}>{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p></article>; })}</div></div></div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && <section className="py-24 sm:py-32"><div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12"><div data-reveal><SectionIntro eyebrow="Kind words" title="Good partnerships show in the work." description="We value clear communication, shared ownership and results people can feel—not just features shipped." /></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{testimonials.slice(0, 3).map((item, index) => <article key={item.id ?? item.name ?? index} className={`flex h-full flex-col rounded-[1.6rem] border p-7 sm:p-8 ${index === 1 ? "border-yellow-200 bg-[#FFF9E8]" : "border-blue-100 bg-white"}`} data-reveal><Quote className="h-7 w-7 text-blue-700" /><p className="mt-6 flex-1 text-base leading-8 text-slate-700">“{item.content || item.quote || "A thoughtful partner who understands the challenge, communicates clearly and delivers with care."}”</p><div className="mt-8 flex items-center gap-3 border-t border-slate-200 pt-5">{(item.avatar_url || item.avatar) ? <div className="relative h-11 w-11 overflow-hidden rounded-full bg-blue-100"><Image src={(item.avatar_url || item.avatar)!} alt={item.client_name || item.name || "Client"} fill sizes="44px" className="object-cover" unoptimized /></div> : <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-800 text-sm font-bold text-white">{(item.client_name || item.name || "C").slice(0, 1).toUpperCase()}</div>}<div><p className="text-sm font-bold text-slate-950">{item.client_name || item.name || "Client"}</p><p className="mt-1 text-xs text-slate-500">{[item.role, item.company].filter(Boolean).join(" · ") || "Project partner"}</p></div></div></article>)}</div></div></section>}

      {/* FAQ */}
      <section className="bg-white py-24 sm:py-32"><div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-20 lg:px-12"><div data-reveal><SectionIntro eyebrow="Questions, answered" title="A little clarity goes a long way." description="Starting something new can bring up questions. Here are a few of the things people usually want to know before we begin." /><div className="hidden rounded-2xl bg-blue-50 p-5 sm:block"><p className="text-sm font-semibold text-slate-800">Have a different question?</p><a href="#contact" className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-blue-800">Talk with us <ArrowRight className="h-4 w-4" /></a></div></div><div className="divide-y divide-slate-200 border-y border-slate-200" data-reveal>{faqItems.map((item, index) => { const isOpen = openFaq === index; return <div key={item.question}><button type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? null : index)} className="flex w-full items-center justify-between gap-5 py-6 text-left"><span className={`${heading} text-lg font-semibold sm:text-xl ${isOpen ? "text-blue-800" : "text-slate-900"}`}>{item.question}</span><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${isOpen ? "rotate-180 bg-yellow-300 text-slate-950" : "bg-blue-50 text-blue-800"}`}><ChevronDown className="h-4 w-4" /></span></button>{isOpen && <p className="max-w-2xl pb-7 pr-12 text-sm leading-7 text-slate-600">{item.answer}</p>}</div>; })}</div></div></section>

      {/* Contact CTA */}
      <section id="contact" className="relative isolate overflow-hidden bg-blue-800 py-24 sm:py-32 lg:py-36"><div className="pointer-events-none absolute -right-24 -top-40 h-[520px] w-[520px] rounded-full border border-white/10" /><div className="pointer-events-none absolute -right-4 -top-20 h-[370px] w-[370px] rounded-full border border-white/10" /><div className="pointer-events-none absolute -bottom-40 left-[12%] h-[400px] w-[400px] rounded-full bg-blue-600/60 blur-[90px]" /><div className="relative mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12"><div data-reveal><div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[.2em] text-yellow-300"><span className="h-px w-8 bg-yellow-300" />Your next step</div><h2 className={`${heading} max-w-4xl text-5xl font-semibold leading-[.98] text-white sm:text-6xl lg:text-7xl`}>Have a good idea?<br /><span className="text-yellow-300">Let’s give it shape.</span></h2><p className="mt-6 max-w-2xl text-base leading-8 text-blue-100/80 sm:text-lg">Tell us what you’re working toward. We’ll help you find a clear, practical path from where you are to what’s possible.</p></div><div className="flex flex-col gap-3 sm:flex-row lg:flex-col" data-reveal><a href={`mailto:${contactEmail}`}
 className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-yellow-300 px-7 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-yellow-200"><Mail className="h-4 w-4" /> Start a conversation <ArrowRight className="h-4 w-4" /></a><a href="#services" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/25 px-7 text-sm font-bold text-white transition hover:bg-white/10">Explore services <ArrowDownRight className="h-4 w-4" /></a></div></div><div className="relative mx-auto mt-20 flex max-w-[1400px] flex-col gap-5 border-t border-white/15 px-5 pt-7 text-xs text-blue-100/65 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12"><div className="flex items-center gap-3"><BrandLogo /><span className="text-white/75">Digital products. Real-world progress.</span></div><div className="flex flex-wrap gap-x-5 gap-y-2"><a href="#services" className="transition hover:text-yellow-300">Services</a><a href="#work" className="transition hover:text-yellow-300">Work</a><a href="#contact" className="transition hover:text-yellow-300">Contact</a></div><span>© {new Date().getFullYear()} Sadaat Upgrade. All rights reserved.</span></div></section>

      {/* Project detail dialog */}
      {activeProject && <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveProject(null); }}><div role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" className="relative my-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[1.7rem] bg-white shadow-2xl"><button type="button" onClick={() => setActiveProject(null)} aria-label="Close project details" className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow transition hover:bg-yellow-300"><X className="h-5 w-5" /></button><div className="relative aspect-[16/7] bg-gradient-to-br from-blue-100 via-white to-yellow-100">{(activeProject.image_url || activeProject.image) && <Image src={(activeProject.image_url || activeProject.image)!} alt={activeProject.title || activeProject.name || "Project"} fill sizes="90vw" className="object-cover" unoptimized />}</div><div className="p-6 sm:p-9"><span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-blue-800">{activeProject.category || "Selected work"}</span><h2 id="project-dialog-title" className={`${heading} mt-4 text-3xl font-semibold sm:text-4xl`}>{activeProject.title || activeProject.name || "Project details"}</h2><p className="mt-4 text-sm leading-7 text-slate-600">{activeProject.description || "A digital project focused on creating a better experience and measurable business value."}</p>{(activeProject.technologies || activeProject.tech_stack) && <div className="mt-6 flex flex-wrap gap-2">{(activeProject.technologies || activeProject.tech_stack || []).map((tech) => <span key={tech} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs text-slate-600">{tech}</span>)}</div>}<div className="mt-7 flex flex-wrap gap-3">{(activeProject.live_url || activeProject.website_url) && <a href={activeProject.live_url || activeProject.website_url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-blue-700 px-5 text-sm font-bold text-white hover:bg-blue-800">Visit project <ExternalLink className="h-4 w-4" /></a>}{activeProject.github_url && <a href={activeProject.github_url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 px-5 text-sm font-bold text-slate-800 hover:bg-slate-50"><Github className="h-4 w-4" /> GitHub</a>}</div></div></div></div>}
    </main>
  );
}
