import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  Eye,
  Users,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "collection",
      title: "Information We Collect",
      icon: <Eye className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We collect information you provide directly to us, such as when you
            create an account, make a purchase, or contact us for support.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                Personal Information
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Name and contact details</li>
                <li>• Email address and phone number</li>
                <li>• Company information</li>
                <li>• Payment and billing information</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h4 className="font-semibold text-purple-900 mb-2">
                Usage Information
              </h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Website interaction data</li>
                <li>• Device and browser information</li>
                <li>• IP address and location</li>
                <li>• Cookies and tracking data</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "usage",
      title: "How We Use Your Information",
      icon: <Users className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We use your information to provide, maintain, and improve our
            services, as well as to communicate with you about our offerings.
          </p>
          <div className="grid gap-3">
            {[
              "Provide and maintain our services",
              "Process transactions and payments",
              "Send important notifications and updates",
              "Improve our products and user experience",
              "Provide customer support and assistance",
              "Comply with legal obligations",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "sharing",
      title: "Information Sharing",
      icon: <Shield className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">
                We Never Sell Your Data
              </span>
            </div>
            <p className="text-green-700 text-sm">
              Your personal information is never sold, traded, or rented to
              third parties for marketing purposes.
            </p>
          </div>
          <p className="text-gray-700 leading-relaxed">
            We only share your information in specific, limited circumstances:
          </p>
          <div className="space-y-3">
            {[
              {
                title: "With Your Consent",
                desc: "When you explicitly authorize us to share information",
              },
              {
                title: "Legal Compliance",
                desc: "To comply with applicable laws and regulations",
              },
              {
                title: "Service Providers",
                desc: "With trusted partners who help us operate our services",
              },
              {
                title: "Business Transfers",
                desc: "In connection with mergers, acquisitions, or asset sales",
              },
            ].map((item, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "security",
      title: "Data Security",
      icon: <Lock className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We implement industry-standard security measures to protect your
            personal information.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Encryption",
                desc: "End-to-end encryption for data transmission",
                color: "blue",
              },
              {
                title: "Access Controls",
                desc: "Strict authentication and authorization",
                color: "green",
              },
              {
                title: "Regular Audits",
                desc: "Continuous security assessments",
                color: "purple",
              },
              {
                title: "Secure Infrastructure",
                desc: "Protected servers and databases",
                color: "orange",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`bg-${item.color}-50 border border-${item.color}-200 rounded-lg p-4`}
              >
                <h4 className={`font-semibold text-${item.color}-900 mb-2`}>
                  {item.title}
                </h4>
                <p className={`text-${item.color}-700 text-sm`}>{item.desc}</p>
              </div>
            ))}
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
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Your Privacy Matters</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl opacity-90 mb-6">
              We&apos;re committed to protecting your privacy and being
              transparent about how we handle your data.
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
                Version 2.1
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Table of Contents */}
          <Card className="mb-12 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Table of Contents</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="text-blue-600 group-hover:text-purple-600 transition-colors">
                      {section.icon}
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900">
                      {section.title}
                    </span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <Card
                key={section.id}
                id={section.id}
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
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

            {/* Your Rights Section */}
            <Card className="shadow-lg border-2 border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white">
                    <Users className="h-5 w-5" />
                  </div>
                  <span>Your Rights & Controls</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Access & Update",
                      desc: "View and modify your personal information",
                      icon: "👤",
                    },
                    {
                      title: "Data Portability",
                      desc: "Download a copy of your data",
                      icon: "📦",
                    },
                    {
                      title: "Delete Account",
                      desc: "Request complete data deletion",
                      icon: "🗑️",
                    },
                    {
                      title: "Opt-Out",
                      desc: "Unsubscribe from marketing communications",
                      icon: "✉️",
                    },
                    {
                      title: "Restrict Processing",
                      desc: "Limit how we use your information",
                      icon: "⚙️",
                    },
                    {
                      title: "File Complaints",
                      desc: "Contact supervisory authorities",
                      icon: "📋",
                    },
                  ].map((right, index) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                    >
                      <div className="text-2xl mb-2">{right.icon}</div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {right.title}
                      </h4>
                      <p className="text-sm text-gray-600">{right.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">
                    Questions About Your Privacy?
                  </h3>
                  <p className="text-blue-100 text-lg">
                    We&apos;re here to help. Contact our privacy team for any
                    questions or concerns.
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <Mail className="h-8 w-8 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Email Us</h4>
                    <p className="text-blue-100">privacy@webagency.com</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <Phone className="h-8 w-8 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Call Us</h4>
                    <p className="text-blue-100">+1 (555) 123-4567</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <MapPin className="h-8 w-8 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Visit Us</h4>
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
