"use client";

import React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { useSearchParams } from "next/navigation";
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  X,
  Check,
  Shield,
  Zap,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

const ResetPasswordInner = () => {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simulate token validation
    if (!token) {
      setIsTokenValid(false);
    }
  }, [token]);

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "One number", met: /[0-9]/.test(formData.password) },
    {
      text: "One special character",
      met: /[^A-Za-z0-9]/.test(formData.password),
    },
  ];

  const passwordStrength = getPasswordStrength(formData.password);
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
    if (passwordStrength < 50) {
      alert("Please choose a stronger password");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSuccess(true);
  };

  if (!mounted) return null;

  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-100 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-red-400/30 to-orange-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-orange-400/30 to-red-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md shadow-2xl border-0 backdrop-blur-xl bg-white/90">
            <CardHeader className="text-center space-y-6 pb-6">
              <div className="mx-auto w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
                  Invalid Reset Link
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  This password reset link is invalid or has expired
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-5 border border-red-100">
                <p className="text-sm text-gray-700 text-center">
                  Password reset links expire after 15 minutes for security
                  reasons. Please request a new reset link to continue.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Link href="/forgot-password">
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Request New Reset Link
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full h-12">
                  <Link href="/login">Back to Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-400/30 to-green-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md shadow-2xl border-0 backdrop-blur-xl bg-white/90">
            <CardHeader className="text-center space-y-6 pb-6">
              <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
                  Password Reset Successful!
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Your password has been successfully updated
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">
                      You&apos;re all set!
                    </p>
                    <p className="text-gray-600">
                      You can now sign in with your new password
                    </p>
                  </div>
                </div>
              </div>

              <Button
                asChild
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/login">
                  <Shield className="w-5 h-5 mr-2" />
                  Sign In Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
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
        {/* Left Side - Security Features */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm">
          <div className="max-w-lg space-y-8">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-3xl mb-6 shadow-2xl">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Create a Strong Password
              </h2>
              <p className="text-lg text-gray-600">
                Secure your account with a new password
              </p>
            </div>

            {/* Password Tips */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Password Requirements:
              </h3>
              <div className="grid gap-3">
                <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    At least 8 characters long
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Include uppercase letters
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Include numbers</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Include special characters
                  </span>
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
                Create New Password
              </h1>
              <p className="text-gray-600 text-lg">
                Choose a strong password to secure your account
              </p>

              {/* Trust Badge */}
              <div className="flex items-center justify-center mt-4">
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Secure Password Reset
                </Badge>
              </div>
            </div>

            <Card className="shadow-2xl border-0 backdrop-blur-xl bg-white/90 hover:shadow-3xl transition-all duration-500">
              <CardHeader className="text-center space-y-3 pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Set New Password
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Your new password must be different from your previous
                  password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold text-gray-900">
                        Password Security
                      </p>
                      <p className="text-gray-600">
                        Create a strong password to protect your account
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700"
                    >
                      New Password
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
                      <div className="space-y-3 mt-3">
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
                        <Progress
                          value={passwordStrength}
                          className="h-2 text-blue-600"
                        />

                        <div className="space-y-2">
                          {passwordRequirements.map((req, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-xs"
                            >
                              {req.met ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <X className="w-4 h-4 text-gray-400" />
                              )}
                              <span
                                className={
                                  req.met ? "text-green-600" : "text-gray-500"
                                }
                              >
                                {req.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
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

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                    disabled={
                      isLoading ||
                      formData.password !== formData.confirmPassword ||
                      passwordStrength < 50
                    }
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin relative z-10" />
                        <span className="relative z-10">
                          Updating Password...
                        </span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2 relative z-10" />
                        <span className="relative z-10">Update Password</span>
                        <ArrowRight className="w-4 h-4 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Enhanced Trust Indicators */}
                <div className="flex items-center justify-center space-x-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Encrypted</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span>Instant Update</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Lock className="w-4 h-4 text-purple-500" />
                    <span>Secure</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordInner;
