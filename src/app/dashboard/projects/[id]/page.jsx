"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Users,
  Clock,
  FileText,
  MessageSquare,
  Paperclip,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";

export default function ProjectDetailPage({ params }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock project data - in real app, fetch based on params.id
  const project = {
    id: params.id,
    name: "E-commerce Platform Redesign",
    client: "RetailMax Inc.",
    type: "Web Development",
    status: "In Progress",
    progress: 75,
    budget: "$25,000",
    spent: "$18,750",
    startDate: "2024-01-15",
    dueDate: "2024-03-15",
    description:
      "Complete redesign of the e-commerce platform with modern UI/UX, improved performance, and mobile responsiveness. The project includes user research, wireframing, design system creation, and full development implementation.",
    priority: "High",
    tags: ["E-commerce", "UI/UX", "React", "Mobile"],
    teamMembers: [
      {
        id: "1",
        name: "John Doe",
        role: "Project Manager",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "2",
        name: "Jane Smith",
        role: "UI/UX Designer",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "3",
        name: "Mike Johnson",
        role: "Frontend Developer",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "4",
        name: "Sarah Wilson",
        role: "Backend Developer",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    milestones: [
      {
        id: 1,
        title: "User Research & Analysis",
        status: "completed",
        dueDate: "2024-01-25",
        progress: 100,
      },
      {
        id: 2,
        title: "Wireframes & Prototypes",
        status: "completed",
        dueDate: "2024-02-05",
        progress: 100,
      },
      {
        id: 3,
        title: "Design System Creation",
        status: "in-progress",
        dueDate: "2024-02-15",
        progress: 80,
      },
      {
        id: 4,
        title: "Frontend Development",
        status: "in-progress",
        dueDate: "2024-02-28",
        progress: 60,
      },
      {
        id: 5,
        title: "Backend Integration",
        status: "pending",
        dueDate: "2024-03-10",
        progress: 0,
      },
      {
        id: 6,
        title: "Testing & QA",
        status: "pending",
        dueDate: "2024-03-15",
        progress: 0,
      },
    ],
    recentActivity: [
      {
        id: 1,
        user: "Jane Smith",
        action: "uploaded design files",
        time: "2 hours ago",
        type: "file",
      },
      {
        id: 2,
        user: "Mike Johnson",
        action: "completed homepage component",
        time: "4 hours ago",
        type: "task",
      },
      {
        id: 3,
        user: "John Doe",
        action: "updated project timeline",
        time: "1 day ago",
        type: "update",
      },
      {
        id: 4,
        user: "Sarah Wilson",
        action: "added new API endpoint",
        time: "2 days ago",
        type: "code",
      },
    ],
    files: [
      {
        id: 1,
        name: "Design_System_v2.fig",
        size: "2.4 MB",
        uploadedBy: "Jane Smith",
        uploadedAt: "2024-02-10",
      },
      {
        id: 2,
        name: "User_Research_Report.pdf",
        size: "1.8 MB",
        uploadedBy: "John Doe",
        uploadedAt: "2024-01-28",
      },
      {
        id: 3,
        name: "Wireframes_Final.sketch",
        size: "3.2 MB",
        uploadedBy: "Jane Smith",
        uploadedAt: "2024-02-05",
      },
    ],
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex items-center flex-wrap gap-3">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {project.name}
              </h1>
              <p className="text-gray-600">{project.client}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link href={`/dashboard/projects/${project.id}/edit`}>
              <Button variant="outline">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
            <Button variant="outline">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Project Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {project.progress}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <Progress value={project.progress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Budget Used
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {project.spent}
                  </p>
                  <p className="text-xs text-gray-500">of {project.budget}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Team Size</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {project.teamMembers.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Days Left</p>
                  <p className="text-2xl font-bold text-gray-900">15</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Project Type
                        </p>
                        <p className="text-gray-900">{project.type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Priority
                        </p>
                        <Badge className="bg-red-100 text-red-800">
                          {project.priority}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Start Date
                        </p>
                        <p className="text-gray-900">{project.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Due Date
                        </p>
                        <p className="text-gray-900">{project.dueDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="milestones" className="space-y-4">
                {project.milestones.map((milestone) => (
                  <Card key={milestone.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(milestone.status)}
                          <h3 className="font-semibold">{milestone.title}</h3>
                        </div>
                        <Badge className={getStatusColor(milestone.status)}>
                          {milestone.status.replace("-", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Due: {milestone.dueDate}</span>
                        <span>{milestone.progress}% Complete</span>
                      </div>
                      <Progress value={milestone.progress} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                {project.recentActivity.map((activity) => (
                  <Card key={activity.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>{" "}
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="files" className="space-y-4">
                {project.files.map((file) => (
                  <Card key={file.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Paperclip className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {file.size} • Uploaded by {file.uploadedBy} on{" "}
                              {file.uploadedAt}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Status */}
            <Card>
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-blue-100 text-blue-800">
                    {project.status}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Pause className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Progress value={project.progress} className="mb-2" />
                <p className="text-sm text-gray-600">
                  {project.progress}% Complete
                </p>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                      />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
