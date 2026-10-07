"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Github,
  Chrome,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Globe,
  Fingerprint,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    console.log("Login attempt:", formData);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechStart",
      content: "Amazing platform that transformed our business!",
    },
    {
      name: "Mike Johnson",
      role: "Designer",
      content: "The best web agency experience I've ever had.",
    },
    {
      name: "Lisa Wang",
      role: "Marketing Director",
      content: "Professional, fast, and incredibly reliable.",
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-pink-400/40 rounded-full animate-bounce delay-1000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Enhanced Logo/Brand Section */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <BrandLogo
                  height={78}
                  className="transform transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-lg">
                Sign in to continue your digital journey
              </p>

              {/* Trust Badges */}
              <div className="flex items-center justify-center space-x-4 mt-4">
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Trusted by 10k+
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Bank-level Security
                </Badge>
              </div>
            </div>

            <Card className="shadow-2xl border-0 backdrop-blur-xl bg-white/90 hover:shadow-3xl transition-all duration-500">
              <CardHeader className="text-center space-y-3 pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Sign In
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Choose your preferred sign-in method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Enhanced Social Login Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-300 group relative overflow-hidden"
                    onClick={() => handleSocialLogin("google")}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Chrome className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform relative z-10" />
                    <span className="relative z-10">Continue with Google</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 transition-all duration-300 group relative overflow-hidden"
                    onClick={() => handleSocialLogin("github")}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Github className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform relative z-10" />
                    <span className="relative z-10">Continue with GitHub</span>
                  </Button>
                </div>

                <div className="relative">
                  <Separator />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white px-6 text-sm text-gray-500 font-medium">
                      or continue with email
                    </span>
                  </div>
                </div>

                {/* Enhanced Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 hover:border-gray-300"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-11 pr-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 hover:border-gray-300"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember"
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                        checked={formData.rememberMe}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rememberMe: e.target.checked,
                          })
                        }
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm text-gray-600"
                      >
                        Remember me for 30 days
                      </Label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        <span className="relative z-10">Signing In...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2 relative z-10" />
                        <span className="relative z-10">Sign In Securely</span>
                        <ArrowRight className="w-4 h-4 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors duration-200"
                  >
                    Create one now
                  </Link>
                </div>

                {/* Enhanced Trust Indicators */}
                <div className="flex items-center justify-center space-x-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>256-bit SSL</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span>Fast & Secure</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Fingerprint className="w-4 h-4 text-purple-500" />
                    <span>2FA Ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Features & Testimonials */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm">
          <div className="max-w-lg space-y-8">
            {/* Features Section */}
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Join Thousands of Happy Users
              </h2>
              <div className="grid gap-4">
                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">
                      Global Reach
                    </h3>
                    <p className="text-sm text-gray-600">
                      Serving clients worldwide with excellence
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Expert Team</h3>
                    <p className="text-sm text-gray-600">
                      Professional developers and designers
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">
                      5-Star Rating
                    </h3>
                    <p className="text-sm text-gray-600">
                      Consistently rated excellent by clients
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <div className="text-center space-y-4">
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 italic">
                  &quot;{testimonials[currentTestimonial].content}&quot;
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
