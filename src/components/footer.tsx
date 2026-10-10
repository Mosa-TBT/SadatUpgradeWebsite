
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
  Globe2,
  Sparkles,
} from "lucide-react";

import { useSiteConfig } from "@/components/config-provider";
import { sanitizeNavLinks } from "@/components/nav-links";
import { usePublic } from "@/hooks/use-public";
import type { Service } from "@/types";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const LEGAL_LINKS: { name: string; href: string }[] = [];

export function Footer() {
  const { config, menus } = useSiteConfig();
  const { items: services } = usePublic<Service>("services");

  const general = (config?.settings?.general ?? {}) as Record<
    string,
    unknown
  >;

  const social = (config?.settings?.social ?? {}) as Record<
    string,
    unknown
  >;

  const siteName =
    typeof general.site_name === "string" && general.site_name
      ? general.site_name
      : "Sadat Upgrade";

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
        : ["hello@sadatupgrade.com"];

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
        : ["+1 (555) 123-4567"];

  const address =
    typeof general.address === "string" && general.address
      ? general.address
      : "Kabul, Afghanistan";

  const SOCIAL_PLATFORMS: Record<
    string,
    { name: string; icon: typeof Facebook }
  > = {
    facebook: { name: "Facebook", icon: Facebook },
    x: { name: "X / Twitter", icon: Twitter },
    instagram: { name: "Instagram", icon: Instagram },
    linkedin: { name: "LinkedIn", icon: Linkedin },
    youtube: { name: "YouTube", icon: Youtube },
    github: { name: "GitHub", icon: Github },
  };

  const socials: { name: string; icon: typeof Facebook; href: string }[] = [];

  const rawLinks: unknown[] = Array.isArray(social.social_links)
    ? social.social_links
    : [];

  for (const link of rawLinks) {
    if (!link || typeof link !== "object") continue;
    const record = link as {
      platform?: unknown;
      url?: unknown;
      is_active?: unknown;
    };
    if (record.is_active === false) continue;
    const platform =
      typeof record.platform === "string" ? record.platform.toLowerCase() : "";
    const href =
      typeof record.url === "string" ? record.url.trim() : "";
    const meta = SOCIAL_PLATFORMS[platform];
    if (meta && href) {
      socials.push({ name: meta.name, icon: meta.icon, href });
    }
  }

  if (socials.length === 0) {
    const legacy: Array<[string, unknown]> = [
      ["facebook", social.social_facebook],
      ["x", social.social_x],
      ["instagram", social.social_instagram],
      ["linkedin", social.social_linkedin],
      ["youtube", social.social_youtube],
      ["github", social.social_github],
    ];
    for (const [platform, value] of legacy) {
      const href = typeof value === "string" ? value.trim() : "";
      const meta = SOCIAL_PLATFORMS[platform];
      if (meta && href) {
        socials.push({ name: meta.name, icon: meta.icon, href });
      }
    }
  }

  const serviceNames = (services ?? []).slice(0, 5);

  const headerMenu = sanitizeNavLinks(menus?.header ?? []);
  const configuredLinks = headerMenu
    .filter((item) => Boolean(item.label && item.url))
    .map((item) => ({
      name: item.label,
      href: item.url,
    }));

  const navLinks = configuredLinks.length > 0 ? configuredLinks : NAV_LINKS;

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white text-slate-900">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-yellow-100/60 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Main CTA */}
        <div className="relative -mt-px pt-12 sm:pt-16">
          <div className="relative overflow-hidden rounded-[28px] bg-blue-700 px-6 py-9 text-white shadow-[0_24px_70px_-32px_rgba(29,78,216,0.65)] sm:px-10 sm:py-11 lg:px-14">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[42px] border-white/[0.07]"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-28 right-1/4 h-64 w-64 rounded-full bg-blue-500/40 blur-2xl"
            />

            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-blue-50">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                  Your next digital chapter starts here
                </div>

                <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-[42px]">
                  Have a vision?
                  <span className="mt-1 block text-yellow-300">
                    Let&apos;s make it real.
                  </span>
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-blue-100 sm:text-base">
                  From powerful websites to thoughtful digital products, we
                  help turn ambitious ideas into practical solutions.
                </p>
              </div>

              <Link
                href="/contact"
                className="group inline-flex min-h-14 shrink-0 items-center justify-between gap-8 self-start rounded-full bg-yellow-400 py-2 pl-6 pr-2 text-sm font-bold text-blue-950 shadow-lg shadow-blue-950/10 transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-xl lg:self-center"
              >
                Start a project
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-white transition-transform duration-300 group-hover:rotate-[-45deg]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid gap-12 pb-12 pt-14 sm:pt-16 lg:grid-cols-12 lg:gap-10 lg:pb-16 lg:pt-20">
          {/* Brand and social */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              aria-label={`${siteName} home`}
              className="group inline-flex items-center rounded-2xl border border-slate-100 bg-white px-3 py-2 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <Image
                src="/logo.jpeg"
                alt={siteName}
                width={621}
                height={1080}
                sizes="160px"
                className="h-[58px] w-auto object-contain"
              />
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-600">
              We craft digital experiences, reliable software, and modern
              websites that help businesses move forward with confidence.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              <span className="h-px w-7 bg-yellow-400" />
              Thoughtful technology. Meaningful results.
            </div>

            {socials.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2.5">
                {socials.map(({ name, icon: Icon, href }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${siteName} on ${name}`}
                    className="group flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-700 hover:text-white hover:shadow-md hover:shadow-blue-700/20"
                  >
                    <Icon className="h-[17px] w-[17px] transition-transform duration-200 group-hover:scale-110" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h3 className="flex items-center gap-2.5 text-sm font-bold text-slate-900">
              <span className="h-5 w-1 rounded-full bg-yellow-400" />
              Explore
            </h3>

            <ul className="mt-6 space-y-3.5">
              {navLinks.map((item) => (
                <li key={`${item.name}-${item.href}`}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-600 transition-colors duration-200 hover:text-blue-700"
                  >
                    <span className="h-1 w-1 rounded-full bg-slate-300 transition-all group-hover:h-1.5 group-hover:w-1.5 group-hover:bg-yellow-400" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h3 className="flex items-center gap-2.5 text-sm font-bold text-slate-900">
              <span className="h-5 w-1 rounded-full bg-blue-600" />
              Our services
            </h3>

            {serviceNames.length > 0 ? (
              <ul className="mt-6 space-y-3.5">
                {serviceNames.map((service) => (
                  <li key={service.id ?? service.title}>
                    <Link
                      href="/services"
                      className="group inline-flex items-start gap-2.5 text-sm leading-6 text-slate-600 transition-colors duration-200 hover:text-blue-700"
                    >
                      <ArrowDownRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:text-yellow-500" />
                      <span>{service.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="mt-6 space-y-3.5">
                <li>
                  <Link
                    href="/services"
                    className="text-sm text-slate-600 transition-colors hover:text-blue-700"
                  >
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-sm text-slate-600 transition-colors hover:text-blue-700"
                  >
                    Mobile Applications
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-sm text-slate-600 transition-colors hover:text-blue-700"
                  >
                    UI/UX Design
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Contact card */}
          <div className="lg:col-span-3">
            <h3 className="flex items-center gap-2.5 text-sm font-bold text-slate-900">
              <span className="h-5 w-1 rounded-full bg-yellow-400" />
              Get in touch
            </h3>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              Have a question or an idea? We&apos;d love to hear from you.
            </p>

            <div className="mt-5 space-y-3">
              {emails.map((emailItem) => (
                <a
                  key={emailItem}
                  href={`mailto:${emailItem}`}
                  className="group flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/60"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-700 group-hover:text-white">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                      Email us
                    </span>
                    <span className="mt-1 block break-all text-sm font-medium text-slate-700 transition-colors group-hover:text-blue-700">
                      {emailItem}
                    </span>
                  </span>
                </a>
              ))}

              {phones.map((phoneItem) => (
                <a
                  key={phoneItem}
                  href={`tel:${phoneItem.replace(/[^\d+]/g, "")}`}
                  className="group flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/60"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-50 text-yellow-700 transition-colors group-hover:bg-yellow-400 group-hover:text-blue-950">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                      Call us
                    </span>
                    <span className="mt-1 block text-sm font-medium text-slate-700 transition-colors group-hover:text-blue-700">
                      {phoneItem}
                    </span>
                  </span>
                </a>
              ))}

              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                    Find us
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-slate-700">
                    {address}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-200 py-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-slate-600 sm:text-sm">
                © {new Date().getFullYear()} {siteName}.
                <span className="ml-1 text-slate-400">
                  All rights reserved.
                </span>
              </p>
              <p className="text-xs text-slate-400">
                Built with care, designed for what&apos;s next.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {LEGAL_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs font-medium text-slate-500 transition-colors hover:text-blue-700 sm:text-sm"
                >
                  {item.name}
                </Link>
              ))}

              <span className="hidden h-4 w-px bg-slate-200 sm:block" />

              <a
                href="#top"
                onClick={(event) => {
                  event.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group inline-flex items-center gap-2 text-xs font-semibold text-blue-700 transition-colors hover:text-blue-900 sm:text-sm"
              >
                Back to top
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 transition-colors group-hover:bg-yellow-400">
                  <ArrowRight className="h-3.5 w-3.5 -rotate-90" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom brand accent */}
      <div
        aria-hidden="true"
        className="h-[3px] w-full bg-gradient-to-r from-blue-800 via-blue-600 to-yellow-400"
      />
    </footer>
  );
}
