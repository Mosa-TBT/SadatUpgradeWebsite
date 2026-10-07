"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ExternalLink,
  Github,
  ArrowRight,
  Calendar,
  Users,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const projects = [
    {
      title: "TechStart E-commerce Platform",
      category: "E-commerce",
      description:
        "A modern e-commerce platform with advanced features including real-time inventory, multi-vendor support, and AI-powered recommendations.",
      fullDescription:
        "TechStart needed a complete overhaul of their existing e-commerce platform to handle their growing customer base and complex inventory management. We built a scalable solution using modern technologies that could handle high traffic loads while providing an exceptional user experience.",
      image: "/project1.webp",
      technologies: [
        "Next.js",
        "TypeScript",
        "Stripe",
        "MongoDB",
        "Redis",
        "AWS",
      ],
      results: [
        "150% increase in conversion rate",
        "40% faster page load times",
        "99.9% uptime",
        "500% increase in concurrent users",
      ],
      link: "#",
      github: "#",
      duration: "6 months",
      teamSize: "8 developers",
      clientName: "TechStart Inc.",
      challenges: [
        "Legacy system integration",
        "High traffic scalability",
        "Complex inventory management",
        "Multi-vendor payment processing",
      ],
      solutions: [
        "Microservices architecture implementation",
        "CDN and caching optimization",
        "Real-time inventory tracking system",
        "Automated payment splitting system",
      ],
      testimonial: {
        text: "The team delivered beyond our expectations. Our platform now handles 10x more traffic with better performance.",
        author: "Sarah Johnson",
        position: "CTO, TechStart Inc.",
      },
    },
    {
      title: "FinanceApp Mobile Banking",
      category: "Mobile App",
      description:
        "Secure mobile banking application with biometric authentication, real-time transactions, and comprehensive financial management tools.",
      fullDescription:
        "A comprehensive mobile banking solution that prioritizes security while delivering an intuitive user experience. The app includes advanced features like AI-powered spending insights and automated savings recommendations.",
      image: "/project2.webp",
      technologies: [
        "React Native",
        "Node.js",
        "PostgreSQL",
        "AWS",
        "Biometric SDK",
        "Encryption",
      ],
      results: [
        "500K+ downloads",
        "4.8 App Store rating",
        "Bank-grade security",
        "Zero security breaches",
      ],
      link: "#",
      github: "#",
      duration: "8 months",
      teamSize: "12 developers",
      clientName: "SecureBank",
      challenges: [
        "Bank-grade security requirements",
        "Cross-platform compatibility",
        "Real-time transaction processing",
        "Regulatory compliance",
      ],
      solutions: [
        "End-to-end encryption implementation",
        "Native module optimization",
        "WebSocket real-time architecture",
        "Automated compliance testing",
      ],
      testimonial: {
        text: "This app has revolutionized how our customers interact with their finances. The security and UX are outstanding.",
        author: "Michael Chen",
        position: "Head of Digital, SecureBank",
      },
    },
    {
      title: "HealthCare SaaS Dashboard",
      category: "Web Application",
      description:
        "Comprehensive healthcare management system with patient records, appointment scheduling, and telemedicine capabilities.",
      fullDescription:
        "A HIPAA-compliant healthcare management platform that streamlines operations for medical practices while ensuring patient data security and privacy.",
      image: "/project3.webp",
      technologies: [
        "React",
        "Python",
        "Django",
        "PostgreSQL",
        "WebRTC",
        "HIPAA Compliance",
      ],
      results: [
        "10,000+ patients managed",
        "30% efficiency improvement",
        "HIPAA compliant",
        "95% user satisfaction",
      ],
      link: "#",
      github: "#",
      duration: "10 months",
      teamSize: "15 developers",
      clientName: "MedCare Solutions",
      challenges: [
        "HIPAA compliance requirements",
        "Complex appointment scheduling",
        "Telemedicine integration",
        "Multi-role user management",
      ],
      solutions: [
        "HIPAA-compliant architecture design",
        "AI-powered scheduling optimization",
        "WebRTC video consultation system",
        "Role-based access control system",
      ],
      testimonial: {
        text: "Our practice efficiency has improved dramatically. The telemedicine feature was a game-changer during the pandemic.",
        author: "Dr. Emily Rodriguez",
        position: "Chief Medical Officer, MedCare Solutions",
      },
    },
    {
      title: "RestaurantPro Website & Ordering",
      category: "Web Development",
      description:
        "Beautiful restaurant website with online ordering system, table reservations, and integrated payment processing.",
      fullDescription:
        "A complete digital transformation for a restaurant chain, including a stunning website, online ordering system, and table reservation management.",
      image: "/project4.webp",
      technologies: [
        "Next.js",
        "Tailwind CSS",
        "Stripe",
        "Sanity CMS",
        "Twilio",
        "Google Maps API",
      ],
      results: [
        "200% increase in online orders",
        "50% reduction in phone orders",
        "Mobile-first design",
        "35% increase in reservations",
      ],
      link: "#",
      github: "#",
      duration: "4 months",
      teamSize: "6 developers",
      clientName: "Bella Vista Restaurants",
      challenges: [
        "Multi-location management",
        "Real-time order tracking",
        "Integration with POS systems",
        "Mobile optimization",
      ],
      solutions: [
        "Centralized multi-tenant architecture",
        "WebSocket order status updates",
        "Custom POS API integration",
        "Progressive Web App implementation",
      ],
      testimonial: {
        text: "Our online presence has completely transformed. Orders have doubled and customer satisfaction is at an all-time high.",
        author: "Marco Rossi",
        position: "Owner, Bella Vista Restaurants",
      },
    },
    {
      title: "FitTracker Mobile App",
      category: "Mobile App",
      description:
        "Comprehensive fitness tracking application with workout plans, nutrition tracking, and social features for motivation.",
      fullDescription:
        "A comprehensive fitness ecosystem that combines workout tracking, nutrition monitoring, and social features to create an engaging fitness experience.",
      image: "/project5.webp",
      technologies: [
        "Flutter",
        "Firebase",
        "Google Fit API",
        "Apple HealthKit",
        "ML Kit",
        "Cloud Functions",
      ],
      results: [
        "1M+ workouts tracked",
        "4.7 user rating",
        "Featured by Apple",
        "85% user retention",
      ],
      link: "#",
      github: "#",
      duration: "7 months",
      teamSize: "10 developers",
      clientName: "FitLife Technologies",
      challenges: [
        "Cross-platform health data sync",
        "Real-time workout tracking",
        "Social features implementation",
        "Offline functionality",
      ],
      solutions: [
        "Universal health data adapter",
        "Background processing optimization",
        "Real-time social feed system",
        "Local data synchronization",
      ],
      testimonial: {
        text: "The app has exceeded all our expectations. User engagement is through the roof and retention rates are incredible.",
        author: "Jessica Park",
        position: "Product Manager, FitLife Technologies",
      },
    },
    {
      title: "Corporate Rebrand & Website",
      category: "Branding & Web",
      description:
        "Complete brand identity transformation with new logo, website, and marketing materials for a growing tech company.",
      fullDescription:
        "A complete digital transformation including brand identity, website redesign, and marketing automation system for a rapidly growing technology company.",
      image: "/project6.webp",
      technologies: [
        "Next.js",
        "Framer Motion",
        "Contentful",
        "Vercel",
        "Adobe Creative Suite",
        "HubSpot",
      ],
      results: [
        "300% increase in leads",
        "Award-winning design",
        "Brand recognition up 250%",
        "50% increase in conversion",
      ],
      link: "#",
      github: "#",
      duration: "5 months",
      teamSize: "8 designers & developers",
      clientName: "InnovateTech Corp",
      challenges: [
        "Brand consistency across platforms",
        "Complex animation requirements",
        "Content management scalability",
        "SEO optimization",
      ],
      solutions: [
        "Comprehensive brand guideline system",
        "Custom animation library",
        "Headless CMS implementation",
        "Technical SEO optimization",
      ],
      testimonial: {
        text: "Our new brand identity has transformed how clients perceive us. The website is absolutely stunning and performs incredibly well.",
        author: "David Kim",
        position: "CEO, InnovateTech Corp",
      },
    },
    {
      title: "EduPlatform Learning Management",
      category: "Web Application",
      description:
        "Advanced learning management system with video streaming, interactive quizzes, and progress tracking for online education.",
      fullDescription:
        "A comprehensive learning management system designed for modern online education with advanced features for both educators and students.",
      image: "/project7.png",
      technologies: [
        "React",
        "Node.js",
        "MongoDB",
        "AWS S3",
        "WebRTC",
        "Socket.io",
      ],
      results: [
        "50,000+ students enrolled",
        "95% course completion rate",
        "Multi-language support",
        "99.5% uptime",
      ],
      link: "#",
      github: "#",
      duration: "9 months",
      teamSize: "14 developers",
      clientName: "EduTech Solutions",
      challenges: [
        "Video streaming optimization",
        "Real-time collaboration features",
        "Multi-language support",
        "Scalable assessment system",
      ],
      solutions: [
        "CDN-optimized video delivery",
        "WebRTC collaboration tools",
        "Internationalization framework",
        "AI-powered assessment engine",
      ],
      testimonial: {
        text: "The platform has revolutionized our online education delivery. Student engagement and completion rates have never been higher.",
        author: "Prof. Amanda Wilson",
        position: "Director of Online Learning, EduTech Solutions",
      },
    },
    {
      title: "RealEstate Property Portal",
      category: "Web Development",
      description:
        "Modern property listing platform with advanced search, virtual tours, and integrated CRM for real estate professionals.",
      fullDescription:
        "A comprehensive real estate platform that connects buyers, sellers, and agents with advanced search capabilities and virtual tour technology.",
      image: "/project8.webp",
      technologies: [
        "Next.js",
        "TypeScript",
        "Prisma",
        "PostgreSQL",
        "Mapbox",
        "Three.js",
      ],
      results: [
        "10,000+ properties listed",
        "60% faster search results",
        "Mobile responsive",
        "40% increase in inquiries",
      ],
      link: "#",
      github: "#",
      duration: "6 months",
      teamSize: "9 developers",
      clientName: "PropertyMax Realty",
      challenges: [
        "Complex property search filters",
        "Virtual tour implementation",
        "Real-time data synchronization",
        "Mobile performance optimization",
      ],
      solutions: [
        "Elasticsearch integration",
        "WebGL virtual tour system",
        "Real-time database updates",
        "Progressive image loading",
      ],
      testimonial: {
        text: "Our agents are closing deals faster than ever. The virtual tours and search functionality are game-changers.",
        author: "Robert Martinez",
        position: "Broker, PropertyMax Realty",
      },
    },
    {
      title: "EventManager Mobile App",
      category: "Mobile App",
      description:
        "Event management application with ticket sales, attendee check-in, and real-time event updates and networking features.",
      fullDescription:
        "A comprehensive event management solution that handles everything from ticket sales to attendee networking and real-time event coordination.",
      image: "/project9.webp",
      technologies: [
        "React Native",
        "Firebase",
        "Stripe",
        "Push Notifications",
        "QR Code",
        "WebSocket",
      ],
      results: [
        "100+ events managed",
        "50,000+ tickets sold",
        "Real-time updates",
        "4.6 user rating",
      ],
      link: "#",
      github: "#",
      duration: "5 months",
      teamSize: "7 developers",
      clientName: "EventPro Management",
      challenges: [
        "Real-time event coordination",
        "Offline ticket validation",
        "Scalable notification system",
        "Cross-platform compatibility",
      ],
      solutions: [
        "WebSocket real-time architecture",
        "Local QR code validation",
        "Smart notification batching",
        "Native module optimization",
      ],
      testimonial: {
        text: "Managing events has never been easier. The app handles everything seamlessly and our attendees love the networking features.",
        author: "Lisa Thompson",
        position: "Event Director, EventPro Management",
      },
    },
  ];

  const categories = [
    "All",
    "Web Development",
    "Mobile App",
    "E-commerce",
    "Web Application",
    "Branding & Web",
  ];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="px-4 md:px-20">
          <div className="text-center space-y-8">
            <Badge className="bg-blue-100 text-blue-800">Our Portfolio</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Our
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Latest Work{" "}
              </span>
              & Success Stories
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Explore our portfolio of successful projects and see how
              we&apos;ve helped businesses across various industries achieve
              their digital goals.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 border-b bg-white/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="px-4 md:px-20">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === activeCategory ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className={
                  category === activeCategory
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "border-gray-300 hover:bg-gray-50"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 lg:py-32">
        <div className="px-4 md:px-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <Card
                key={index}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      className="bg-white/90 text-gray-900 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.link, "_blank");
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-white/90 text-gray-900 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.github, "_blank");
                      }}
                    >
                      <Github className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                    {project.category}
                  </Badge>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                        Technologies:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 4).map((tech, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-700"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 4 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-700"
                          >
                            +{project.technologies.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                        Key Results:
                      </h4>
                      <ul className="space-y-1">
                        {project.results.slice(0, 3).map((result, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-gray-600 flex items-center"
                          >
                            <div className="w-1 h-1 bg-blue-500 rounded-full mr-2" />
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-300 hover:bg-gray-50 group-hover:border-blue-600 group-hover:text-blue-600"
                  >
                    View Details
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-slate-100 text-slate-800">Our Impact</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Numbers That Matter
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "500+",
                label: "Projects Completed",
                description:
                  "Successfully delivered projects across various industries",
              },
              {
                number: "98%",
                label: "Client Satisfaction",
                description:
                  "Consistently high client satisfaction and retention rate",
              },
              {
                number: "2M+",
                label: "Users Reached",
                description:
                  "Combined user base across all our client projects",
              },
              {
                number: "150%",
                label: "Average ROI",
                description: "Average return on investment for our clients",
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className="text-center border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-blue-600">
                      {stat.number}
                    </div>
                    <h3 className="text-lg font-semibold">{stat.label}</h3>
                    <p className="text-sm text-gray-600">{stat.description}</p>
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
              Ready to Create Your Success Story?
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Let&apos;s discuss your project and see how we can help you
              achieve similar results for your business.
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
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-blue-600"
              >
                Download Portfolio PDF
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details Modal */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={() => setSelectedProject(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {selectedProject.category}
                    </Badge>
                    <DialogTitle className="text-2xl font-bold">
                      {selectedProject.title}
                    </DialogTitle>
                    <p className="text-gray-600">
                      {selectedProject.fullDescription}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              {/* Project Image */}
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={selectedProject.image || "/placeholder.svg"}
                  alt={selectedProject.title}
                  width={800}
                  height={400}
                  className="w-full h-64 object-cover"
                />
              </div>

              {/* Project Info Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Duration: {selectedProject.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Team: {selectedProject.teamSize}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Trophy className="h-4 w-4 mr-2" />
                    Client: {selectedProject.clientName}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.technologies.map((tech, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Key Results:</h4>
                  <ul className="space-y-1">
                    {selectedProject.results.map((result, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-600 flex items-center"
                      >
                        <div className="w-1 h-1 bg-blue-500 rounded-full mr-2" />
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Challenges & Solutions */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Challenges</h4>
                  <ul className="space-y-2">
                    {selectedProject.challenges.map((challenge, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-600 flex items-start"
                      >
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Solutions</h4>
                  <ul className="space-y-2">
                    {selectedProject.solutions.map((solution, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-600 flex items-start"
                      >
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                        {solution}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Client Testimonial */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">
                  Client Testimonial
                </h4>
                <blockquote className="text-gray-700 italic mb-4">
                  &quot;{selectedProject.testimonial.text}&quot;
                </blockquote>
                <div className="text-sm">
                  <div className="font-semibold">
                    {selectedProject.testimonial.author}
                  </div>
                  <div className="text-gray-600">
                    {selectedProject.testimonial.position}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.open(selectedProject.link, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live Project
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(selectedProject.github, "_blank")}
                >
                  <Github className="h-4 w-4 mr-2" />
                  View Source Code
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">
                    Start Similar Project
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
