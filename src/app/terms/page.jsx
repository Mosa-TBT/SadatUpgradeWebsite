import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Scale,
  CreditCard,
  Copyright,
  AlertTriangle,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
} from "lucide-react";

export default function TermsOfServicePage() {
  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <UserCheck className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  Agreement to Terms
                </h4>
                <p className="text-blue-800 leading-relaxed">
                  By accessing and using our services, you accept and agree to
                  be bound by the terms and provisions of this agreement. If you
                  do not agree to abide by the above, please do not use this
                  service.
                </p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-semibold text-gray-900 mb-2">
                What This Means
              </h5>
              <p className="text-gray-700 text-sm">
                Using our website or services indicates your acceptance of these
                terms.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-semibold text-gray-900 mb-2">Updates</h5>
              <p className="text-gray-700 text-sm">
                We may update these terms, and continued use means acceptance of
                changes.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "services",
      title: "Services Description",
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed text-lg">
            We provide comprehensive web development, design, and digital
            marketing services to help businesses succeed online.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Web Development",
                desc: "Custom websites and web applications",
                color: "blue",
                icon: "🌐",
              },
              {
                title: "Mobile Apps",
                desc: "iOS and Android application development",
                color: "green",
                icon: "📱",
              },
              {
                title: "E-commerce",
                desc: "Online stores and payment integration",
                color: "purple",
                icon: "🛒",
              },
              {
                title: "Digital Marketing",
                desc: "SEO, PPC, and social media marketing",
                color: "orange",
                icon: "📈",
              },
              {
                title: "Brand Design",
                desc: "Logo design and brand identity",
                color: "pink",
                icon: "🎨",
              },
              {
                title: "Consulting",
                desc: "Strategy and technical consulting",
                color: "indigo",
                icon: "💡",
              },
            ].map((service, index) => (
              <div
                key={index}
                className={`bg-${service.color}-50 border border-${service.color}-200 rounded-lg p-4 hover:shadow-md transition-shadow`}
              >
                <div className="text-2xl mb-2">{service.icon}</div>
                <h4 className={`font-semibold text-${service.color}-900 mb-2`}>
                  {service.title}
                </h4>
                <p className={`text-${service.color}-700 text-sm`}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "responsibilities",
      title: "User Responsibilities",
      icon: <Scale className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            As a user of our services, you agree to use them responsibly and in
            compliance with all applicable laws.
          </p>
          <div className="space-y-3">
            {[
              {
                title: "Provide Accurate Information",
                desc: "Ensure all information provided is truthful and up-to-date",
              },
              {
                title: "Maintain Account Security",
                desc: "Keep your login credentials secure and confidential",
              },
              {
                title: "Comply with Laws",
                desc: "Use our services in accordance with all applicable laws and regulations",
              },
              {
                title: "Respect Others",
                desc: "Do not engage in harmful, abusive, or malicious activities",
              },
              {
                title: "Protect Intellectual Property",
                desc: "Respect copyrights, trademarks, and other intellectual property rights",
              },
              {
                title: "Timely Payments",
                desc: "Pay all fees and charges according to agreed terms",
              },
            ].map((responsibility, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {responsibility.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{responsibility.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "payment",
      title: "Payment Terms",
      icon: <CreditCard className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-semibold text-green-900 mb-3 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Policy Overview
            </h4>
            <p className="text-green-800 leading-relaxed">
              We offer flexible payment terms designed to work with your
              business needs while ensuring fair compensation for our services.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-900 text-lg">
                Payment Terms
              </h5>
              {[
                "All prices quoted in USD unless specified",
                "Payment due within 30 days of invoice",
                "Late payments subject to 1.5% monthly fee",
                "Accepted methods: Credit card, ACH, wire transfer",
              ].map((term, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">{term}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-900 text-lg">
                Refund Policy
              </h5>
              {[
                "Refunds considered on case-by-case basis",
                "Work completed cannot be refunded",
                "Cancellation requires 30-day notice",
                "Deposits are non-refundable",
              ].map((policy, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">{policy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 mb-6">
              <Scale className="h-5 w-5" />
              <span className="text-sm font-medium">Legal Agreement</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl opacity-90 mb-6">
              Clear, fair terms that protect both you and us while we work
              together to build amazing digital experiences.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Last updated: January 2024</span>
              </div>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                Version 3.0
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Quick Summary */}
          <Card className="mb-12 shadow-lg border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
                <span>Terms Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-3xl mb-2">🤝</div>
                  <h4 className="font-semibold text-green-900 mb-2">
                    Fair Partnership
                  </h4>
                  <p className="text-green-700 text-sm">
                    We work together as partners to achieve your goals
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-3xl mb-2">💳</div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Clear Pricing
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Transparent pricing with no hidden fees or surprises
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-3xl mb-2">🛡️</div>
                  <h4 className="font-semibold text-purple-900 mb-2">
                    Protected Rights
                  </h4>
                  <p className="text-purple-700 text-sm">
                    Your rights and our responsibilities clearly defined
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <Card
                key={section.id}
                id={section.id}
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                      {section.icon}
                    </div>
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">{section.content}</CardContent>
              </Card>
            ))}

            {/* Additional Important Sections */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                  <CardTitle className="flex items-center space-x-3">
                    <Copyright className="h-5 w-5 text-orange-600" />
                    <span>Intellectual Property</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-900 mb-2">
                        Our Work
                      </h4>
                      <p className="text-orange-800 text-sm">
                        We retain rights to our methods and processes
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">
                        Your Project
                      </h4>
                      <p className="text-green-800 text-sm">
                        You own the final deliverables upon full payment
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
                  <CardTitle className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>Limitation of Liability</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {[
                      "Total liability limited to project value",
                      "No liability for indirect damages",
                      "Force majeure events excluded",
                      "Some limitations may not apply in your jurisdiction",
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Section */}
            <Card className="shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">
                    Questions About These Terms?
                  </h3>
                  <p className="text-blue-100 text-lg">
                    Our legal team is here to help clarify any questions you may
                    have.
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <Mail className="h-8 w-8 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Email Legal Team</h4>
                    <p className="text-blue-100">legal@webagency.com</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <Phone className="h-8 w-8 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Call Us</h4>
                    <p className="text-blue-100">+1 (555) 123-4567</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <MapPin className="h-8 w-8 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Legal Address</h4>
                    <p className="text-blue-100">
                      123 Business St, Suite 100
                      <br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
