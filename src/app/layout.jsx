import { Inter } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/site-chrome";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sadat Upgrade - Transform Your Business with Digital Solutions",
  description:
    "Sadat Upgrade is a digital innovation company delivering web development, mobile apps, UI/UX design, and digital marketing that transform your business.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
