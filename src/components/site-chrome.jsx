"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LiveChat } from "@/components/live-chat";
import { NewsletterPopup } from "@/components/newsletter-popup";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ConfigProvider, PageViewTracker } from "@/components/config-provider";

export function SiteChrome({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <ConfigProvider>
      <PageViewTracker />
      <Header />
      <main>{children}</main>
      <Footer />
      <LiveChat />
      <NewsletterPopup />
      <ScrollToTop />
    </ConfigProvider>
  );
}
