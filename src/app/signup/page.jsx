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
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Github,
  Chrome,
  Building,
  Shield,
  Check,
  X,
  Gift,
  Users,
  Zap,
  ArrowRight,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const getStrengthColor = (strength) => {
    if (strength < 25) return "bg-red-500";
    if (strength < 50) return "bg-orange-500";
    if (strength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength) => {
    if (strength < 25) return "Weak";
    if (strength < 50) return "Fair";
    if (strength < 75) return "Good";
    return "Strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);

    console.log("Signup attempt:", formData);
  };

  const handleSocialSignup = (provider) => {
    console.log(`Signup with ${provider}`);
  };

  const benefits = [
    { icon: Gift, text: "Free consultation", color: "text-blue-600" },
    { icon: Clock, text: "24/7 support", color: "text-green-600" },
    { icon: TrendingUp, text: "Project tracking", color: "text-purple-600" },
    { icon: Award, text: "Expert team", color: "text-orange-600" },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-gradient-to-r from-green-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse delay-700"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-pink-400/40 rounded-full animate-bounce delay-1000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Features */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm">
          <div className="max-w-lg space-y-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-6">
                <BrandLogo height={86} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Start Your Journey Today
              </h2>
              <p className="text-lg text-gray-600">
                Join thousands of successful businesses
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl font-bold text-blue-600">10k+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl font-bold text-purple-600">500+</div>
                <div className="text-sm text-gray-600">Projects</div>
              </div>
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl font-bold text-orange-600">4.9★</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                What you get:
              </h3>
              <div className="grid gap-3">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20"
                  >
                    <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
                    <span className="text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-lg">
            {/* Enhanced Logo/Brand Section */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6 lg:hidden">
                <BrandLogo height={78} />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
                Join Our Community
              </h1>
              <p className="text-gray-600 text-lg">
                Create your account and start building amazing things
              </p>

              {/* Trust Badges */}
              <div className="flex items-center justify-center space-x-4 mt-4 flex-wrap">
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Free Forever
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Secure Setup
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Instant Access
                </Badge>
              </div>
            </div>

            <Card className="shadow-2xl border-0 backdrop-blur-xl bg-white/90 hover:shadow-3xl transition-all duration-500">
              <CardHeader className="text-center space-y-3 pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Create Account
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Get started with your free account today
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Enhanced Benefits Banner */}
                <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Free Account Includes:
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 flex-wrap">
                        {benefits.slice(0, 3).map((benefit, index) => (
                          <span key={index} className="flex items-center">
                            <Check className="w-4 h-4 text-green-500 mr-1" />
                            {benefit.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Social Signup Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-300 group relative overflow-hidden"
                    onClick={() => handleSocialSignup("google")}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Chrome className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform relative z-10" />
                    <span className="relative z-10">Sign up with Google</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 transition-all duration-300 group relative overflow-hidden"
                    onClick={() => handleSocialSignup("github")}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Github className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform relative z-10" />
                    <span className="relative z-10">Sign up with GitHub</span>
                  </Button>
                </div>

                <div className="relative">
                  <Separator />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white px-6 text-sm text-gray-500 font-medium">
                      or create with email
                    </span>
                  </div>
                </div>

                {/* Enhanced Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-semibold text-gray-700"
                      >
                        First Name
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 hover:border-gray-300"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 hover:border-gray-300"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

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
                        placeholder="john@example.com"
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
                      htmlFor="company"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Company (Optional)
                    </Label>
                    <div className="relative group">
                      <Building className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                      <Input
                        id="company"
                        type="text"
                        placeholder="Your company name"
                        className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 hover:border-gray-300"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
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
                        placeholder="Create a strong password"
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
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            Password strength:
                          </span>
                          <span
                            className={`font-medium ${
                              passwordStrength >= 75
                                ? "text-green-600"
                                : passwordStrength >= 50
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {getStrengthText(passwordStrength)}
                          </span>
                        </div>
                        <Progress value={passwordStrength} className="h-2" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-11 pr-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 hover:border-gray-300"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {formData.confirmPassword && (
                      <div className="flex items-center space-x-2 text-xs">
                        {formData.password === formData.confirmPassword ? (
                          <>
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-green-600">
                              Passwords match
                            </span>
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 text-red-500" />
                            <span className="text-red-600">
                              Passwords don&apos;t match
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, agreeToTerms: checked })
                        }
                        className="mt-1"
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm text-gray-600 leading-relaxed"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="newsletter"
                        checked={formData.subscribeNewsletter}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            subscribeNewsletter: checked,
                          })
                        }
                        className="mt-1"
                      />
                      <Label
                        htmlFor="newsletter"
                        className="text-sm text-gray-600 leading-relaxed"
                      >
                        Subscribe to our newsletter for updates, tips, and
                        exclusive offers
                      </Label>
                    </div>
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
                        <span className="relative z-10">
                          Creating Account...
                        </span>
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5 mr-2 relative z-10" />
                        <span className="relative z-10">Create My Account</span>
                        <ArrowRight className="w-4 h-4 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors duration-200"
                  >
                    Sign in here
                  </Link>
                </div>

                {/* Enhanced Trust Indicators */}
                <div className="flex items-center justify-center space-x-6 pt-6 border-t border-gray-100 flex-wrap">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure & Private</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span>Instant Setup</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span>Join 10k+ Users</span>
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
