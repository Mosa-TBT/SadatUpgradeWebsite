import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, ArrowRight, Zap, Shield, Headphones } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const pricingPlans = [
    {
      name: "Starter",
      price: "$2,999",
      period: "one-time",
      description: "Perfect for small businesses and startups",
      features: [
        "5-page responsive website",
        "Mobile-optimized design",
        "Basic SEO setup",
        "Contact form integration",
        "1 month support",
        "Google Analytics setup",
        "Social media integration",
        "SSL certificate included",
      ],
      popular: false,
      cta: "Get Started",
      deliveryTime: "2-3 weeks",
    },
    {
      name: "Professional",
      price: "$7,999",
      period: "one-time",
      description: "Ideal for growing businesses",
      features: [
        "10-page responsive website",
        "Custom design & branding",
        "Advanced SEO optimization",
        "CMS integration",
        "E-commerce functionality (up to 50 products)",
        "3 months support",
        "Performance optimization",
        "Email marketing setup",
        "Blog functionality",
        "Advanced analytics",
      ],
      popular: true,
      cta: "Most Popular",
      deliveryTime: "4-6 weeks",
    },
    {
      name: "Enterprise",
      price: "$19,999",
      period: "one-time",
      description: "For large businesses and complex projects",
      features: [
        "Unlimited pages",
        "Custom web application",
        "Advanced e-commerce (unlimited products)",
        "Multi-language support",
        "Custom integrations",
        "6 months support",
        "Priority support",
        "Advanced security features",
        "Custom admin dashboard",
        "API development",
        "Performance monitoring",
        "Dedicated project manager",
      ],
      popular: false,
      cta: "Contact Sales",
      deliveryTime: "8-12 weeks",
    },
  ];

  const addOns = [
    {
      name: "Mobile App Development",
      price: "$15,000",
      description: "iOS and Android app with React Native",
    },
    {
      name: "Advanced SEO Package",
      price: "$2,500",
      description: "Comprehensive SEO audit and optimization",
    },
    {
      name: "Maintenance Package",
      price: "$299/month",
      description: "Ongoing updates, security, and support",
    },
    {
      name: "Digital Marketing Setup",
      price: "$3,500",
      description: "Google Ads, Facebook Ads, and analytics setup",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="px-4 md:px-20">
          <div className="text-center space-y-8">
            <Badge className="bg-blue-100 text-blue-800">Pricing Plans</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Simple,
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Transparent Pricing
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Choose the perfect plan for your business. All plans include our
              commitment to quality and your success.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="px-4 md:px-20">
          <div className="grid gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm ${
                  plan.popular
                    ? "ring-2 ring-blue-500 shadow-2xl scale-105"
                    : "shadow-xl"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-medium">
                    <Star className="inline h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                )}
                <CardHeader
                  className={`text-center space-y-4 ${
                    plan.popular ? "pt-12" : "pt-8"
                  }`}
                >
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-blue-600">
                      {plan.price}
                    </div>
                    <p className="text-gray-600">{plan.period}</p>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-700"
                  >
                    Delivery: {plan.deliveryTime}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                  >
                    <Link
                      href="/contact"
                      className="flex items-center justify-center w-full"
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="px-4 md:px-20">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-slate-100 text-slate-800">Add-ons</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Enhance Your Project
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Extend your project with additional services and features.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {addOns.map((addon, index) => (
              <Card
                key={index}
                className="border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start space-x-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{addon.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {addon.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">
                        {addon.price}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        Add to Project
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="px-4 md:px-20">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every plan includes these essential features and guarantees.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Fast Delivery",
                description:
                  "We deliver projects on time, every time. Our streamlined process ensures quick turnaround without compromising quality.",
              },
              {
                icon: Shield,
                title: "Quality Guarantee",
                description:
                  "100% satisfaction guarantee. If you're not happy with the result, we'll work until you are or provide a full refund.",
              },
              {
                icon: Headphones,
                title: "Ongoing Support",
                description:
                  "Comprehensive support included with every project. We're here to help you succeed long after launch.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="text-center border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="px-4 md:px-20">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-slate-100 text-slate-800">FAQ</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Pricing Questions
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 mx-auto">
            {[
              {
                question: "Are there any hidden fees?",
                answer:
                  "No hidden fees. The price you see is what you pay. All costs are transparent and discussed upfront.",
              },
              {
                question: "Do you offer payment plans?",
                answer:
                  "Yes, we offer flexible payment plans. Typically 50% upfront and 50% upon completion for most projects.",
              },
              {
                question: "What if I need changes after launch?",
                answer:
                  "Minor changes are included in your support period. Major changes can be handled as separate projects.",
              },
              {
                question: "Can I upgrade my plan later?",
                answer:
                  "You can upgrade your plan at any time. We'll credit what you've already paid toward the new plan.",
              },
              {
                question: "Do you offer refunds?",
                answer:
                  "We offer a satisfaction guarantee. If you're not happy with our work, we'll make it right or provide a refund.",
              },
              {
                question: "What's included in ongoing support?",
                answer:
                  "Support includes bug fixes, security updates, minor content changes, and technical assistance via email and phone.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="px-4 md:px-20">
          <div className="text-center space-y-8 text-white">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Choose your plan and let&apos;s build something amazing together.
              Free consultation included with every project.
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
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
