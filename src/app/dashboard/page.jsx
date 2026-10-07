"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Settings,
  Bell,
  FileText,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Edit,
  Eye,
  ArrowRight,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  FolderOpen,
  PieChart,
  ChevronRight,
  Clock,
  Target,
  Award,
  Briefcase,
  UserPlus,
  FileBarChart,
  MessageSquare,
  Star,
} from "lucide-react";

export default function DashboardPage() {
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    company: "TechCorp Inc.",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "January 2024",
    plan: "Professional",
  });

  const recentProjects = [
    {
      id: 1,
      name: "E-commerce Platform",
      status: "In Progress",
      progress: 75,
      dueDate: "2024-02-15",
      type: "Web Development",
      priority: "High",
    },
    {
      id: 2,
      name: "Mobile App Design",
      status: "Completed",
      progress: 100,
      dueDate: "2024-01-30",
      type: "UI/UX Design",
      priority: "Medium",
    },
    {
      id: 3,
      name: "Brand Identity",
      status: "Review",
      progress: 90,
      dueDate: "2024-02-20",
      type: "Branding",
      priority: "Low",
    },
  ];

  const quickStats = [
    {
      title: "Active Projects",
      value: "8",
      change: "+2 from last month",
      icon: FolderOpen,
      color: "blue",
      trend: "up",
    },
    {
      title: "Total Revenue",
      value: "$24,500",
      change: "+15% from last month",
      icon: DollarSign,
      color: "green",
      trend: "up",
    },
    {
      title: "Active Clients",
      value: "12",
      change: "+3 new this month",
      icon: Users,
      color: "purple",
      trend: "up",
    },
    {
      title: "Team Members",
      value: "6",
      change: "+1 new hire",
      icon: Award,
      color: "orange",
      trend: "up",
    },
  ];

  const dashboardPages = [
    {
      title: "Projects",
      description: "Manage all your projects and track progress",
      href: "/dashboard/projects",
      icon: FolderOpen,
      color: "blue",
      stats: "8 active projects",
    },
    {
      title: "Clients",
      description: "Manage client relationships and communications",
      href: "/dashboard/clients",
      icon: Users,
      color: "purple",
      stats: "12 active clients",
    },
    {
      title: "Team",
      description: "Manage team members and track performance",
      href: "/dashboard/team",
      icon: Award,
      color: "orange",
      stats: "6 team members",
    },
    {
      title: "Analytics",
      description: "View detailed analytics and performance metrics",
      href: "/dashboard/analytics",
      icon: PieChart,
      color: "green",
      stats: "$24.5K revenue",
    },
    {
      title: "Reports",
      description: "Generate comprehensive business reports",
      href: "/dashboard/reports",
      icon: FileBarChart,
      color: "red",
      stats: "15 reports generated",
    },
    {
      title: "Settings",
      description: "Manage your account and preferences",
      href: "/dashboard/settings",
      icon: Settings,
      color: "gray",
      stats: "Profile 90% complete",
    },
  ];

  const recentActivity = [
    {
      action: "Project milestone completed",
      description: "E-commerce Platform - Phase 2 completed",
      time: "2 hours ago",
      type: "success",
    },
    {
      action: "New client onboarded",
      description: "TechStart Inc. joined as a new client",
      time: "4 hours ago",
      type: "client",
    },
    {
      action: "Team member added",
      description: "Sarah Johnson joined as UI/UX Designer",
      time: "1 day ago",
      type: "team",
    },
    {
      action: "Payment received",
      description: "Invoice INV-001 has been paid ($2,500)",
      time: "1 day ago",
      type: "payment",
    },
    {
      action: "Report generated",
      description: "Monthly performance report created",
      time: "2 days ago",
      type: "report",
    },
    {
      action: "Meeting scheduled",
      description: "Project review meeting on Feb 12",
      time: "3 days ago",
      type: "meeting",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-600";
      case "payment":
        return "bg-blue-100 text-blue-600";
      case "client":
        return "bg-purple-100 text-purple-600";
      case "team":
        return "bg-orange-100 text-orange-600";
      case "report":
        return "bg-red-100 text-red-600";
      case "meeting":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user.name}! Here&apos;s what&apos;s happening with
              your projects.
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline">
              <Bell className="w-4 h-4" />
              Notifications
            </Button>
            <Link href="/dashboard/settings">
              <Button variant="outline">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardPages.map((page, index) => (
            <Link key={index} href={page.href}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-${page.color}-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <page.icon className={`w-6 h-6 text-${page.color}-600`} />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {page.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {page.description}
                  </p>
                  <p className="text-sm font-medium text-blue-600">
                    {page.stats}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-blue-100 text-sm">Project Completion</p>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-blue-100 text-xs">+5% this month</p>
                </div>
                <Target className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-green-100 text-sm">Client Satisfaction</p>
                  <p className="text-2xl font-bold">4.8/5</p>
                  <p className="text-green-100 text-xs">+0.2 this month</p>
                </div>
                <Star className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-purple-100 text-sm">Team Utilization</p>
                  <p className="text-2xl font-bold">92%</p>
                  <p className="text-purple-100 text-xs">+3% this month</p>
                </div>
                <Clock className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-orange-100 text-sm">Revenue Growth</p>
                  <p className="text-2xl font-bold">+15%</p>
                  <p className="text-orange-100 text-xs">vs last month</p>
                </div>
                <Briefcase className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>
                    Your latest project updates and progress
                  </CardDescription>
                </div>
                <Link href="/dashboard/projects">
                  <Button variant="outline">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {project.name}
                          </h3>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={getPriorityColor(project.priority)}
                          >
                            {project.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {project.type}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <span>Due: {project.dueDate}</span>
                          <span>{project.progress}% Complete</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <Link href={`/dashboard/projects`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.plan} Plan</p>
                    <p className="text-xs text-gray-500">
                      Member since {user.joinDate}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user.location}</span>
                  </div>
                </div>

                <Link href="/dashboard/settings">
                  <Button variant="outline" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest actions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityIcon(
                          activity.type
                        )}`}
                      >
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Link href="/dashboard/projects/add">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4" />
                    New Project
                  </Button>
                </Link>
                <Link href="/dashboard/clients">
                  <Button variant="outline" className="w-full justify-start">
                    <UserPlus className="w-4 h-4" />
                    Add Client
                  </Button>
                </Link>
                <Link href="/dashboard/team">
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="w-4 h-4" />
                    Manage Team
                  </Button>
                </Link>
                <Link href="/dashboard/reports">
                  <Button variant="outline" className="w-full justify-start">
                    <FileBarChart className="w-4 h-4" />
                    Generate Report
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
