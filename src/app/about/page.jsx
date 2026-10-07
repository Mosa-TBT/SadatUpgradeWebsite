import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Heart, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TeamSection } from "@/components/team-section";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="mx-auto px-4 md:px-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-800">About Us</Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  We&apos;re Passionate About
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {" "}
                    Digital Innovation
                  </span>
                </h1>
                <p className="text-xl text-gray-600">
                  Founded in 2019, we&apos;ve been helping businesses transform
                  their digital presence with cutting-edge solutions and
                  creative strategies.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/about-us.jpg"
                alt="About Us"
                width={500}
                height={500}
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto px-4 md:px-20">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-purple-100 text-purple-800">Our Values</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              What Drives Us Forward
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Target,
                title: "Excellence",
                description:
                  "We strive for perfection in every project, delivering solutions that exceed expectations.",
              },
              {
                icon: Users,
                title: "Collaboration",
                description:
                  "We work closely with our clients as partners, ensuring their vision becomes reality.",
              },
              {
                icon: Award,
                title: "Innovation",
                description:
                  "We stay ahead of trends and technologies to provide cutting-edge solutions.",
              },
              {
                icon: Heart,
                title: "Passion",
                description:
                  "We love what we do and it shows in the quality of our work and client relationships.",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="text-center border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="mx-auto px-4 md:px-20">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-slate-100 text-slate-800">Our Team</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Meet the Experts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our diverse team of designers, developers, and strategists brings
              years of experience and fresh perspectives to every project.
            </p>
          </div>
          <TeamSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-8 text-white">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Ready to Work Together?
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Let&apos;s discuss your project and see how our team can help
              bring your vision to life.
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Link href="/contact" className="flex items-center">
                Get In Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
