import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, Search, ArrowRight, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Web Development: Trends to Watch in 2024",
      excerpt:
        "Explore the latest trends shaping the web development landscape, from AI integration to progressive web apps.",
      content: "Full article content here...",
      author: "Alex Johnson",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "Web Development",
      tags: ["React", "Next.js", "AI", "PWA"],
      image: "/blog1.jpg",
      featured: true,
    },
    {
      id: 2,
      title: "UI/UX Design Principles That Drive Conversions",
      excerpt:
        "Learn how to design user interfaces that not only look great but also convert visitors into customers.",
      content: "Full article content here...",
      author: "Sarah Chen",
      date: "2024-01-12",
      readTime: "6 min read",
      category: "Design",
      tags: ["UI/UX", "Conversion", "Design"],
      image: "/blog1.jpg",
      featured: false,
    },
    {
      id: 3,
      title: "Mobile-First Development: Best Practices and Tools",
      excerpt:
        "Discover the essential strategies and tools for building mobile-first applications that perform exceptionally.",
      content: "Full article content here...",
      author: "Mike Rodriguez",
      date: "2024-01-10",
      readTime: "10 min read",
      category: "Mobile Development",
      tags: ["Mobile", "React Native", "Performance"],
      image: "/blog1.jpg",
      featured: false,
    },
    {
      id: 4,
      title: "SEO Strategies That Actually Work in 2024",
      excerpt:
        "Cut through the noise and learn the SEO strategies that are delivering real results for businesses today.",
      content: "Full article content here...",
      author: "Emily Davis",
      date: "2024-01-08",
      readTime: "7 min read",
      category: "Digital Marketing",
      tags: ["SEO", "Marketing", "Analytics"],
      image: "/blog1.jpg",
      featured: false,
    },
    {
      id: 5,
      title: "Building Scalable E-commerce Platforms",
      excerpt:
        "Learn the architecture patterns and technologies needed to build e-commerce platforms that scale.",
      content: "Full article content here...",
      author: "David Kim",
      date: "2024-01-05",
      readTime: "12 min read",
      category: "E-commerce",
      tags: ["E-commerce", "Scalability", "Architecture"],
      image: "/blog1.jpg",
      featured: false,
    },
    {
      id: 6,
      title: "The Complete Guide to API Design and Development",
      excerpt:
        "Master the art of designing and building robust APIs that power modern web applications.",
      content: "Full article content here...",
      author: "Alex Johnson",
      date: "2024-01-03",
      readTime: "15 min read",
      category: "Backend Development",
      tags: ["API", "Backend", "Node.js"],
      image: "/blog1.jpg",
      featured: false,
    },
  ];

  const categories = [
    "All",
    "Web Development",
    "Design",
    "Mobile Development",
    "Digital Marketing",
    "E-commerce",
    "Backend Development",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="px-4 md:px-20">
          <div className="text-center space-y-8">
            <Badge className="bg-blue-100 text-blue-800">Our Blog</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Insights &
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Industry Knowledge
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Stay updated with the latest trends, best practices, and insights
              from the world of digital development and design.
            </p>

            {/* Search and Newsletter */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search articles..." className="pl-10" />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Subscribe to Newsletter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 border-b bg-white/50 backdrop-blur-sm sticky top-16 z-40">
        <div className=" px-4 md:px-20">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={
                  category === "All"
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

      {/* Featured Article */}
      <section className="py-20">
        <div className="px-4 md:px-20">
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8">Featured Article</h2>
            {blogPosts
              .filter((post) => post.featured)
              .map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl"
                >
                  <div className="grid gap-8 lg:grid-cols-2">
                    <div className="relative">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                        Featured
                      </Badge>
                    </div>
                    <CardContent className="p-8 flex flex-col justify-center">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <Badge variant="secondary">{post.category}</Badge>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(post.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold">{post.title}</h3>
                        <p className="text-gray-600">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {post.author}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            <Link
                              href={`/blog/${post.id}`}
                              className="flex items-center gap-1"
                            >
                              Read More
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-20">
        <div className="px-4 md:px-20">
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts
              .filter((post) => !post.featured)
              .map((post) => (
                <Card
                  key={post.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      width={600}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-white/90 text-gray-800">
                      {post.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-600 text-sm">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-600"
                        >
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {post.author}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Link href={`/blog/${post.id}`}>Read More</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
