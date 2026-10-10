
"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  CheckCircle2,
  Sparkles,
  Plus,
  Minus,
  Globe2,
  Send,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { KabulMap } from "@/components/kabul-map";
import { usePublic } from "@/hooks/use-public";
import { useSiteConfig } from "@/components/config-provider";

import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import type { Faq } from "@/types";

const HEADING =
  "font-[family-name:var(--font-display)] tracking-[-0.055em]";

const BODY = "font-[family-name:var(--font-body)]";

interface ContactDetailProps {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  href?: string;
  accent?: "blue" | "yellow";
}

const CONTACT_FALLBACK = {
  emails: ["hello@sadatupgrade.com"],
  phones: ["+1 (555) 123-4567"],
  address: "Kabul, Afghanistan",
};

const defaultFaqs: Faq[] = [
  {
    id: 9001,
    sort_order: 1,
    question: "What should I include in my first message?",
    answer:
      "Tell us a little about your business, the problem you want to solve, and what you hope to achieve. If you already have a timeline or budget in mind, you can include that too.",
  },
  {
    id: 9002,
    sort_order: 2,
    question: "Can I discuss an idea before committing to a project?",
    answer:
      "Absolutely. The initial conversation is an opportunity to explain your idea, ask questions, and understand possible approaches before deciding on the next step.",
  },
  {
    id: 9003,
    sort_order: 3,
    question: "What types of projects do you work on?",
    answer:
      "We work on digital products and technology solutions, including websites, web applications, mobile apps, UI/UX design, and custom software. The best starting point is to tell us what you need.",
  },
  {
    id: 9004,
    sort_order: 4,
    question: "How soon can I expect a response?",
    answer:
      "Response time depends on the volume and complexity of enquiries. Include clear contact information and a concise project summary to help us understand your request.",
  },
];

export default function ContactPage(): ReactNode {
  const { config } = useSiteConfig();
  const { items: faqs } = usePublic<Faq>("faqs");
  const [openFaq, setOpenFaq] = useState<string | number | null>(null);

  const general = (config?.settings?.general ?? {}) as Record<string, unknown>;

  const rawEmails: string[] = Array.isArray(general.contact_emails)
    ? general.contact_emails.filter(
        (e): e is string => typeof e === "string" && e.trim().length > 0,
      )
    : [];
  const emails =
    rawEmails.length > 0
      ? rawEmails
      : typeof general.contact_email === "string" && general.contact_email
        ? [general.contact_email]
        : CONTACT_FALLBACK.emails;

  const rawPhones: string[] = Array.isArray(general.contact_phones)
    ? general.contact_phones.filter(
        (p): p is string => typeof p === "string" && p.trim().length > 0,
      )
    : [];
  const phones =
    rawPhones.length > 0
      ? rawPhones
      : typeof general.contact_phone === "string" && general.contact_phone
        ? [general.contact_phone]
        : CONTACT_FALLBACK.phones;

  const address =
    typeof general.address === "string" && general.address
      ? general.address
      : CONTACT_FALLBACK.address;

  const contactDetails: ContactDetailProps[] = [
    ...emails.map((value) => ({
      icon: Mail,
      title: "Email us",
      value,
      description: "Send us the details of your project.",
      href: `mailto:${value}`,
      accent: "blue" as const,
    })),
    ...phones.map((value) => ({
      icon: Phone,
      title: "Call us",
      value,
      description: "Speak directly with our team.",
      href: `tel:${value.replace(/[^\d+]/g, "")}`,
      accent: "yellow" as const,
    })),
    {
      icon: MapPin,
      title: "Our location",
      value: address,
      description: "Meetings are available by appointment.",
      accent: "blue" as const,
    },
    {
      icon: MessageCircle,
      title: "Live chat",
      value: "Talk to us online",
      description: "Use the live chat on our website.",
      accent: "yellow" as const,
    },
  ];

  const displayedFaqs =
    faqs && faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <main
      className={`${BODY} min-h-screen overflow-x-clip bg-[#F7FAFF] text-slate-950`}
    >
      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative isolate overflow-hidden border-b border-blue-100/80 bg-white">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-0 opacity-[0.34]"
            style={{
              backgroundImage:
                "linear-gradient(#dce7f7 1px, transparent 1px), linear-gradient(90deg, #dce7f7 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage:
                "linear-gradient(to bottom, black 0%, transparent 92%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, transparent 92%)",
            }}
          />

          <div className="absolute -left-40 -top-48 h-[520px] w-[520px] rounded-full bg-blue-100/70 blur-[110px]" />

          <div className="absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-yellow-100/80 blur-[120px]" />

          <div className="absolute bottom-[-250px] left-[40%] h-[420px] w-[420px] rounded-full bg-sky-100/60 blur-[110px]" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-12 lg:px-12 lg:pb-28 lg:pt-14">
          <div className="mb-14 flex items-center justify-between border-b border-slate-200/90 pb-5 sm:mb-20">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600" />
              </span>

              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 sm:text-xs">
                Get in touch
              </span>
            </div>

            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-400 sm:block">
              Ideas · Questions · Projects
            </span>
          </div>

          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
            <div className="relative">
              <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-blue-200 bg-blue-50/90 px-4 py-2.5 text-xs font-semibold text-blue-700 shadow-sm shadow-blue-900/[0.03]">
                <Sparkles className="h-4 w-4" />
                Let&apos;s build something meaningful
              </div>

              <h1
                className={`${HEADING} max-w-4xl text-[3.55rem] font-semibold leading-[0.92] text-slate-950 sm:text-7xl lg:text-[6.8rem]`}
              >
                Have an idea?
                <span className="relative mt-2 block w-fit bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 bg-clip-text pb-2 text-transparent">
                  Let&apos;s talk.
                  <span className="absolute bottom-0 left-1 h-[5px] w-[72%] rounded-full bg-yellow-300 sm:h-1.5" />
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
                Every great project starts with a conversation. Tell us what
                you want to build, improve, or solve. We&apos;ll listen,
                understand your goals, and help you find a practical way
                forward.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-13 rounded-full bg-blue-700 px-7 text-sm font-semibold text-white shadow-lg shadow-blue-700/15 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-800"
                >
                  <a href="#contact-form">
                    Start a conversation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-13 rounded-full border-slate-200 bg-white/80 px-7 text-sm font-semibold text-slate-800 transition duration-300 hover:border-blue-200 hover:bg-blue-50"
                >
                  <a href="#contact-details">
                    Explore contact options
                    <ArrowDown className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3">
                {[
                  "Clear communication",
                  "Practical guidance",
                  "Thoughtful solutions",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Conversation card */}

            <div className="relative mx-auto w-full max-w-[510px] lg:ml-auto">
              <div className="absolute -right-3 -top-3 h-28 w-28 rounded-[30px] bg-yellow-300 sm:-right-5 sm:-top-5 sm:h-36 sm:w-36" />

              <div className="absolute -bottom-4 -left-4 h-28 w-28 rounded-full border-[16px] border-blue-100 sm:-bottom-6 sm:-left-6 sm:h-36 sm:w-36" />

              <div className="relative overflow-hidden rounded-[30px] border border-slate-200/90 bg-white p-5 shadow-[0_30px_100px_-40px_rgba(30,64,175,0.25)] sm:rounded-[36px] sm:p-7">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-md shadow-blue-700/15">
                      <MessageCircle className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="text-sm font-bold text-slate-950">
                        Let&apos;s connect
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Your next idea starts here
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Open to enquiries
                  </div>
                </div>

                <div className="py-7">
                  <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-slate-100 bg-[#F4F7FC] p-4">
                    <div className="text-xs font-semibold text-slate-400">
                      YOU
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      I have an idea for a digital project. Can you help me
                      figure out where to start?
                    </p>
                  </div>

                  <div className="ml-auto mt-4 max-w-[88%] rounded-2xl rounded-tr-sm bg-blue-700 p-4 text-white shadow-lg shadow-blue-700/10">
                    <div className="text-xs font-semibold text-blue-200">
                      SADAAT UPGRADE
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/95">
                      Absolutely. Tell us about your idea and goals. We&apos;ll
                      explore the options together.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-300 text-slate-950">
                      <Zap className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        Start with a simple conversation
                      </div>
                      <div className="mt-1 text-xs leading-5 text-slate-500">
                        No complicated process.
                      </div>
                    </div>
                  </div>

                  <ArrowUpRight className="h-5 w-5 shrink-0 text-blue-700" />
                </div>
              </div>

              <div className="absolute -bottom-8 right-8 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl shadow-slate-900/[0.06] sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-700 text-[10px] font-bold text-white">
                      S
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-yellow-300 text-[10px] font-bold text-slate-900">
                      U
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Your idea matters
                    </div>
                    <div className="mt-0.5 text-[10px] text-slate-500">
                      Let&apos;s explore what&apos;s possible.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CONTACT BENEFITS
      ============================================================ */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 divide-y divide-slate-100 px-5 sm:grid-cols-2 sm:px-8 sm:divide-y-0 lg:grid-cols-4 lg:px-12">
          {[
            {
              icon: MessageCircle,
              title: "Real conversation",
              description: "Talk through your goals and challenges.",
            },
            {
              icon: ShieldCheck,
              title: "Clear communication",
              description: "Know what to expect from the beginning.",
            },
            {
              icon: Globe2,
              title: "Technology focused",
              description: "Explore solutions that fit your needs.",
            },
            {
              icon: Zap,
              title: "Practical next steps",
              description: "Turn an idea into an actionable plan.",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`flex gap-4 py-6 sm:px-5 sm:py-8 lg:px-6 ${
                  index > 0 ? "lg:border-l lg:border-slate-100" : ""
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                    index % 2 === 0
                      ? "bg-blue-50 text-blue-700"
                      : "bg-yellow-100 text-slate-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          CONTACT AREA
      ============================================================ */}

      <section id="contact-form" className="scroll-mt-20 bg-[#F7FAFF]">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
          <div className="mb-12 max-w-3xl sm:mb-16">
            <div className="mb-5 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.19em] text-blue-700">
              <span className="h-px w-8 bg-blue-600" />
              Start a conversation
            </div>

            <h2
              className={`${HEADING} text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl`}
            >
              Tell us what you&apos;re
              <span className="block text-blue-700">working on.</span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Whether you have a detailed project brief or just the beginning
              of an idea, this is a good place to start.
            </p>
          </div>

          <div className="grid items-start gap-7 lg:grid-cols-[1.12fr_.88fr] lg:gap-10">
            {/* FORM */}

            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_-45px_rgba(15,23,42,0.18)] sm:rounded-[32px] sm:p-9 lg:p-11">
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-100/60 blur-[70px]" />

              <div className="relative mb-9 flex items-start justify-between gap-5">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                    <Send className="h-3.5 w-3.5" />
                    Send a message
                  </div>

                  <h3
                    className={`${HEADING} text-2xl font-semibold text-slate-950 sm:text-3xl`}
                  >
                    Let&apos;s hear from you.
                  </h3>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
                    Fill in the form below and share the details that matter
                    most to you.
                  </p>
                </div>

                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-300 text-slate-950 sm:flex">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>

              <div className="relative">
                <ContactForm />
              </div>

              <div className="mt-7 flex items-start gap-3 border-t border-slate-100 pt-6">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <p className="text-xs leading-5 text-slate-500">
                  Please provide accurate contact details so we can respond to
                  your enquiry. Avoid sharing passwords or other sensitive
                  account information.
                </p>
              </div>
            </div>

            {/* CONTACT DETAILS */}

            <div id="contact-details" className="scroll-mt-24">
              <div className="mb-7">
                <div className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.19em] text-blue-700">
                  <span className="h-px w-8 bg-blue-600" />
                  Contact details
                </div>

                <h3
                  className={`${HEADING} text-3xl font-semibold leading-[1.02] text-slate-950 sm:text-4xl`}
                >
                  Choose how you&apos;d
                  <span className="block text-slate-400">like to connect.</span>
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Pick the channel that works best for you. We look forward to
                  hearing about your plans.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {contactDetails.map((detail) => (
                  <ContactDetail
                    key={`${detail.title}-${detail.value}`}
                    {...detail}
                  />
                ))}
              </div>

              <div className="relative mt-5 overflow-hidden rounded-[28px] bg-blue-700 p-7 text-white sm:p-8">
                <div className="pointer-events-none absolute -right-14 -top-20 h-48 w-48 rounded-full bg-yellow-300/20 blur-[60px]" />

                <div className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full border-[28px] border-white/[0.07]" />

                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-300 text-slate-950">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <h3
                    className={`${HEADING} mt-5 text-2xl font-semibold sm:text-3xl`}
                  >
                    Not sure where to start?
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-7 text-blue-100">
                    Begin with a short message. Explain your idea, ask a
                    question, or tell us about a challenge you want to solve.
                  </p>

                  <a
                    href="#contact-form"
                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-yellow-300 px-5 text-sm font-bold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-200"
                  >
                    Send your enquiry
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ==========================================================
              KABUL MAP
          ========================================================== */}

          <div className="mt-24 sm:mt-32">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.19em] text-blue-700">
                  <span className="h-px w-8 bg-blue-600" />
                  Our location
                </div>

                <h2
                  className={`${HEADING} text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl`}
                >
                  Rooted in Kabul.
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                  Connect with Sadaat Upgrade in Kabul, Afghanistan.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm">
                <MapPin className="h-4 w-4 text-blue-700" />
                Kabul, Afghanistan
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-2 shadow-[0_20px_70px_-45px_rgba(15,23,42,0.2)] sm:rounded-[34px] sm:p-3">
              <div className="overflow-hidden rounded-[22px] sm:rounded-[27px]">
                <KabulMap />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ
      ============================================================ */}

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <div>
              <div className="mb-5 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.19em] text-blue-700">
                <span className="h-px w-8 bg-blue-600" />
                Frequently asked questions
              </div>

              <h2
                className={`${HEADING} text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl`}
              >
                Good questions.
                <span className="block text-slate-400">Clear answers.</span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
                Here are a few helpful answers before we get started. If
                something else is on your mind, send us a message.
              </p>

              <div className="mt-8 rounded-[24px] border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-300 text-slate-950">
                    <MessageCircle className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Still have a question?
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-600">
                      We&apos;re happy to hear from you.
                    </p>

                    <Link
                      href="#contact-form"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 transition hover:text-blue-900"
                    >
                      Contact our team
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {displayedFaqs.map((faq, index) => {
                const faqId = faq.id ?? `faq-${index}`;
                const isOpen = openFaq === faqId;

                return (
                  <div
                    key={faqId}
                    className={`overflow-hidden rounded-[22px] border transition duration-300 ${
                      isOpen
                        ? "border-blue-200 bg-blue-50/60 shadow-sm shadow-blue-900/[0.03]"
                        : "border-slate-200 bg-[#F8FAFD] hover:border-blue-200 hover:bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setOpenFaq(isOpen ? null : faqId)
                      }
                      className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6 sm:py-6"
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition ${
                          isOpen
                            ? "bg-blue-700 text-white"
                            : "bg-white text-blue-700 ring-1 ring-slate-200"
                        }`}
                      >
                        {(index + 1).toString().padStart(2, "0")}
                      </span>

                      <span
                        className={`${HEADING} flex-1 text-base font-semibold leading-6 text-slate-900 sm:text-lg`}
                      >
                        {faq.question}
                      </span>

                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                          isOpen
                            ? "bg-yellow-300 text-slate-950"
                            : "bg-white text-slate-500 ring-1 ring-slate-200"
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </span>
                    </button>

                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="border-t border-blue-100/80 px-5 pb-6 pt-4 pl-[4.25rem] text-sm leading-7 text-slate-600 sm:px-6 sm:pl-[4.5rem]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
      ============================================================ */}

      <section className="relative isolate overflow-hidden bg-[#102A56]">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="absolute -left-40 top-[-180px] h-[480px] w-[480px] rounded-full bg-blue-400/20 blur-[120px]" />

          <div className="absolute -right-32 bottom-[-200px] h-[500px] w-[500px] rounded-full bg-yellow-300/15 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] px-6 py-14 text-center backdrop-blur-sm sm:rounded-[38px] sm:px-12 sm:py-20 lg:px-20 lg:py-24">
            <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full border-[30px] border-yellow-300/[0.08]" />

            <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full border-[40px] border-blue-300/[0.08]" />

            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-300 text-slate-950 shadow-lg shadow-yellow-300/10">
                <Sparkles className="h-6 w-6" />
              </div>

              <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100 sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />
                Your next chapter starts here
              </div>

              <h2
                className={`${HEADING} mx-auto mt-7 max-w-4xl text-4xl font-semibold leading-[1] text-white sm:text-6xl lg:text-7xl`}
              >
                Every great idea
                <span className="mt-2 block bg-gradient-to-r from-yellow-200 via-yellow-300 to-amber-200 bg-clip-text pb-2 text-transparent">
                  deserves a conversation.
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-blue-100/75 sm:text-base sm:leading-8">
                Have a question, a challenge, or a vision for something new?
                Tell us about it. We&apos;ll help you explore the next step.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-13 rounded-full bg-yellow-300 px-8 text-sm font-bold text-slate-950 shadow-lg shadow-yellow-300/10 transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-200"
                >
                  <a href="#contact-form">
                    Start a conversation
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-13 rounded-full border-white/20 bg-white/[0.04] px-8 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/10 hover:text-white"
                >
                  <a href="#contact-details">
                    Other ways to reach us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 text-center text-[11px] text-blue-100/50 sm:flex-row sm:text-left">
            <p>Sadaat Upgrade · Technology for what comes next.</p>
            <a
              href="#contact-form"
              className="inline-flex items-center gap-1.5 transition hover:text-yellow-300"
            >
              Get in touch
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ================================================================
   CONTACT DETAIL CARD
================================================================ */

function ContactDetail({
  icon: Icon,
  title,
  value,
  description,
  href,
  accent = "blue",
}: ContactDetailProps): ReactNode {
  const iconStyle =
    accent === "yellow"
      ? "bg-yellow-100 text-slate-900 group-hover:bg-yellow-200"
      : "bg-blue-50 text-blue-700 group-hover:bg-blue-100";

  const content = (
    <div className="flex items-start gap-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${iconStyle}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[11px]">
          {title}
        </div>

        <div className="mt-1.5 break-words text-sm font-bold text-slate-900 sm:text-base">
          {value}
        </div>

        <div className="mt-1.5 text-xs leading-5 text-slate-500">
          {description}
        </div>
      </div>

      {href && (
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-700" />
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="group rounded-[22px] border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-900/[0.02] transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/[0.05]"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="group rounded-[22px] border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-900/[0.02] transition duration-300 hover:border-blue-200">
      {content}
    </div>
  );
}
