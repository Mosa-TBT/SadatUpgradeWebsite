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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Users,
  Clock,
  CheckCircle,
  Star,
  Award,
} from "lucide-react";

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const teamMembers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@agency.com",
      phone: "+1 (555) 123-4567",
      role: "Project Manager",
      department: "Management",
      status: "Active",
      location: "New York, NY",
      joinDate: "2022-01-15",
      avatar: "/placeholder.svg?height=40&width=40",
      activeProjects: 5,
      completedProjects: 23,
      hourlyRate: "$85",
      totalHours: 1240,
      rating: 4.8,
      skills: ["Project Management", "Agile", "Scrum", "Leadership"],
      lastActive: "Online now",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@agency.com",
      phone: "+1 (555) 987-6543",
      role: "UI/UX Designer",
      department: "Design",
      status: "Active",
      location: "San Francisco, CA",
      joinDate: "2022-03-20",
      avatar: "/placeholder.svg?height=40&width=40",
      activeProjects: 3,
      completedProjects: 18,
      hourlyRate: "$75",
      totalHours: 980,
      rating: 4.9,
      skills: ["UI Design", "UX Research", "Figma", "Prototyping"],
      lastActive: "2 hours ago",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@agency.com",
      phone: "+1 (555) 456-7890",
      role: "Frontend Developer",
      department: "Development",
      status: "Active",
      location: "Austin, TX",
      joinDate: "2021-11-10",
      avatar: "/placeholder.svg?height=40&width=40",
      activeProjects: 4,
      completedProjects: 31,
      hourlyRate: "$80",
      totalHours: 1560,
      rating: 4.7,
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      lastActive: "1 hour ago",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@agency.com",
      phone: "+1 (555) 321-0987",
      role: "Backend Developer",
      department: "Development",
      status: "Active",
      location: "Seattle, WA",
      joinDate: "2022-06-15",
      avatar: "/placeholder.svg?height=40&width=40",
      activeProjects: 3,
      completedProjects: 15,
      hourlyRate: "$82",
      totalHours: 890,
      rating: 4.6,
      skills: ["Node.js", "Python", "PostgreSQL", "AWS"],
      lastActive: "30 minutes ago",
    },
    {
      id: 5,
      name: "David Brown",
      email: "david@agency.com",
      phone: "+1 (555) 654-3210",
      role: "QA Engineer",
      department: "Quality Assurance",
      status: "Active",
      location: "Chicago, IL",
      joinDate: "2023-01-08",
      avatar: "/placeholder.svg?height=40&width=40",
      activeProjects: 2,
      completedProjects: 12,
      hourlyRate: "$65",
      totalHours: 520,
      rating: 4.5,
      skills: ["Test Automation", "Selenium", "Jest", "Cypress"],
      lastActive: "4 hours ago",
    },
    {
      id: 6,
      name: "Lisa Park",
      email: "lisa@agency.com",
      phone: "+1 (555) 789-0123",
      role: "Marketing Specialist",
      department: "Marketing",
      status: "On Leave",
      location: "Los Angeles, CA",
      joinDate: "2022-09-12",
      avatar: "/placeholder.svg?height=40&width=40",
      activeProjects: 0,
      completedProjects: 8,
      hourlyRate: "$60",
      totalHours: 340,
      rating: 4.3,
      skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
      lastActive: "1 week ago",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "On Leave":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Project Manager":
        return "bg-purple-100 text-purple-800";
      case "UI/UX Designer":
        return "bg-pink-100 text-pink-800";
      case "Frontend Developer":
        return "bg-blue-100 text-blue-800";
      case "Backend Developer":
        return "bg-green-100 text-green-800";
      case "QA Engineer":
        return "bg-orange-100 text-orange-800";
      case "Marketing Specialist":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter((m) => m.status === "Active").length,
    totalHours: teamMembers.reduce((sum, member) => sum + member.totalHours, 0),
    avgRating:
      teamMembers.reduce((sum, member) => sum + member.rating, 0) /
      teamMembers.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Team</h1>
            <p className="text-gray-600">
              Manage your team members and their roles
            </p>
          </div>
          <Button className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="w-4 h-4" />
            Add Team Member
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-600">
                    Total Members
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-600">
                    Active Members
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.active}
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
                  <p className="text-sm font-medium text-gray-600">
                    Total Hours
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalHours.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-600">
                    Avg Rating
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.avgRating.toFixed(1)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
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
                    placeholder="Search team members..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Project Manager">
                    Project Manager
                  </SelectItem>
                  <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                  <SelectItem value="Frontend Developer">
                    Frontend Developer
                  </SelectItem>
                  <SelectItem value="Backend Developer">
                    Backend Developer
                  </SelectItem>
                  <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                  <SelectItem value="Marketing Specialist">
                    Marketing Specialist
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
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
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {member.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {member.email}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getRoleColor(member.role)}>
                    {member.role}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {renderStars(member.rating)}
                    <span className="text-sm text-gray-600 ml-1">
                      ({member.rating})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{member.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{member.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Joined: {member.joinDate}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{member.lastActive}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center py-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {member.activeProjects}
                    </p>
                    <p className="text-xs text-gray-500">Active Projects</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {member.completedProjects}
                    </p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {member.hourlyRate}
                    </p>
                    <p className="text-xs text-gray-500">Hourly Rate</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 " />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 " />
                      Edit
                    </Button>
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

        {filteredMembers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No team members found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first team member"}
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
