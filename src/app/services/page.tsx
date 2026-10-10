
"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Blocks,
  Check,
  ChevronDown,
  Code2,
  Globe2,
  Layers3,
  Lightbulb,
  Palette,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Target,
  Workflow,
  Zap,
  X,
} from "lucide-react";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";

import { usePublic } from "@/hooks/use-public";
import { useSiteConfig } from "@/components/config-provider";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const bodyFont = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const heading =
  "font-[family-name:var(--font-display)] tracking-[-0.055em]";

type Service = {
  id?: string | number;
  title?: string;
  name?: string;
  description?: string;
  short_description?: string;
  icon?: string;
  slug?: string;
  category?: string;
  features?: string[] | string;
  technologies?: string[] | string;
  price?: string | number;
  starting_price?: string | number;
  duration?: string;
  status?: string;
  is_active?: boolean;
  image?: string;
  image_url?: string;
};

type ServiceDetail = {
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  color: "blue" | "yellow";
  features: string[];
  deliverables: string[];
};

const iconMap: Record<
  string,
  ComponentType<{ className?: string }>
> = {
  Globe: Globe2,
  Globe2,
  Website: Globe2,
  WebDevelopment: Globe2,
  Smartphone,
  Mobile: Smartphone,
  MobileApplication: Smartphone,
  Palette,
  Design: Palette,
  UIUX: Palette,
  Code: Code2,
  Code2,
  Software: Code2,
  CustomSoftware: Code2,
  BarChart3,
  Analytics: BarChart3,
  Strategy: Target,
  ShoppingCart,
  Ecommerce: ShoppingCart,
  ECommerce: ShoppingCart,
  Layers3,
  Workflow,
  ShieldCheck,
  Security: ShieldCheck,
  Lightbulb,
  Zap,
  Blocks,
};

const fallbackServices: Service[] = [
  {
    slug: "web-development",
    title: "Web Development",
    description:
      "Fast, accessible and responsive websites built around your business goals, your audience and the way your customers work.",
    icon: "Globe2",
    features: [
      "Business websites",
      "Web applications",
      "Landing pages",
      "Performance optimization",
    ],
  },
  {
    slug: "mobile-applications",
    title: "Mobile Applications",
    description:
      "Useful mobile experiences that help your customers access your services and keep your team connected wherever work happens.",
    icon: "Smartphone",
    features: [
      "Cross-platform applications",
      "Intuitive user journeys",
      "API integration",
      "App maintenance",
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    description:
      "Thoughtful interfaces and clear user journeys that turn complicated processes into simple, enjoyable digital experiences.",
    icon: "Palette",
    features: [
      "Interface design",
      "User journey mapping",
      "Interactive prototypes",
      "Design systems",
    ],
  },
  {
    slug: "custom-software",
    title: "Custom Software",
    description:
      "Purpose-built digital systems that reduce repetitive work, connect your operations and support the way your business grows.",
    icon: "Code2",
    features: [
      "Business management systems",
      "Workflow automation",
      "API development",
      "System integration",
    ],
  },
  {
    slug: "e-commerce",
    title: "E-Commerce",
    description:
      "Digital storefronts designed to present your products clearly, build trust and make purchasing straightforward for customers.",
    icon: "ShoppingCart",
    features: [
      "Online storefronts",
      "Product management",
      "Order workflows",
      "Payment integrations",
    ],
  },
  {
    slug: "digital-strategy",
    title: "Digital Strategy",
    description:
      "A practical technology roadmap that connects your business priorities with the right tools, clear decisions and measurable outcomes.",
    icon: "BarChart3",
    features: [
      "Digital consultation",
      "Technical planning",
      "Product roadmaps",
      "Process improvement",
    ],
  },
];

const serviceDetails: Record<string, ServiceDetail> = {
  "web-development": {
    label: "Digital presence",
    description:
      "A strong website should do more than look good. It should communicate your value, earn trust and help visitors take the next step.",
    icon: Globe2,
    color: "blue",
    features: [
      "Responsive layouts for desktop, tablet and mobile",
      "Fast page loads and accessible interfaces",
      "Search-friendly technical foundations",
      "Content management and API integrations",
    ],
    deliverables: [
      "A polished, responsive website",
      "Clear page structure and navigation",
      "Performance and accessibility checks",
    ],
  },
  "mobile-applications": {
    label: "Mobile experiences",
    description:
      "Bring your service closer to your customers with a mobile product that feels natural to use and dependable in everyday situations.",
    icon: Smartphone,
    color: "yellow",
    features: [
      "Cross-platform app development",
      "Thoughtful mobile-first interactions",
      "Backend and API integration",
      "Testing across supported devices",
    ],
    deliverables: [
      "A mobile application tailored to your needs",
      "Integrated data and service workflows",
      "A foundation ready for future improvements",
    ],
  },
  "ui-ux-design": {
    label: "Product experience",
    description:
      "Make every interaction feel intentional. We turn user needs and business requirements into clear, consistent product experiences.",
    icon: Palette,
    color: "blue",
    features: [
      "User flows and information architecture",
      "High-fidelity interface design",
      "Interactive prototypes",
      "Reusable design systems",
    ],
    deliverables: [
      "User-centered interface designs",
      "Interactive prototypes",
      "Consistent components and design guidelines",
    ],
  },
  "custom-software": {
    label: "Business systems",
    description:
      "Replace disconnected tools and repetitive manual tasks with software designed around your actual business processes.",
    icon: Code2,
    color: "yellow",
    features: [
      "Custom business applications",
      "Role-based access and workflows",
      "Third-party system integrations",
      "Maintainable and secure architecture",
    ],
    deliverables: [
      "Software aligned with your processes",
      "Documented workflows and integrations",
      "A maintainable technical foundation",
    ],
  },
  "e-commerce": {
    label: "Online commerce",
    description:
      "Create a convenient buying experience that presents your products beautifully and helps customers move from discovery to purchase.",
    icon: ShoppingCart,
    color: "blue",
    features: [
      "Product catalog and search",
      "Shopping cart and checkout",
      "Order management",
      "Payment and delivery integrations",
    ],
    deliverables: [
      "A tailored online storefront",
      "Product and order management",
      "A responsive shopping experience",
    ],
  },
  "digital-strategy": {
    label: "Technology planning",
    description:
      "Make technology decisions with confidence. We help identify the right priorities before you invest time and resources in implementation.",
    icon: BarChart3,
    color: "yellow",
    features: [
      "Business and technical discovery",
      "Digital product planning",
      "Technology recommendations",
      "Implementation roadmaps",
    ],
    deliverables: [
      "A prioritized action plan",
      "Clear technical recommendations",
      "Practical next steps and milestones",
    ],
  },
};

const processSteps = [
  {
    number: "01",
    title: "Understand",
    description:
      "We learn about your goals, your users and the challenge you want to solve.",
    icon: Lightbulb,
  },
  {
    number: "02",
    title: "Plan & design",
    description:
      "We define the scope, shape the experience and agree on the right direction.",
    icon: Palette,
  },
  {
    number: "03",
    title: "Build & test",
    description:
      "We turn the plan into a working solution and test it against real requirements.",
    icon: Code2,
  },
  {
    number: "04",
    title: "Launch & improve",
    description:
      "We launch carefully and help you identify opportunities for continued improvement.",
    icon: Zap,
  },
];

const faqItems = [
  {
    question: "How do I choose the right service?",
    answer:
      "Start with the result you want to achieve. We can discuss your current situation, clarify the challenge and recommend a practical combination of services that fits your goals.",
  },
  {
    question: "Can you combine multiple services in one project?",
    answer:
      "Yes. A project may include strategy, design, development and ongoing support. We organize the work around your requirements rather than forcing your project into a predefined package.",
  },
  {
    question: "How much does a project cost?",
    answer:
      "Cost depends on the scope, complexity, integrations and timeline. After discussing your requirements, we can outline the work and provide an estimate before implementation begins.",
  },
  {
    question: "Can you work with an existing website or application?",
    answer:
      "Absolutely. We can improve an existing product, fix issues, update its interface, improve performance or add new capabilities while preserving the parts that already work well.",
  },
  {
    question: "Do you offer support after delivery?",
    answer:
      "We can discuss ongoing maintenance, technical support, security updates, performance improvements and future development based on your product and business needs.",
  },
];

function normalizeList(value?: string[] | string): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0,
    );
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(/[,;\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function getServiceTitle(service: Service): string {
  return service.title?.trim() || service.name?.trim() || "Digital service";
}

function getServiceDescription(service: Service): string {
  return (
    service.short_description?.trim() ||
    service.description?.trim() ||
    "A practical digital solution tailored to your goals and the way you work."
  );
}

function getServiceSlug(service: Service, index: number): string {
  if (service.slug?.trim()) {
    return service.slug.trim().toLowerCase();
  }

  return (
    getServiceTitle(service)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `service-${index + 1}`
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <div
        className={`mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[.2em] ${
          light ? "text-yellow-300" : "text-blue-700"
        }`}
      >
        <span
          className={`h-px w-8 ${
            light ? "bg-yellow-300" : "bg-blue-700"
          }`}
        />
        {eyebrow}
      </div>

      <h2
        className={`${heading} text-4xl font-semibold leading-[1.02] sm:text-5xl lg:text-6xl ${
          light ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-5 max-w-2xl text-base leading-8 sm:text-lg ${
            light ? "text-blue-100/80" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function ServiceCard({
  service,
  index,
  onOpen,
}: {
  service: Service;
  index: number;
  onOpen: (service: Service) => void;
}) {
  const title = getServiceTitle(service);
  const description = getServiceDescription(service);
  const slug = getServiceSlug(service, index);
  const Icon =
    iconMap[service.icon || ""] ||
    serviceDetails[slug]?.icon ||
    Layers3;

  const features =
    normalizeList(service.features).length > 0
      ? normalizeList(service.features).slice(0, 3)
      : normalizeList(service.technologies).slice(0, 3);

  const isYellow = index % 3 === 1;

  return (
    <article
      data-reveal
      className={`group relative flex min-h-[350px] flex-col overflow-hidden rounded-[1.7rem] border p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(24,65,130,.12)] sm:p-8 ${
        isYellow
          ? "border-yellow-200 bg-[#FFF9E8]"
          : "border-blue-100 bg-white"
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl transition duration-500 group-hover:scale-125 ${
          isYellow ? "bg-yellow-200/70" : "bg-blue-100/80"
        }`}
      />

      <div className="relative mb-8 flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl transition duration-300 group-hover:rotate-[-5deg] group-hover:scale-105 ${
            isYellow
              ? "bg-yellow-300 text-slate-950"
              : "bg-blue-700 text-white"
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>

        <span className="text-xs font-semibold tracking-[.15em] text-slate-400">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <p className="relative mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-blue-700">
        {service.category || "Our expertise"}
      </p>

      <h3
        className={`${heading} relative text-2xl font-semibold text-slate-950 sm:text-[1.7rem]`}
      >
        {title}
      </h3>

      <p className="relative mt-3 flex-1 text-sm leading-7 text-slate-600">
        {description}
      </p>

      {features.length > 0 && (
        <ul className="relative mt-5 space-y-2.5">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-xs leading-5 text-slate-600"
            >
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                <Check className="h-3 w-3" />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => onOpen(service)}
        className="relative mt-7 inline-flex w-fit items-center gap-2 text-sm font-bold text-blue-800 transition hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
      >
        Explore service
        <ArrowRight className="h-4 w-4" />
      </button>
    </article>
  );
}

export default function ServicesPage() {
  const { config } = useSiteConfig();
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const { data: servicesData, error } = usePublic<Service>("services");

  const services = useMemo<Service[]>(() => {
    const raw = Array.isArray(servicesData)
      ? servicesData
      : Array.isArray(
            (servicesData as unknown as { data?: Service[] })?.data,
          )
        ? (servicesData as unknown as { data?: Service[] }).data ?? []
        : [];

    const hiddenStatuses = new Set(["draft", "archived", "inactive", "disabled"]);
    const activeStatuses = new Set(["active", "published", "1", "true", "yes"]);

    const activeServices = raw.filter((service) => {
      const status = String(service.status ?? "")
        .trim()
        .toLowerCase();
      if (status && hiddenStatuses.has(status)) return false;
      if (status && activeStatuses.has(status)) return true;
      return service.is_active !== false;
    });

    if (raw.length > 0) return activeServices;

    if (error && raw.length === 0) return fallbackServices;

    return [];
  }, [servicesData, error]);

  const activeSlug = activeService
    ? getServiceSlug(activeService, 0)
    : "";

  const activeDetail = activeService
    ? serviceDetails[activeSlug]
    : undefined;

  const activeIcon = activeService
    ? iconMap[activeService.icon || ""] ||
      activeDetail?.icon ||
      Layers3
    : Layers3;

  const activeFeatures = activeService
    ? normalizeList(activeService.features)
    : [];

  const activeTechnologies = activeService
    ? normalizeList(activeService.technologies)
    : [];

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
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
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [services.length]);

  useEffect(() => {
    if (!activeService) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveService(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeService]);

  return (
    <main
      className={`${displayFont.variable} ${bodyFont.variable} overflow-hidden bg-[#F7FAFF] font-[family-name:var(--font-body)] text-slate-950`}
    >
      <style jsx global>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(22px);
          transition:
            opacity 0.7s ease,
            transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        [data-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          [data-reveal] {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#F7FAFF]">
        <div className="pointer-events-none absolute -right-40 -top-44 h-[580px] w-[580px] rounded-full bg-blue-200/55 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-48 left-[15%] h-[430px] w-[430px] rounded-full bg-yellow-200/55 blur-[90px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[.045] [background-image:linear-gradient(#16325c_1px,transparent_1px),linear-gradient(90deg,#16325c_1px,transparent_1px)] [background-size:54px_54px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

        <div className="relative mx-auto grid min-h-[600px] max-w-[1400px] items-center gap-12 px-5 pb-24 pt-20 sm:px-8 lg:min-h-[690px] lg:grid-cols-[1.04fr_.96fr] lg:px-12 lg:pb-28 lg:pt-24">
          <div className="relative z-10" data-reveal>
            <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-[11px] font-bold uppercase tracking-[.17em] text-blue-800 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-700" />
              </span>
              Strategy · Design · Technology
            </div>

            <h1
              className={`${heading} max-w-3xl text-[3.5rem] font-semibold leading-[.93] sm:text-7xl lg:text-[6.5rem]`}
            >
              The right service.
              <br />
              <span className="relative inline-block text-blue-700">
                Real impact
                <span className="absolute -bottom-1 left-1 right-0 h-[.12em] -rotate-2 rounded-full bg-yellow-300 sm:-bottom-2" />
              </span>
              <span className="text-blue-700">.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
              Thoughtful design, practical engineering and technology that
              moves your business forward. Find the right starting point for
              your next digital project.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#services-list"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-700 px-7 text-sm font-bold text-white shadow-[0_12px_30px_rgba(29,78,216,.22)] transition hover:-translate-y-0.5 hover:bg-blue-800"
              >
                Explore our services
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>

              <a
                href="#contact"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/75 px-7 text-sm font-bold text-slate-800 transition hover:border-blue-300 hover:bg-white"
              >
                Discuss your idea
                <ArrowDownRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200/80 pt-6 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-700" />
                Built around your goals
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-700" />
                Clear process
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-700" />
                Designed to grow
              </span>
            </div>
          </div>

          {/* Custom service overview illustration */}
          <div className="relative mx-auto w-full max-w-[570px]" data-reveal>
            <div className="absolute inset-[8%] rounded-[3rem] bg-blue-200/50 blur-3xl" />

            <div className="absolute -right-1 top-[6%] z-20 hidden rotate-6 rounded-2xl border border-yellow-200 bg-yellow-300 px-4 py-3 shadow-lg shadow-yellow-900/10 sm:block">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Sparkles className="h-4 w-4" />
                Ideas into action
              </div>
            </div>

            <div className="relative rotate-[1deg] rounded-[2rem] border border-white bg-white/85 p-3 shadow-[0_40px_100px_rgba(22,50,92,.17)] backdrop-blur-xl sm:p-4">
              <div className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-[#F8FAFF]">
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-4 py-1.5 text-[10px] font-semibold tracking-wide text-slate-400">
                    SERVICE OVERVIEW
                  </span>
                  <div className="h-7 w-7 rounded-full bg-blue-100" />
                </div>

                <div className="grid grid-cols-[58px_1fr] sm:grid-cols-[72px_1fr]">
                  <div className="flex flex-col items-center gap-5 border-r border-slate-200 bg-white py-6">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white">
                      <Blocks className="h-4 w-4" />
                    </div>
                    <span className="h-7 w-7 rounded-lg bg-blue-50" />
                    <span className="h-7 w-7 rounded-lg bg-yellow-100" />
                    <span className="h-7 w-7 rounded-lg bg-slate-100" />
                    <span className="h-7 w-7 rounded-lg bg-slate-100" />
                    <div className="mt-auto h-7 w-7 rounded-full bg-slate-200" />
                  </div>

                  <div className="p-4 sm:p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-700">
                      Your digital journey
                    </p>
                    <h2
                      className={`${heading} mt-1 text-2xl font-semibold sm:text-3xl`}
                    >
                      One clear direction.
                    </h2>
                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      The right expertise for the work that matters.
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                          <Globe2 className="h-4 w-4" />
                        </div>
                        <p className="mt-4 text-[10px] text-slate-500">
                          Digital presence
                        </p>
                        <p className={`${heading} text-lg font-semibold sm:text-xl`}>
                          Web & apps
                        </p>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full w-[78%] rounded-full bg-blue-700" />
                        </div>
                      </div>

                      <div className="rounded-2xl bg-blue-700 p-3 text-white sm:p-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                          <Target className="h-4 w-4" />
                        </div>
                        <p className="mt-4 text-[10px] text-blue-100">
                          Our priority
                        </p>
                        <p className={`${heading} text-lg font-semibold sm:text-xl`}>
                          Real value
                        </p>
                        <p className="mt-1 text-[10px] leading-4 text-blue-100/80">
                          Less friction. Better outcomes.
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">
                            From idea to delivery
                          </p>
                          <p className="mt-1 text-xs font-semibold text-slate-700">
                            A process built around you
                          </p>
                        </div>
                        <Workflow className="h-5 w-5 text-blue-700" />
                      </div>

                      <div className="mt-5 flex items-center">
                        <div className="flex flex-1 items-center">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-white">
                            <Lightbulb className="h-3.5 w-3.5" />
                          </span>
                          <span className="h-px flex-1 bg-blue-200" />
                        </div>
                        <div className="flex flex-1 items-center">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300 text-slate-900">
                            <Palette className="h-3.5 w-3.5" />
                          </span>
                          <span className="h-px flex-1 bg-blue-200" />
                        </div>
                        <div className="flex flex-1 items-center">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                            <Code2 className="h-3.5 w-3.5" />
                          </span>
                          <span className="h-px flex-1 bg-slate-200" />
                        </div>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                          <Zap className="h-3.5 w-3.5" />
                        </span>
                      </div>

                      <div className="mt-2 flex justify-between text-[9px] font-medium text-slate-400">
                        <span>Discover</span>
                        <span>Design</span>
                        <span>Build</span>
                        <span>Deliver</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-2 z-20 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl sm:-left-7 sm:p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-300">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Made for your business
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Practical. Polished. Purposeful.
                </p>
              </div>
            </div>
          </div>
        </div>

        <a
          href="#services-list"
          aria-label="Scroll to services"
          className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-slate-400 transition hover:text-blue-700 lg:flex"
        >
          Scroll to explore
          <ChevronDown className="h-4 w-4" />
        </a>
      </section>

      {/* Trust strip */}
      <section className="border-y border-blue-100 bg-white">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-y divide-blue-100 px-5 sm:grid-cols-4 sm:divide-y-0 sm:px-8 lg:px-12">
          {[
            { value: "Strategy", label: "Start with clarity" },
            { value: "Design", label: "Make it intuitive" },
            { value: "Engineering", label: "Build it properly" },
            { value: "Support", label: "Keep moving forward" },
          ].map((item, index) => (
            <div
              key={item.value}
              className="flex min-h-[112px] flex-col justify-center px-5 py-5 sm:px-7"
            >
              <span
                className={`${heading} text-xl font-semibold sm:text-2xl ${
                  index === 1 ? "text-blue-700" : "text-slate-950"
                }`}
              >
                {item.value}
                <span className="text-yellow-400">.</span>
              </span>
              <span className="mt-1 text-xs text-slate-500 sm:text-sm">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Services grid */}
      <section
        id="services-list"
        className="relative scroll-mt-24 py-24 sm:py-32 lg:py-36"
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div
            className="mb-12 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end sm:mb-16"
            data-reveal
          >
            <SectionIntro
              eyebrow="What we do"
              title="Expertise that moves you forward."
              description="Every business has a different challenge. Explore our capabilities and find a practical starting point for your next digital project."
            />

            <a
              href="#contact"
              className="mb-1 hidden items-center gap-2 text-sm font-bold text-blue-800 transition hover:gap-3 lg:inline-flex"
            >
              Tell us what you need
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard
                key={
                  service.id ??
                  service.slug ??
                  `${getServiceTitle(service)}-${index}`
                }
                service={service}
                index={index}
                onOpen={setActiveService}
              />
            ))}
          </div>

          <div
            className="mt-7 flex items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:px-7 sm:py-6"
            data-reveal
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-300 text-slate-950">
                <Sparkles className="h-5 w-5" />
              </div>

              <p className="text-sm leading-6 text-slate-700">
                Need something more specific?{" "}
                <span className="font-bold text-slate-950">
                  Let’s shape a solution around your needs.
                </span>
              </p>
            </div>

            <a
              href="#contact"
              aria-label="Discuss a custom solution"
              className="ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-700 text-white transition hover:bg-blue-800"
            >
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative overflow-hidden bg-[#EEF4FF] py-24 sm:py-32 lg:py-36">
        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-yellow-200/40 blur-[90px]" />

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
            <div data-reveal>
              <SectionIntro
                eyebrow="How we work"
                title="A clear path from idea to impact."
                description="Good work comes from shared understanding, deliberate decisions and careful execution. Here is how we turn your requirements into something useful."
              />

              <div className="mt-9 rounded-[1.6rem] bg-blue-800 p-7 text-white sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-300 text-slate-950">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <h3 className={`${heading} mt-6 text-2xl font-semibold`}>
                  No mystery process.
                </h3>

                <p className="mt-3 text-sm leading-7 text-blue-100/80">
                  We keep communication clear, explain important decisions and
                  make sure you understand what is happening at every stage.
                </p>
              </div>
            </div>

            <div className="relative" data-reveal>
              <div className="absolute bottom-8 left-[23px] top-8 hidden w-px bg-blue-200 sm:block" />

              {processSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.number}
                    className="group relative grid gap-4 border-b border-blue-200/70 py-7 first:pt-0 last:border-0 sm:grid-cols-[48px_1fr] sm:gap-6"
                  >
                    <div
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:scale-105 ${
                        index === 1
                          ? "bg-yellow-300 text-slate-950"
                          : "bg-white text-blue-800"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <span className="text-[10px] font-bold tracking-[.16em] text-blue-700">
                            STEP {step.number}
                          </span>
                        </div>

                        <h3
                          className={`${heading} text-2xl font-semibold sm:text-3xl`}
                        >
                          {step.title}
                        </h3>

                        <p className="mt-2 max-w-xl text-sm leading-7 text-slate-600">
                          {step.description}
                        </p>
                      </div>

                      <span
                        className={`${heading} hidden text-5xl font-semibold text-blue-100 transition group-hover:text-blue-200 sm:block`}
                      >
                        {step.number}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-[#FFF7DF] py-24 sm:py-32 lg:py-36">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16 lg:px-12">
          <div data-reveal>
            <SectionIntro
              eyebrow="Why Sadaat Upgrade"
              title="Technology with a human point of view."
              description="The best digital solution is not necessarily the most complicated. It is the one that helps people work better, solve real problems and move forward with confidence."
            />

            <a
              href="#contact"
              className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-blue-800 transition hover:gap-3"
            >
              Meet your next technology partner
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-2" data-reveal>
            {[
              {
                icon: UsersIcon,
                title: "People first",
                text: "We consider the people who will use your product every day.",
              },
              {
                icon: Target,
                title: "Purposeful choices",
                text: "Every feature should solve a real problem or support a clear goal.",
              },
              {
                icon: ShieldCheck,
                title: "Built with care",
                text: "We value security, maintainability and dependable delivery.",
              },
              {
                icon: Sparkles,
                title: "Room to evolve",
                text: "We create foundations that can adapt as your needs change.",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className={`rounded-[1.5rem] border p-6 transition duration-300 hover:-translate-y-1 sm:p-7 ${
                    index === 1 || index === 2
                      ? "border-yellow-300 bg-yellow-200/50"
                      : "border-white/90 bg-white/75"
                  }`}
                >
                  <div className="mb-7 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-800 text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className={`${heading} text-xl font-semibold`}>
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-20 lg:px-12">
          <div data-reveal>
            <SectionIntro
              eyebrow="Questions, answered"
              title="A little clarity goes a long way."
              description="A few useful answers to help you understand how we work together and what to expect when starting a project."
            />

            <div className="hidden rounded-2xl bg-blue-50 p-5 sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Have a different question?
              </p>
              <a
                href="#contact"
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-blue-800"
              >
                Talk with us
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div
            className="divide-y divide-slate-200 border-y border-slate-200"
            data-reveal
          >
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <div key={item.question}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenFaq(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-5 py-6 text-left"
                  >
                    <span
                      className={`${heading} text-lg font-semibold sm:text-xl ${
                        isOpen ? "text-blue-800" : "text-slate-900"
                      }`}
                    >
                      {item.question}
                    </span>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                        isOpen
                          ? "rotate-180 bg-yellow-300 text-slate-950"
                          : "bg-blue-50 text-blue-800"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <p className="max-w-2xl pb-7 pr-12 text-sm leading-7 text-slate-600">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section
        id="contact"
        className="relative isolate scroll-mt-20 overflow-hidden bg-blue-800 py-24 sm:py-32 lg:py-36"
      >
        <div className="pointer-events-none absolute -right-24 -top-40 h-[520px] w-[520px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-4 -top-20 h-[370px] w-[370px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-40 left-[12%] h-[400px] w-[400px] rounded-full bg-blue-600/60 blur-[90px]" />

        <div className="relative mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12">
          <div data-reveal>
            <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[.2em] text-yellow-300">
              <span className="h-px w-8 bg-yellow-300" />
              Your next step
            </div>

            <h2
              className={`${heading} max-w-4xl text-5xl font-semibold leading-[.98] text-white sm:text-6xl lg:text-7xl`}
            >
              Have a challenge?
              <br />
              <span className="text-yellow-300">
                Let’s find the right solution.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-blue-100/80 sm:text-lg">
              Tell us what you are working toward. We will help you find a
              clear, practical path from your current situation to what is
              possible.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col" data-reveal>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-yellow-300 px-7 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-yellow-200"
            >
              Discuss your project
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#services-list"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/25 px-7 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Explore services
              <ArrowDownRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="relative mx-auto mt-20 flex max-w-[1400px] flex-col gap-3 border-t border-white/15 px-5 pt-7 text-xs text-blue-100/65 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span className="text-white/75">
            Sadaat Upgrade · Digital products. Real-world progress.
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="#services-list" className="transition hover:text-yellow-300">
              Services
            </a>
            <a href="#contact" className="transition hover:text-yellow-300">
              Contact
            </a>
          </div>
          <span>
            © {new Date().getFullYear()} Sadaat Upgrade. All rights reserved.
          </span>
        </div>
      </section>

      {/* Service details modal */}
      {activeService && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveService(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-dialog-title"
            className="relative my-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[1.7rem] border border-white/60 bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setActiveService(null)}
              aria-label="Close service details"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-800 shadow-sm transition hover:bg-yellow-300"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-yellow-100 px-6 pb-8 pt-9 sm:px-9 sm:pb-10 sm:pt-10">
              <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-blue-200/60 blur-3xl" />

              <div className="relative flex items-start gap-4 pr-8">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                    activeDetail?.color === "yellow"
                      ? "bg-yellow-300 text-slate-950"
                      : "bg-blue-700 text-white"
                  }`}
                >
                  {(() => {
                    const Icon = activeIcon;
                    return <Icon className="h-6 w-6" />;
                  })()}
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-700">
                    {activeDetail?.label ||
                      activeService.category ||
                      "Our expertise"}
                  </p>

                  <h2
                    id="service-dialog-title"
                    className={`${heading} mt-2 text-3xl font-semibold sm:text-4xl`}
                  >
                    {getServiceTitle(activeService)}
                  </h2>
                </div>
              </div>

              <p className="relative mt-6 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                {activeDetail?.description ||
                  getServiceDescription(activeService)}
              </p>
            </div>

            <div className="grid gap-8 p-6 sm:grid-cols-2 sm:p-9">
              <div>
                <h3 className={`${heading} text-xl font-semibold`}>
                  What we can help with
                </h3>

                <ul className="mt-5 space-y-3">
                  {(activeFeatures.length > 0
                    ? activeFeatures
                    : activeDetail?.features || [
                        getServiceDescription(activeService),
                        "A solution shaped around your requirements",
                        "A clear and practical implementation plan",
                      ]
                  ).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                        <Check className="h-3 w-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className={`${heading} text-xl font-semibold`}>
                  A thoughtful approach
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  We start by understanding your needs, agree on the scope and
                  build a solution around your goals. The exact deliverables
                  depend on your project.
                </p>

                {activeDetail && (
                  <ul className="mt-4 space-y-3">
                    {activeDetail.deliverables.map((deliverable) => (
                      <li
                        key={deliverable}
                        className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                      >
                        <Check className="mt-1 h-4 w-4 shrink-0 text-blue-700" />
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                )}

                {activeTechnologies.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {activeTechnologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-800"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                )}

                {activeService.duration && (
                  <p className="mt-5 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">
                      Estimated duration:
                    </span>{" "}
                    {activeService.duration}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/80 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-9">
              <p className="text-sm text-slate-500">
                Have a project in mind?
              </p>

              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent(
                  `Project inquiry: ${getServiceTitle(activeService)}`,
                )}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-700 px-6 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Discuss this service
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function UsersIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
