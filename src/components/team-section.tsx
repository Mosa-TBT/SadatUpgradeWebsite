
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Github,
  Globe,
  Link as LinkIcon,
  AlertCircle,
  Users,
  ArrowUpRight,
  ArrowRight,
  BriefcaseBusiness,
  Sparkles,
  ExternalLink,
  Mail,
} from "lucide-react";

import { API_URL } from "@/lib/admin/api";
import { cn } from "@/lib/utils";
import type { TeamMember } from "@/types";

const FALLBACK_IMAGE = "/placeholder.svg";

const SOCIAL_ICONS: Record<string, typeof Linkedin> = {
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  github: Github,
  website: Globe,
  website_url: Globe,
  portfolio: Globe,
};

function isSafeHttpUrl(value?: string | null): boolean {
  if (!value || typeof value !== "string") return false;

  try {
    const parsed = new URL(value.trim());

    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      Boolean(parsed.hostname)
    );
  } catch {
    return false;
  }
}

function getInitials(name?: string | null): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "SU";

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function TeamSection() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/public/team`, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Unable to load team members");
      }

      const body = (await response.json()) as {
        data?: TeamMember[];
      };

      setMembers(Array.isArray(body?.data) ? body.data : []);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to load team members",
      );
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const sorted = useMemo(
    () =>
      members
        .filter((member) => (member.status ?? "active") === "active")
        .sort(
          (first, second) =>
            (first.sort_order ?? 0) - (second.sort_order ?? 0),
        ),
    [members],
  );

  if (loading) {
    return (
      <div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Loading team members"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[26px] border border-slate-200 bg-white"
          >
            <div className="relative h-[300px] animate-pulse bg-slate-100 sm:h-[330px]">
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-200/70 to-transparent" />
            </div>

            <div className="space-y-3 p-6">
              <div className="h-5 w-2/3 animate-pulse rounded-md bg-slate-100" />
              <div className="h-4 w-1/3 animate-pulse rounded-md bg-slate-100" />
              <div className="h-3 w-full animate-pulse rounded-md bg-slate-50" />
              <div className="h-3 w-4/5 animate-pulse rounded-md bg-slate-50" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative overflow-hidden rounded-[28px] border border-amber-200 bg-amber-50/80 px-6 py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm">
          <AlertCircle className="h-6 w-6" />
        </div>

        <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-900">
          We couldn&apos;t load the team
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
          The team information is temporarily unavailable. Please check your
          connection and try again.
        </p>

        <button
          type="button"
          onClick={() => void load()}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          Try again
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-[28px] border border-dashed border-slate-300 bg-[#F8FAFF] px-6 py-14 text-center sm:py-16">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-yellow-200/40 blur-3xl" />

        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-slate-200 bg-white text-blue-700 shadow-sm">
          <Users className="h-7 w-7" />
        </div>

        <h3 className="relative mt-5 text-xl font-semibold tracking-tight text-slate-900">
          Good things take a team.
        </h3>

        <p className="relative mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Our team profiles will appear here as soon as they are available.
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Our team">
      <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        {sorted.map((member, index) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            index={index}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
        <span>Different talents. One shared vision.</span>
      </div>
    </section>
  );
}

function TeamMemberCard({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(
    member.image_url || FALLBACK_IMAGE,
  );

  useEffect(() => {
    setImageSrc(member.image_url || FALLBACK_IMAGE);
    setImageLoaded(false);
  }, [member.image_url]);

  const rawPortfolioUrl = member.portfolio_url?.trim();

  const portfolioUrl =
    rawPortfolioUrl && isSafeHttpUrl(rawPortfolioUrl)
      ? rawPortfolioUrl
      : null;

  const position = member.position ?? member.role ?? "Team Member";
  const socials = member.socials ?? {};

  const socialEntries = Object.entries(socials).filter(
    ([, value]) => isSafeHttpUrl(value),
  );

  const handleImageError = () => {
    if (imageSrc !== FALLBACK_IMAGE) {
      setImageSrc(FALLBACK_IMAGE);
    }
  };

  return (
    <article
      style={{ animationDelay: `${Math.min(index * 80, 400)}ms` }}
      className={cn(
        "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[26px]",
        "border border-slate-200/90 bg-white",
        "shadow-[0_5px_24px_-18px_rgba(15,23,42,0.18)]",
        "transition-all duration-500 ease-out",
        "hover:-translate-y-1.5 hover:border-blue-200",
        "hover:shadow-[0_28px_65px_-30px_rgba(37,99,235,0.28)]",
        "focus-within:border-blue-200",
      )}
    >
      {/* Photo and profile overlay */}
      <div className="relative isolate h-[310px] shrink-0 overflow-hidden bg-slate-100 sm:h-[340px]">
        {!imageLoaded && (
          <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-br from-blue-50 via-slate-100 to-yellow-50" />
        )}

        {/* eslint-disable-next-line @next/next/no-img-element -- images come from the existing team API and may use dynamic CMS URLs */}
        <img
          src={imageSrc}
          alt={`${member.name} — ${position}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-center",
            "transition-transform duration-700 ease-out",
            "group-hover:scale-[1.06]",
            imageLoaded ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Default image treatment */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-slate-950/5 transition-opacity duration-500 group-hover:opacity-0" />

        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/40 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-md transition-opacity duration-300 group-hover:opacity-0">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-700">
            Our people
          </span>
        </div>

        {/* Default information shown before hover */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 transition-all duration-400 group-hover:translate-y-2 group-hover:opacity-0 sm:p-6">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-200">
                <BriefcaseBusiness size={12} />
                {position}
              </p>

              <h3 className="break-words text-2xl font-semibold tracking-[-0.045em] text-white sm:text-[27px]">
                {member.name}
              </h3>
            </div>

            <div className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:bg-yellow-300 group-hover:text-slate-950">
              <ArrowUpRight size={19} />
            </div>
          </div>

          {member.bio && (
            <p className="line-clamp-2 max-w-sm text-xs leading-5 text-white/80">
              {member.bio}
            </p>
          )}

          <div className="mt-4 flex items-center gap-2">
            <span className="h-px w-7 bg-yellow-300" />
            <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-white/65">
              Meet the person
            </span>
          </div>
        </div>

        {/* Instagram-inspired profile panel on hover */}
        <div
          className={cn(
            "absolute inset-0 z-20 flex flex-col items-center justify-center",
            "bg-slate-950/85 px-5 py-6 text-center text-white backdrop-blur-[3px]",
            "opacity-0 transition-all duration-400 ease-out",
            "group-hover:opacity-100",
            "group-focus-within:opacity-100",
            "pointer-events-none group-hover:pointer-events-auto",
            "group-focus-within:pointer-events-auto",
            "max-sm:hidden",
          )}
        >
          {/* Decorative background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-600/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-yellow-400/15 blur-3xl" />

            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
              }}
            />
          </div>

          {/* Avatar */}
          <div className="relative">
            <div className="rounded-full bg-gradient-to-tr from-yellow-300 via-orange-400 to-blue-600 p-[3px] shadow-[0_0_35px_rgba(59,130,246,0.22)]">
              <div className="h-[86px] w-[86px] overflow-hidden rounded-full border-[3px] border-slate-950 bg-slate-800 sm:h-[94px] sm:w-[94px]">
                {/* eslint-disable-next-line @next/next/no-img-element -- dynamic image URL from the team API */}
                <img
                  src={imageSrc}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-slate-950 bg-yellow-300 text-slate-950">
              <Sparkles size={12} />
            </span>
          </div>

          <div className="relative mt-4 w-full">
            <h3 className="break-words text-xl font-bold tracking-[-0.04em] sm:text-2xl">
              {member.name}
            </h3>

            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.13em] text-yellow-300">
              {position}
            </p>

            <div className="mx-auto mt-4 h-px w-10 bg-white/25" />

            <p className="mx-auto mt-4 line-clamp-4 max-w-[260px] text-xs leading-6 text-slate-200">
              {member.bio ||
                "Part of the team turning ideas into meaningful digital experiences."}
            </p>
          </div>

          {/* Social links */}
          {socialEntries.length > 0 && (
            <div className="relative mt-5 flex items-center justify-center gap-2.5">
              {socialEntries.map(([key, value]) => {
                const Icon = SOCIAL_ICONS[key.toLowerCase()] ?? LinkIcon;

                return (
                  <a
                    key={key}
                    href={value as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on ${key}`}
                    title={key}
                    onClick={(event) => event.stopPropagation()}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all duration-200 hover:-translate-y-1 hover:border-yellow-300 hover:bg-yellow-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          )}

          {/* Portfolio action */}
          {portfolioUrl && (
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${member.name}'s portfolio`}
              className="relative mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-yellow-300 px-5 text-xs font-bold text-slate-950 transition-all duration-200 hover:bg-yellow-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              View profile
              <ExternalLink size={13} />
            </a>
          )}

          {!portfolioUrl && (
            <div className="relative mt-5 inline-flex items-center gap-2 text-[10px] font-medium text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />
              Sadaat Upgrade team
            </div>
          )}
        </div>
      </div>

      {/* Always-accessible information, especially on touch devices */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-sm font-bold tracking-tight text-blue-700">
            {getInitials(member.name)}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="break-words text-lg font-bold tracking-[-0.04em] text-slate-900 transition-colors group-hover:text-blue-700">
              {member.name}
            </h3>

            <p className="mt-1 break-words text-xs font-medium leading-5 text-slate-500">
              {position}
            </p>
          </div>

          {portfolioUrl && (
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${member.name}'s portfolio`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>

        {member.bio ? (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
            {member.bio}
          </p>
        ) : (
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Meet the person behind the work and the ideas we bring to life.
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" />
            <span className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Sadaat Upgrade
            </span>
          </div>

          {socialEntries.length > 0 ? (
            <div className="flex shrink-0 items-center gap-3">
              {socialEntries.slice(0, 4).map(([key, value]) => {
                const Icon = SOCIAL_ICONS[key.toLowerCase()] ?? LinkIcon;

                return (
                  <a
                    key={key}
                    href={value as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on ${key}`}
                    title={key}
                    className="text-slate-400 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          ) : (
            <span className="text-[10px] font-medium text-slate-400">
              Meet our team
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default TeamSection;
