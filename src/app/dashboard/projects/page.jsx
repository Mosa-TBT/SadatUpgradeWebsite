"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Calendar,
  Users,
  Clock,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  FileText,
  CheckCircle,
  AlertCircle,
  Pause,
} from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const projects = [
    {
      id: 1,
      name: "E-commerce Platform Redesign",
      client: "RetailMax Inc.",
      type: "Web Development",
      status: "In Progress",
      progress: 75,
      budget: "$25,000",
      spent: "$18,750",
      startDate: "2024-01-15",
      dueDate: "2024-03-15",
      teamSize: 5,
      description:
        "Complete redesign of the e-commerce platform with modern UI/UX",
      priority: "High",
    },
    {
      id: 2,
      name: "Mobile Banking App",
      client: "SecureBank",
      type: "Mobile Development",
      status: "Completed",
      progress: 100,
      budget: "$45,000",
      spent: "$43,200",
      startDate: "2023-10-01",
      dueDate: "2024-01-30",
      teamSize: 7,
      description:
        "Secure mobile banking application with biometric authentication",
      priority: "High",
    },
    {
      id: 3,
      name: "SaaS Dashboard Analytics",
      client: "DataFlow Solutions",
      type: "Web Development",
      status: "In Progress",
      progress: 45,
      budget: "$18,000",
      spent: "$8,100",
      startDate: "2024-02-01",
      dueDate: "2024-04-15",
      teamSize: 4,
      description: "Advanced analytics dashboard for SaaS platform",
      priority: "Medium",
    },
    {
      id: 4,
      name: "Brand Identity Package",
      client: "StartupCo",
      type: "Branding",
      status: "On Hold",
      progress: 30,
      budget: "$8,000",
      spent: "$2,400",
      startDate: "2024-01-20",
      dueDate: "2024-03-01",
      teamSize: 3,
      description:
        "Complete brand identity including logo, guidelines, and assets",
      priority: "Low",
    },
    {
      id: 5,
      name: "Corporate Website",
      client: "TechManufacturing Corp",
      type: "Web Development",
      status: "Review",
      progress: 90,
      budget: "$15,000",
      spent: "$13,500",
      startDate: "2023-12-01",
      dueDate: "2024-02-15",
      teamSize: 4,
      description: "Professional corporate website with CMS integration",
      priority: "Medium",
    },
    {
      id: 6,
      name: "Fitness App UI/UX",
      client: "FitLife Technologies",
      type: "UI/UX Design",
      status: "Planning",
      progress: 10,
      budget: "$12,000",
      spent: "$1,200",
      startDate: "2024-02-15",
      dueDate: "2024-05-01",
      teamSize: 3,
      description: "Modern fitness tracking app with social features",
      priority: "Medium",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "In Progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "On Hold":
        return <Pause className="w-4 h-4 text-yellow-600" />;
      case "Review":
        return <Eye className="w-4 h-4 text-purple-600" />;
      case "Planning":
        return <FileText className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "On Hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Review":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Planning":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
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

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    const matchesType = typeFilter === "all" || project.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: projects.length,
    inProgress: projects.filter((p) => p.status === "In Progress").length,
    completed: projects.filter((p) => p.status === "Completed").length,
    onHold: projects.filter((p) => p.status === "On Hold").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
            <p className="text-gray-600">Manage and track all your projects</p>
          </div>
          <Link href={"/dashboard/projects/add"}>
            <Button className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-600">
                    Total Projects
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-600">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.inProgress}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.completed}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-600">On Hold</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.onHold}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Pause className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search projects or clients..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Planning">Planning</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Web Development">
                    Web Development
                  </SelectItem>
                  <SelectItem value="Mobile Development">
                    Mobile Development
                  </SelectItem>
                  <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                  <SelectItem value="Branding">Branding</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {project.client}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{project.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(project.status)}
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">{project.type}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Due: {project.dueDate}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {project.teamSize} members
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {project.spent} / {project.budget}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Started: {project.startDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/projects/${project.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/dashboard/projects/${project.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first project"}
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
