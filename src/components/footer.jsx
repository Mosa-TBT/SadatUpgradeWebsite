"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { useSiteConfig } from "@/components/config-provider";

export function Footer() {
  const { config } = useSiteConfig();
  const general = config?.settings?.general || {};
  const social = config?.settings?.social || {};

  const email = general.contact_email || "hello@sadatupgrade.com";
  const phone = general.contact_phone || "+1 (555) 123-4567";
  const address = general.address || "New York, NY 10001";
  const socials = [
    { icon: Facebook, href: social.social_facebook },
    { icon: Twitter, href: social.social_x },
    { icon: Instagram, href: social.social_instagram },
    { icon: Linkedin, href: social.social_linkedin },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex rounded-2xl bg-white px-4 py-3 shadow-sm"
              aria-label="Sadat Upgrade home"
            >
              <BrandLogo height={104} />
            </Link>
            <p className="text-gray-400 max-w-sm">
              We create digital experiences that drive results. Transform your
              business with our cutting-edge solutions.
            </p>
            <div className="flex space-x-4">
              {socials.map((social, index) =>
                social.href ? (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-800 hover:text-white"
                    aria-label="Social link"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ) : null,
              )}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  Mobile Apps
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  E-commerce
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="hover:text-white transition-colors"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Get In Touch</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{address}</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Newsletter</h4>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {general.site_name || "Sadat Upgrade"}. {general.copyright_text || "All rights reserved."}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
