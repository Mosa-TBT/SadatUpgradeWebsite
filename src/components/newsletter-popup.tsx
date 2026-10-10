"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Mail } from "lucide-react";
import { API_URL } from "@/lib/admin/api";
import type { FormEvent, ReactNode } from "react";

export function NewsletterPopup(): ReactNode {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem("newsletter-popup-seen");
      if (!hasSeenPopup) {
        setIsVisible(true);
      }
    }, 10000); // Show after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClose = (): void => {
    setIsVisible(false);
    localStorage.setItem("newsletter-popup-seen", "true");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await fetch(`${API_URL}/public/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Ignore network errors — keep the UX smooth.
    } finally {
      setSubmitting(false);
      setIsVisible(false);
      localStorage.setItem("newsletter-popup-seen", "true");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white">
        <CardHeader className="relative text-center space-y-4 pb-4">
          <Button
            onClick={handleClose}
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Stay Updated!</h3>
            <p className="text-gray-600">
              Get the latest insights on web development, design trends, and
              digital marketing delivered to your inbox.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? "Subscribing…" : "Subscribe Now"}
            </Button>
          </form>
          <p className="text-xs text-gray-500 text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
