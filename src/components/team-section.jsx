"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import { API_URL } from "@/lib/admin/api";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE = "/placeholder.svg";

const SOCIAL_ICONS = {
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

function isSafeHttpUrl(value) {
  if (!value || typeof value !== "string") return false;
  if (!/^https?:\/\//i.test(value.trim())) return false;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function TeamSection() {
  const [members, setMembers] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/public/team`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Unable to load team members");
      const body = await res.json();
      setMembers(body?.data || []);
    } catch (e) {
      setError(e.message || "Unable to load team members");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sorted = useMemo(
    () =>
      (members || [])
        .filter((m) => (m.status ?? "active") === "active")
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [members],
  );

  if (loading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border-0 bg-white/80 backdrop-blur-sm shadow-sm"
          >
            <div className="h-64 w-full animate-pulse bg-gray-200" />
            <div className="space-y-2 p-6">
              <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <AlertCircle className="mx-auto mb-2 h-6 w-6 text-amber-500" />
        <p className="text-sm text-amber-700">
          We couldn&apos;t load the team right now. Please try again.
        </p>
        <button
          onClick={load}
          className="mt-3 rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
        >
          Retry
        </button>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-10 text-center">
        <Users className="mx-auto mb-2 h-7 w-7 text-gray-300" />
        <p className="text-sm text-gray-500">Our team is growing — check back soon.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {sorted.map((member) => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}

function TeamMemberCard({ member }) {
  const portfolioUrl = isSafeHttpUrl(member.portfolio_url) ? member.portfolio_url.trim() : null;
  const position = member.position || member.role;
  const socials = member.socials || {};
  const socialEntries = Object.entries(socials).filter(([, v]) => isSafeHttpUrl(v));

  const cardInner = (
    <>
      <div className="relative overflow-hidden">
        <TeamMemberImage
          src={member.image_url}
          alt={member.name}
          fallback={FALLBACK_IMAGE}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
        <p className="text-blue-600 font-medium mb-2">{position || "Our Team"}</p>
        {member.bio && <p className="text-gray-600 text-sm mb-3">{member.bio}</p>}
        {socialEntries.length > 0 && (
          <div className="flex space-x-3 pt-1">
            {socialEntries.map(([key, url]) => {
              const Icon = SOCIAL_ICONS[key.toLowerCase()] || LinkIcon;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on ${key}`}
                  className="text-gray-400 transition hover:text-blue-600"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </>
  );

  const sharedCardClass =
    "h-full overflow-hidden border-0 bg-white/80 backdrop-blur-sm transition-all duration-200"; // preserves existing card look

  if (portfolioUrl) {
    return (
      <a
        href={portfolioUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${member.name}'s portfolio`}
        className={cn(sharedCardClass, "block cursor-pointer hover:-translate-y-0.5 hover:shadow-lg")}
      >
        {cardInner}
      </a>
    );
  }

  return <div className={cn(sharedCardClass, "block")}>{cardInner}</div>;
}

function TeamMemberImage({ src, alt, fallback }) {
  const [current, setCurrent] = useState(src);

  useEffect(() => {
    setCurrent(src);
  }, [src]);

  const resolved = current || fallback;

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={resolved} alt={alt} loading="lazy" onError={() => setCurrent(fallback)} className="w-full h-64 object-cover" />;
}

export default TeamSection;