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
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  Clock,
  Shield,
  RefreshCw,
  Lock,
  Zap,
  Globe,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleResend = () => {
    setIsSubmitted(false);
    setEmail("");
  };

  if (!mounted) return null;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-4 h-4 bg-green-400/40 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-40 right-32 w-3 h-3 bg-blue-400/40 rounded-full animate-bounce delay-700"></div>
          <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-purple-400/40 rounded-full animate-bounce delay-1000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <Card className="shadow-2xl border-0 backdrop-blur-xl bg-white/90 hover:shadow-3xl transition-all duration-500">
              <CardHeader className="text-center space-y-6 pb-6">
                <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
                    Check Your Email
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    We&apos;ve sent a password reset link to
                  </CardDescription>
                  <div className="mt-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                    <span className="font-semibold text-blue-800">{email}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 via-green-50 to-blue-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-start space-x-4">
                    <Clock className="w-6 h-6 text-blue-600 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold mb-2 text-gray-900">
                        What happens next?
                      </p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Check your email inbox (and spam folder)</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Click the reset link within 15 minutes</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Create your new secure password</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600 font-medium">
                    Didn&apos;t receive the email?
                  </p>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={handleResend}
                      className="w-full h-12 border-blue-200 text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:border-blue-300 transition-all duration-300 group"
                    >
                      <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                      Send Another Email
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full h-12 border-gray-200 hover:bg-gray-50 transition-all duration-300 group"
                    >
                      <Link href="/contact">
                        <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Contact Support
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="text-center pt-6 border-t border-gray-100">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors duration-200 group"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to login
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure Process</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span>Fast Recovery</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

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
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-3xl mb-6 shadow-2xl">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Secure Password Recovery
              </h2>
              <p className="text-lg text-gray-600">
                We&apos;ll help you regain access to your account safely
              </p>
            </div>

            {/* Security Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">
                    Bank-Level Security
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your data is protected with enterprise-grade encryption
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">
                    Quick Recovery
                  </h3>
                  <p className="text-sm text-gray-600">
                    Reset your password in under 2 minutes
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                  <p className="text-sm text-gray-600">
                    Our team is here to help anytime you need
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Reset Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Enhanced Logo/Brand Section */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6 lg:hidden">
                <BrandLogo height={78} />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600 text-lg">
                We&apos;ll help you get back into your account
              </p>

              {/* Trust Badge */}
              <div className="flex items-center justify-center mt-4">
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Secure & Fast Recovery
                </Badge>
              </div>
            </div>

            <Card className="shadow-2xl border-0 backdrop-blur-xl bg-white/90 hover:shadow-3xl transition-all duration-500">
              <CardHeader className="text-center space-y-3 pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Forgot Password?
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  No worries! Enter your email and we&apos;ll send you a reset
                  link
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold text-gray-900">
                        Secure Password Reset
                      </p>
                      <p className="text-gray-600">
                        We&apos;ll send a secure link that expires in 15 minutes
                      </p>
                    </div>
                  </div>
                </div>

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
                        placeholder="Enter your email address"
                        className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 hover:border-gray-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Enter the email address associated with your account
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Sending Reset Link...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5 mr-2" />
                        Send Reset Link
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center space-y-4">
                  <div className="text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                    >
                      Sign in instead
                    </Link>
                  </div>

                  <div className="text-center pt-4 border-t border-gray-100">
                    <Link
                      href="/login"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back to login
                    </Link>
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
