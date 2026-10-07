"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { BrandLockup } from "@/components/brand-logo";
import { useSiteConfig } from "@/components/config-provider";

const FALLBACK_NAVIGATION = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { menus, config } = useSiteConfig();

  const brandName =
    config?.settings?.branding?.brand_name ||
    config?.settings?.general?.site_name ||
    "Sadat Upgrade";

  const navigation =
    menus?.header?.length > 0
      ? menus.header.map((item) => ({ name: item.label, href: item.url, target: item.target }))
      : FALLBACK_NAVIGATION;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 md:px-20">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center"
            aria-label="Sadat Upgrade home"
          >
            <BrandLockup markSize={38} priority name={brandName} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-50"
            >
              <Link href={"/login"}>Login</Link>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Link href={"/signup"}>Get Started</Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-6">
                <Link
                  href="/"
                  className="flex items-center"
                  aria-label="Sadat Upgrade home"
                  onClick={() => setIsOpen(false)}
                >
                  <BrandLockup markSize={34} name={brandName} />
                </Link>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex flex-col space-y-3 pt-6 border-t">
                  <Button
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    Login
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
