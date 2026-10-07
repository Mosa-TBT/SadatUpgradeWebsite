import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Heart,
  Zap,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CareersPage() {
  const jobOpenings = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "New York, NY / Remote",
      type: "Full-time",
      salary: "$120,000 - $160,000",
      description:
        "We're looking for an experienced full stack developer to join our growing team and help build amazing web applications.",
      requirements: [
        "5+ years of experience with React and Node.js",
        "Experience with TypeScript and Next.js",
        "Strong understanding of database design",
        "Experience with cloud platforms (AWS, Vercel)",
        "Excellent communication skills",
      ],
      posted: "2024-01-15",
    },
    {
      id: 2,
      title: "UI/UX Designer",
      department: "Design",
      location: "New York, NY / Remote",
      type: "Full-time",
      salary: "$90,000 - $120,000",
      description:
        "Join our design team to create beautiful, user-centered designs that drive business results.",
      requirements: [
        "3+ years of UI/UX design experience",
        "Proficiency in Figma and Adobe Creative Suite",
        "Strong portfolio demonstrating design thinking",
        "Experience with user research and testing",
        "Understanding of web development constraints",
      ],
      posted: "2024-01-12",
    },
    {
      id: 3,
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "New York, NY / Hybrid",
      type: "Full-time",
      salary: "$70,000 - $90,000",
      description:
        "Help our clients achieve their marketing goals through strategic digital marketing campaigns.",
      requirements: [
        "3+ years of digital marketing experience",
        "Google Ads and Facebook Ads certification",
        "Experience with SEO and content marketing",
        "Analytics and reporting skills",
        "Creative problem-solving abilities",
      ],
      posted: "2024-01-10",
    },
    {
      id: 4,
      title: "Project Manager",
      department: "Operations",
      location: "New York, NY / Hybrid",
      type: "Full-time",
      salary: "$80,000 - $100,000",
      description:
        "Lead client projects from conception to completion, ensuring quality delivery and client satisfaction.",
      requirements: [
        "PMP or Agile certification preferred",
        "3+ years of project management experience",
        "Experience with digital projects",
        "Excellent communication and leadership skills",
        "Proficiency in project management tools",
      ],
      posted: "2024-01-08",
    },
    {
      id: 5,
      title: "Mobile Developer (React Native)",
      department: "Engineering",
      location: "Remote",
      type: "Contract",
      salary: "$80 - $120 per hour",
      description:
        "Build cross-platform mobile applications using React Native for our diverse client base.",
      requirements: [
        "4+ years of React Native experience",
        "Published apps on App Store and Google Play",
        "Experience with native iOS/Android development",
        "Understanding of mobile UI/UX principles",
        "Strong debugging and optimization skills",
      ],
      posted: "2024-01-05",
    },
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description:
        "Comprehensive health insurance, dental, vision, and wellness programs",
    },
    {
      icon: Zap,
      title: "Professional Growth",
      description:
        "Learning budget, conference attendance, and career development opportunities",
    },
    {
      icon: Users,
      title: "Work-Life Balance",
      description:
        "Flexible hours, remote work options, and unlimited PTO policy",
    },
    {
      icon: DollarSign,
      title: "Competitive Compensation",
      description:
        "Competitive salaries, equity options, and performance bonuses",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="px-4 md:px-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-800">
                  Join Our Team
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Build Your
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {" "}
                    Dream Career{" "}
                  </span>
                  With Us
                </h1>
                <p className="text-xl text-gray-600">
                  Join a team of passionate professionals who are shaping the
                  future of digital experiences. We&apos;re always looking for
                  talented individuals to join our growing family.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  View Open Positions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Learn About Culture
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/career.jpg"
                alt="Team at work"
                width={600}
                height={500}
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="px-4 md:px-20">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-purple-100 text-purple-800">
              Why Work With Us
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Amazing Benefits & Perks
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in taking care of our team members so they can do their
              best work.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="text-center border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className=" px-4 md:px-20">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-slate-100 text-slate-800">
              Open Positions
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Current Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our current job openings and find the perfect role for
              your skills and career goals.
            </p>
          </div>
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <Card
                key={job.id}
                className="border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-8">
                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-bold">{job.title}</h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          {job.department}
                        </Badge>
                        <Badge variant="secondary">{job.type}</Badge>
                      </div>
                      <p className="text-gray-600">{job.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            Posted {new Date(job.posted).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Key Requirements:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {job.requirements.slice(0, 3).map((req, idx) => (
                            <li
                              key={idx}
                              className="flex items-start space-x-2"
                            >
                              <div className="w-1 h-1 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center space-y-4">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Link
                          href={`/careers/${job.id}`}
                          className="flex items-center"
                        >
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-20">
        <div className="px-4 md:px-20">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-orange-100 text-orange-800">Our Culture</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Life at Sadat Upgrade
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Innovation First",
                description:
                  "We encourage creative thinking and aren't afraid to try new approaches to solve problems.",
                image: "/culture1.webp",
              },
              {
                title: "Collaborative Environment",
                description:
                  "We believe the best work happens when talented people work together toward common goals.",
                image: "/culture2.jpg",
              },
              {
                title: "Continuous Learning",
                description:
                  "We invest in our team's growth through training, conferences, and learning opportunities.",
                image: "/culture3.jpg",
              },
              {
                title: "Work-Life Balance",
                description:
                  "We understand that great work comes from people who are happy and fulfilled in all areas of life.",
                image: "/culture4.jpg",
              },
              {
                title: "Client Success Focus",
                description:
                  "Everything we do is focused on delivering exceptional results for our clients.",
                image: "/culture5.jpg",
              },
              {
                title: "Fun & Celebration",
                description:
                  "We celebrate wins, learn from challenges, and make sure to have fun along the way.",
                image: "/culture6.png",
              },
            ].map((culture, index) => (
              <Card
                key={index}
                className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm"
              >
                <div className="relative">
                  <Image
                    src={culture.image || "/placeholder.svg"}
                    alt={culture.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {culture.title}
                  </h3>
                  <p className="text-gray-600">{culture.description}</p>
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
              Don&apos;t See the Perfect Role?
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              We&apos;re always interested in meeting talented individuals. Send
              us your resume and let&apos;s start a conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Send Your Resume
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white bg-blue-600 hover:text-blue-600"
              >
                <Link href="/contact">Contact HR Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
