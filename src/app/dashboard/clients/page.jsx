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
  Mail,
  Phone,
  MapPin,
  Building,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Users,
  DollarSign,
  Calendar,
  Star,
} from "lucide-react";

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const clients = [
    {
      id: 1,
      name: "RetailMax Inc.",
      contactPerson: "Sarah Johnson",
      email: "sarah@retailmax.com",
      phone: "+1 (555) 123-4567",
      company: "RetailMax Inc.",
      location: "New York, NY",
      status: "Active",
      type: "Enterprise",
      totalProjects: 5,
      activeProjects: 2,
      totalRevenue: "$125,000",
      joinDate: "2023-01-15",
      rating: 5,
      avatar: "/placeholder.svg?height=40&width=40",
      lastContact: "2024-02-10",
    },
    {
      id: 2,
      name: "SecureBank",
      contactPerson: "Michael Chen",
      email: "m.chen@securebank.com",
      phone: "+1 (555) 987-6543",
      company: "SecureBank",
      location: "San Francisco, CA",
      status: "Active",
      type: "Enterprise",
      totalProjects: 3,
      activeProjects: 1,
      totalRevenue: "$89,000",
      joinDate: "2023-03-20",
      rating: 5,
      avatar: "/placeholder.svg?height=40&width=40",
      lastContact: "2024-02-08",
    },
    {
      id: 3,
      name: "DataFlow Solutions",
      contactPerson: "Emily Rodriguez",
      email: "emily@dataflow.com",
      phone: "+1 (555) 456-7890",
      company: "DataFlow Solutions",
      location: "Austin, TX",
      status: "Active",
      type: "SMB",
      totalProjects: 2,
      activeProjects: 1,
      totalRevenue: "$45,000",
      joinDate: "2023-06-10",
      rating: 4,
      avatar: "/placeholder.svg?height=40&width=40",
      lastContact: "2024-02-05",
    },
    {
      id: 4,
      name: "StartupCo",
      contactPerson: "Alex Thompson",
      email: "alex@startupco.com",
      phone: "+1 (555) 321-0987",
      company: "StartupCo",
      location: "Seattle, WA",
      status: "Inactive",
      type: "Startup",
      totalProjects: 1,
      activeProjects: 0,
      totalRevenue: "$12,000",
      joinDate: "2023-09-15",
      rating: 3,
      avatar: "/placeholder.svg?height=40&width=40",
      lastContact: "2024-01-20",
    },
    {
      id: 5,
      name: "TechManufacturing Corp",
      contactPerson: "David Wilson",
      email: "d.wilson@techmanuf.com",
      phone: "+1 (555) 654-3210",
      company: "TechManufacturing Corp",
      location: "Chicago, IL",
      status: "Active",
      type: "Enterprise",
      totalProjects: 4,
      activeProjects: 1,
      totalRevenue: "$78,000",
      joinDate: "2023-02-28",
      rating: 4,
      avatar: "/placeholder.svg?height=40&width=40",
      lastContact: "2024-02-12",
    },
    {
      id: 6,
      name: "FitLife Technologies",
      contactPerson: "Lisa Park",
      email: "lisa@fitlife.com",
      phone: "+1 (555) 789-0123",
      company: "FitLife Technologies",
      location: "Los Angeles, CA",
      status: "Prospect",
      type: "SMB",
      totalProjects: 0,
      activeProjects: 0,
      totalRevenue: "$0",
      joinDate: "2024-02-01",
      rating: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      lastContact: "2024-02-01",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Prospect":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Enterprise":
        return "bg-purple-100 text-purple-800";
      case "SMB":
        return "bg-blue-100 text-blue-800";
      case "Startup":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    const matchesType = typeFilter === "all" || client.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === "Active").length,
    prospects: clients.filter((c) => c.status === "Prospect").length,
    totalRevenue: clients.reduce((sum, client) => {
      const revenue = Number.parseInt(client.totalRevenue.replace(/[$,]/g, ""));
      return sum + revenue;
    }, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Clients</h1>
            <p className="text-gray-600">Manage your client relationships</p>
          </div>
          <Button className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="w-4 h-4" />
            Add Client
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Clients
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
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Clients
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.active}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Prospects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.prospects}
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
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
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
                    placeholder="Search clients..."
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Prospect">Prospect</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                  <SelectItem value="SMB">SMB</SelectItem>
                  <SelectItem value="Startup">Startup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={client.avatar || "/placeholder.svg"}
                        alt={client.name}
                      />
                      <AvatarFallback>
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {client.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {client.contactPerson}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getTypeColor(client.type)}>
                    {client.type}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {renderStars(client.rating)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 truncate">
                      {client.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{client.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{client.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{client.company}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center py-3 bg-gray-50 rounded-lg max-[400px]:grid-cols-1">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {client.totalProjects}
                    </p>
                    <p className="text-xs text-gray-500">Total Projects</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {client.activeProjects}
                    </p>
                    <p className="text-xs text-gray-500">Active Projects</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {client.totalRevenue}
                    </p>
                    <p className="text-xs text-gray-500">Total Revenue</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined: {client.joinDate}</span>
                  </div>
                  <span>Last contact: {client.lastContact}</span>
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

        {filteredClients.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No clients found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first client"}
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4" />
                Add Client
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
