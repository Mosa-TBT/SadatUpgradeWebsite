"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  CalendarIcon,
  DollarSign,
  Users,
  FileText,
  Tag,
  Clock,
  Save,
  X,
} from "lucide-react";
import { format } from "date-fns";

export default function EditProjectPage({ params }) {
  const router = useRouter();
  const [startDate, setStartDate] = useState(new Date("2024-01-15"));
  const [dueDate, setDueDate] = useState(new Date("2024-03-15"));
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([
    "1",
    "2",
    "3",
    "4",
  ]);
  const [projectTags, setProjectTags] = useState([
    "E-commerce",
    "UI/UX",
    "React",
    "Mobile",
  ]);
  const [newTag, setNewTag] = useState("");
  const [progress, setProgress] = useState(75);

  // Mock existing project data - in real app, fetch based on params.id
  const [projectData, setProjectData] = useState({
    name: "E-commerce Platform Redesign",
    client: "RetailMax Inc.",
    description:
      "Complete redesign of the e-commerce platform with modern UI/UX, improved performance, and mobile responsiveness.",
    type: "web-development",
    priority: "high",
    status: "in-progress",
    budget: "25000",
    hourlyRate: "150",
    spent: "18750",
  });

  const teamMembers = [
    {
      id: "1",
      name: "John Doe",
      role: "Project Manager",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "UI/UX Designer",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      name: "Mike Johnson",
      role: "Frontend Developer",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      role: "Backend Developer",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "5",
      name: "David Brown",
      role: "QA Engineer",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ];

  const addTag = () => {
    if (newTag.trim() && !projectTags.includes(newTag.trim())) {
      setProjectTags([...projectTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setProjectTags(projectTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Project updated successfully");
    router.push(`/dashboard/projects/${params.id}`);
  };

  const handleInputChange = (field, value) => {
    setProjectData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8 flex-wrap gap-3">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
            <p className="text-gray-600">Update project details and settings</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Project Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Project Information
                  </CardTitle>
                  <CardDescription>
                    Update basic details about your project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name *</Label>
                      <Input
                        id="projectName"
                        value={projectData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Client Name *</Label>
                      <Input
                        id="clientName"
                        value={projectData.client}
                        onChange={(e) =>
                          handleInputChange("client", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea
                      id="description"
                      value={projectData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectType">Project Type *</Label>
                      <Select
                        value={projectData.type}
                        onValueChange={(value) =>
                          handleInputChange("type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web-development">
                            Web Development
                          </SelectItem>
                          <SelectItem value="mobile-development">
                            Mobile Development
                          </SelectItem>
                          <SelectItem value="ui-ux-design">
                            UI/UX Design
                          </SelectItem>
                          <SelectItem value="branding">Branding</SelectItem>
                          <SelectItem value="marketing">
                            Digital Marketing
                          </SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={projectData.priority}
                        onValueChange={(value) =>
                          handleInputChange("priority", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline & Budget */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Timeline & Budget
                  </CardTitle>
                  <CardDescription>
                    Update project timeline and budget details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate
                              ? format(startDate, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dueDate}
                            onSelect={setDueDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Total Budget</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="budget"
                          type="number"
                          value={projectData.budget}
                          onChange={(e) =>
                            handleInputChange("budget", e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="spent">Amount Spent</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="spent"
                          type="number"
                          value={projectData.spent}
                          onChange={(e) =>
                            handleInputChange("spent", e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="hourlyRate"
                          type="number"
                          value={projectData.hourlyRate}
                          onChange={(e) =>
                            handleInputChange("hourlyRate", e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Update */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Progress</CardTitle>
                  <CardDescription>
                    Update the current progress of the project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="progress">Progress Percentage</Label>
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                    <input
                      type="range"
                      id="progress"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <Progress value={progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Status</CardTitle>
                  <CardDescription>Update the current status</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={projectData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Team Assignment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Team Members
                  </CardTitle>
                  <CardDescription>
                    Update team member assignments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center space-x-3"
                      >
                        <input
                          type="checkbox"
                          id={`member-${member.id}`}
                          className="rounded border-gray-300"
                          checked={selectedTeamMembers.includes(member.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTeamMembers([
                                ...selectedTeamMembers,
                                member.id,
                              ]);
                            } else {
                              setSelectedTeamMembers(
                                selectedTeamMembers.filter(
                                  (id) => id !== member.id
                                )
                              );
                            }
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Project Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Project Tags
                  </CardTitle>
                  <CardDescription>Update project tags</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {projectTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Save className="w-4 h-4" />
              Update Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
