import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Globe,
  Smartphone,
  Palette,
  Search,
  BarChart3,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="px-4 md:px-20">
          <div className="text-center space-y-8">
            <Badge className="bg-blue-100 text-blue-800">Our Services</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Complete
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Digital Solutions{" "}
              </span>
              for Your Business
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              From concept to launch, we provide comprehensive digital services
              that help your business thrive in today&apos;s competitive
              landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-32">
        <div className="px-4 md:px-20">
          <div className="grid gap-12 lg:gap-16">
            {[
              {
                icon: Globe,
                title: "Web Development",
                description:
                  "Custom websites and web applications built with cutting-edge technologies for optimal performance and user experience.",
                features: [
                  "Responsive Design",
                  "React & Next.js",
                  "Performance Optimization",
                  "SEO Implementation",
                  "CMS Integration",
                  "API Development",
                ],
                image: "/service1.jpg",
                technologies: [
                  "React",
                  "Next.js",
                  "TypeScript",
                  "Node.js",
                  "MongoDB",
                ],
              },
              {
                icon: Smartphone,
                title: "Mobile App Development",
                description:
                  "Native and cross-platform mobile applications that deliver exceptional user experiences across all devices.",
                features: [
                  "iOS & Android Apps",
                  "React Native",
                  "Flutter Development",
                  "App Store Optimization",
                  "Push Notifications",
                  "Offline Functionality",
                ],
                image: "/service2.avif",
                technologies: [
                  "React Native",
                  "Flutter",
                  "Swift",
                  "Kotlin",
                  "Firebase",
                ],
              },
              {
                icon: Palette,
                title: "UI/UX Design",
                description:
                  "Beautiful, intuitive designs that convert visitors into customers and enhance overall user satisfaction.",
                features: [
                  "User Research",
                  "Wireframing & Prototyping",
                  "Design Systems",
                  "Usability Testing",
                  "Brand Identity",
                  "Accessibility Design",
                ],
                image: "/service3.jpg",
                technologies: [
                  "Figma",
                  "Adobe XD",
                  "Sketch",
                  "InVision",
                  "Principle",
                ],
              },
              {
                icon: Search,
                title: "Digital Marketing",
                description:
                  "Comprehensive digital marketing strategies to increase your online visibility and drive sustainable growth.",
                features: [
                  "Search Engine Optimization",
                  "Pay-Per-Click Advertising",
                  "Social Media Marketing",
                  "Content Marketing",
                  "Email Campaigns",
                  "Analytics & Reporting",
                ],
                image: "/service4.avif",
                technologies: [
                  "Google Ads",
                  "Facebook Ads",
                  "Google Analytics",
                  "SEMrush",
                  "Mailchimp",
                ],
              },
              {
                icon: ShoppingCart,
                title: "E-commerce Solutions",
                description:
                  "Powerful online stores with secure payment processing, inventory management, and conversion optimization.",
                features: [
                  "Custom E-commerce Development",
                  "Shopify & WooCommerce",
                  "Payment Gateway Integration",
                  "Inventory Management",
                  "Order Tracking",
                  "Multi-vendor Support",
                ],
                image: "/service5.webp",
                technologies: [
                  "Shopify",
                  "WooCommerce",
                  "Stripe",
                  "PayPal",
                  "Magento",
                ],
              },
              {
                icon: BarChart3,
                title: "Analytics & Insights",
                description:
                  "Data-driven insights and comprehensive analytics to help you make informed business decisions.",
                features: [
                  "Google Analytics Setup",
                  "Custom Dashboards",
                  "Performance Tracking",
                  "Conversion Optimization",
                  "A/B Testing",
                  "ROI Analysis",
                ],
                image: "/service6.jpeg",
                technologies: [
                  "Google Analytics",
                  "Mixpanel",
                  "Hotjar",
                  "Tableau",
                  "Power BI",
                ],
              },
            ].map((service, index) => (
              <div
                key={index}
                className={`grid gap-8 lg:grid-cols-2 lg:gap-16 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                <div
                  className={`space-y-6 ${
                    index % 2 === 1 ? "lg:col-start-2" : ""
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <service.icon className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold">{service.title}</h2>
                    </div>
                    <p className="text-xl text-gray-600">
                      {service.description}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">
                      Technologies We Use:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="bg-gray-100 text-gray-700"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                <div
                  className={`relative ${
                    index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20" />
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    width={600}
                    height={400}
                    className="relative rounded-3xl shadow-2xl"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="px-4 md:px-20">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-slate-100 text-slate-800">Our Process</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              How We Work
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our proven process ensures successful project delivery from start
              to finish.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Discovery",
                description:
                  "We understand your business goals, target audience, and project requirements.",
              },
              {
                step: "02",
                title: "Strategy",
                description:
                  "We develop a comprehensive strategy and roadmap for your project.",
              },
              {
                step: "03",
                title: "Design & Development",
                description:
                  "Our team creates and builds your solution with attention to every detail.",
              },
              {
                step: "04",
                title: "Launch & Support",
                description:
                  "We launch your project and provide ongoing support and maintenance.",
              },
            ].map((process, index) => (
              <Card
                key={index}
                className="text-center border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="text-4xl font-bold text-blue-600">
                      {process.step}
                    </div>
                    <h3 className="text-xl font-semibold">{process.title}</h3>
                    <p className="text-gray-600">{process.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-8 text-white">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Let&apos;s discuss your project requirements and create a custom
              solution that drives results for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Link href="/contact" className="flex items-center">
                  Start Your Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white bg-blue-600 hover:text-blue-600"
              >
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
