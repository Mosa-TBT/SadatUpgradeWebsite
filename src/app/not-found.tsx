import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import type { ReactNode } from "react";

export default function NotFound(): ReactNode {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-2xl mx-auto border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-12 text-center space-y-8">
            <div className="flex justify-center">
              <BrandLogo height={76} />
            </div>
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-gray-300">404</h1>
              <h2 className="text-3xl font-bold text-gray-900">
                Page Not Found
              </h2>
              <p className="text-xl text-gray-600 max-w-md mx-auto">
                Sorry, we couldn&apos;t find the page you&apos;re looking for.
                It might have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/" className="flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
              >
                <Link href="/contact" className="flex items-center">
                  <Search className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
            </div>

            <div className="pt-8 border-t">
              <p className="text-sm text-gray-500 mb-4">
                Popular pages you might be looking for:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link
                  href="/services"
                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                >
                  Services
                </Link>
                <Link
                  href="/about"
                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
