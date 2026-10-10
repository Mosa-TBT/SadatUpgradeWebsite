
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownRight,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { useSiteConfig } from "@/components/config-provider";
import { sanitizeNavLinks } from "@/components/nav-links";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface HeaderLink {
  name: string;
  href: string;
  target?: string;
  children?: HeaderLink[];
}

const FALLBACK_NAVIGATION: HeaderLink[] = [
  { name: "Home", href: "/" },
  {
    name: "Services",
    href: "/services",
  },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

function toLinks(
  items: NavItem[] | undefined,
  fallback: HeaderLink[],
): HeaderLink[] {
  if (!items || items.length === 0) return fallback;

  return items.map((item) => ({
    name: item.label,
    href: item.url,
    target: item.target !== "_self" ? item.target : undefined,
    children: toLinks(item.children, []),
  }));
}

function isExternalTarget(target?: string) {
  return target === "_blank";
}

function HeaderNavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: HeaderLink;
  pathname: string | null;
  onNavigate?: () => void;
}) {
  const hasChildren = Boolean(item.children?.length);

  const isActive =
    item.href === "/"
      ? pathname === "/"
      : Boolean(
          pathname &&
            (pathname === item.href ||
              pathname.startsWith(`${item.href.replace(/\/$/, "")}/`)),
        );

  const childIsActive = item.children?.some(
    (child) =>
      pathname === child.href ||
      (child.href !== "/" && pathname?.startsWith(`${child.href}/`)),
  );

  const active = isActive || Boolean(childIsActive);

  const linkClass = cn(
    "inline-flex items-center gap-1.5 rounded-full px-4 py-2.5",
    "text-[13px] font-semibold tracking-[-0.01em]",
    "transition-all duration-200",
    active
      ? "bg-blue-50 text-blue-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-blue-700",
  );

  return (
    <div className="group relative">
      <div className="flex items-center gap-0.5">
        <Link
          href={item.href}
          target={item.target}
          rel={isExternalTarget(item.target) ? "noopener noreferrer" : undefined}
          onClick={onNavigate}
          aria-current={isActive ? "page" : undefined}
          className={linkClass}
        >
          {item.name}

          {hasChildren && (
            <ChevronDown
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
            />
          )}
        </Link>
      </div>

      {hasChildren && (
        <div
          className={cn(
            "invisible absolute left-0 top-full z-50 w-64 pt-3 opacity-0",
            "translate-y-2 transition-all duration-200",
            "group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
            "group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100",
          )}
        >
          <div className="rounded-2xl border border-slate-200/80 bg-white p-2 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.22)]">
            {item.children!.map((child) => {
              const childActive =
                pathname === child.href ||
                (child.href !== "/" &&
                  Boolean(pathname?.startsWith(`${child.href}/`)));

              return (
                <Link
                  key={`${child.name}-${child.href}`}
                  href={child.href}
                  target={child.target}
                  rel={
                    isExternalTarget(child.target)
                      ? "noopener noreferrer"
                      : undefined
                  }
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl px-3.5 py-3",
                    "text-sm font-medium transition-colors",
                    childActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-700",
                  )}
                >
                  <span>{child.name}</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { menus } = useSiteConfig();

  const navSource = sanitizeNavLinks(menus?.header);

  const navigation = toLinks(
    navSource.length > 0 ? navSource : undefined,
    FALLBACK_NAVIGATION,
  );

  const contactLink =
    navigation.find(
      (item) =>
        item.href === "/contact" ||
        item.name.toLowerCase().includes("contact"),
    ) ?? { name: "Contact", href: "/contact" };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Brand */}
          <Link
            href="/"
            aria-label="Sadat Upgrade home"
            className="group relative flex shrink-0 items-center"
          >
            <span className="absolute -inset-2 rounded-2xl bg-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <Image
              src="/logo.jpeg"
              alt="Sadat Upgrade"
              width={621}
              height={1080}
              priority
              sizes="150px"
              className="relative h-12 w-auto object-contain sm:h-[52px]"
            />
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <HeaderNavLink
                key={`${item.name}-${item.href}`}
                item={item}
                pathname={pathname}
              />
            ))}
          </nav>

          {/* Desktop contact action */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href={contactLink.href}
              target={contactLink.target}
              rel={
                isExternalTarget(contactLink.target)
                  ? "noopener noreferrer"
                  : undefined
              }
              className={cn(
                "group inline-flex h-11 items-center justify-center gap-2",
                "rounded-full bg-blue-700 px-5",
                "text-sm font-semibold text-white",
                "shadow-[0_5px_14px_-6px_rgba(29,78,216,0.65)]",
                "transition-all duration-200",
                "hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-lg",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-blue-600 focus-visible:ring-offset-2",
              )}
            >
              Let&apos;s Talk
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              <span className="ml-0.5 h-2 w-2 rounded-full bg-yellow-400" />
            </Link>
          </div>

          {/* Tablet and mobile navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label={isOpen ? "Close navigation" : "Open navigation"}
                className={cn(
                  "h-11 w-11 rounded-xl border-slate-200 bg-white text-slate-800",
                  "shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50",
                  "lg:hidden",
                )}
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className={cn(
                "w-[min(88vw,390px)] overflow-y-auto border-l border-slate-200",
                "bg-white p-0 text-slate-900",
              )}
            >
              <div className="flex min-h-full flex-col">
                {/* Mobile panel heading */}
                <div className="border-b border-slate-100 px-6 pb-5 pt-7">
                  <SheetTitle className="sr-only">
                    Sadat Upgrade navigation
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Browse the pages and services of Sadat Upgrade.
                  </SheetDescription>

                  <Link
                    href="/"
                    aria-label="Sadat Upgrade home"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center"
                  >
                    <Image
                      src="/logo.jpeg"
                      alt="Sadat Upgrade"
                      width={621}
                      height={1080}
                      sizes="130px"
                      className="h-12 w-auto object-contain"
                    />
                  </Link>

                  <div className="mt-6 overflow-hidden rounded-2xl bg-blue-700 p-5 text-white">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-yellow-400" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100">
                        Digital solutions
                      </span>
                    </div>

                    <p className="max-w-[250px] text-xl font-semibold leading-snug tracking-tight">
                      Let&apos;s build something meaningful.
                    </p>

                    <div className="mt-4 h-1 w-12 rounded-full bg-yellow-400" />
                  </div>
                </div>

                {/* Mobile links */}
                <nav
                  className="flex-1 px-4 py-5"
                  aria-label="Mobile navigation"
                >
                  <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Explore
                  </p>

                  <div className="space-y-1">
                    {navigation.map((item) => {
                      const isActive =
                        item.href === "/"
                          ? pathname === "/"
                          : pathname === item.href ||
                            Boolean(
                              pathname?.startsWith(
                                `${item.href.replace(/\/$/, "")}/`,
                              ),
                            );

                      const childIsActive = item.children?.some(
                        (child) =>
                          pathname === child.href ||
                          (child.href !== "/" &&
                            Boolean(pathname?.startsWith(`${child.href}/`))),
                      );

                      return (
                        <div key={`${item.name}-${item.href}`}>
                          <Link
                            href={item.href}
                            target={item.target}
                            rel={
                              isExternalTarget(item.target)
                                ? "noopener noreferrer"
                                : undefined
                            }
                            onClick={() => setIsOpen(false)}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                              "group flex min-h-12 items-center justify-between rounded-xl px-3.5 py-3",
                              "text-sm font-semibold transition-all duration-200",
                              isActive || childIsActive
                                ? "bg-blue-50 text-blue-700"
                                : "text-slate-600 hover:bg-slate-50 hover:text-blue-700",
                            )}
                          >
                            <span className="flex items-center gap-3">
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full transition-colors",
                                  isActive || childIsActive
                                    ? "bg-yellow-400"
                                    : "bg-slate-300 group-hover:bg-blue-500",
                                )}
                              />
                              {item.name}
                            </span>

                            <ArrowDownRight
                              className={cn(
                                "h-4 w-4 transition-transform",
                                isActive || childIsActive
                                  ? "text-blue-600"
                                  : "text-slate-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5",
                              )}
                            />
                          </Link>

                          {item.children && item.children.length > 0 && (
                            <div className="ml-6 mt-1 space-y-1 border-l border-slate-200 pl-3">
                              {item.children.map((child) => (
                                <Link
                                  key={`${child.name}-${child.href}`}
                                  href={child.href}
                                  target={child.target}
                                  rel={
                                    isExternalTarget(child.target)
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                  onClick={() => setIsOpen(false)}
                                  className={cn(
                                    "block rounded-lg px-3 py-2.5 text-sm transition-colors",
                                    pathname === child.href
                                      ? "bg-blue-50 font-semibold text-blue-700"
                                      : "text-slate-500 hover:bg-slate-50 hover:text-blue-700",
                                  )}
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </nav>

                {/* Mobile contact action */}
                <div className="border-t border-slate-100 bg-slate-50/70 p-5">
                  <Link
                    href={contactLink.href}
                    target={contactLink.target}
                    rel={
                      isExternalTarget(contactLink.target)
                        ? "noopener noreferrer"
                        : undefined
                    }
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "group flex min-h-12 w-full items-center justify-between",
                      "rounded-xl bg-blue-700 px-5 py-3",
                      "text-sm font-semibold text-white shadow-md shadow-blue-900/10",
                      "transition-colors hover:bg-blue-800",
                    )}
                  >
                    <span>Let&apos;s Talk</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-blue-950 transition-transform group-hover:translate-x-1">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>

                  <p className="mt-4 text-center text-xs text-slate-400">
                    Thoughtful technology. Meaningful results.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Subtle brand accent */}
      <div
        aria-hidden="true"
        className="h-[2px] w-full bg-gradient-to-r from-blue-700 via-blue-500 to-yellow-400"
      />
    </header>
  );
}
