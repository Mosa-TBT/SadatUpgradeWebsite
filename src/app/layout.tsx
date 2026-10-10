import { Inter } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { SiteChrome } from "@/components/site-chrome";
import type { Metadata } from "next";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sadat Upgrade - Transform Your Business with Digital Solutions",
  description:
    "Sadat Upgrade is a digital innovation company delivering web development, mobile apps, UI/UX design, and digital marketing that transform your business.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
