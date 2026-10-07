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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  Download,
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  FileText,
} from "lucide-react";

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("last-30-days");
  const [reportType, setReportType] = useState("overview");

  // Mock data for charts
  const revenueData = [
    { month: "Jan", revenue: 45000, projects: 8 },
    { month: "Feb", revenue: 52000, projects: 10 },
    { month: "Mar", revenue: 48000, projects: 9 },
    { month: "Apr", revenue: 61000, projects: 12 },
    { month: "May", revenue: 55000, projects: 11 },
    { month: "Jun", revenue: 67000, projects: 14 },
  ];

  const projectStatusData = [
    { name: "Completed", value: 45, color: "#10B981" },
    { name: "In Progress", value: 30, color: "#3B82F6" },
    { name: "On Hold", value: 15, color: "#F59E0B" },
    { name: "Planning", value: 10, color: "#6B7280" },
  ];

  const teamPerformanceData = [
    { name: "John Doe", hours: 160, projects: 5, efficiency: 95 },
    { name: "Jane Smith", hours: 145, projects: 4, efficiency: 92 },
    { name: "Mike Johnson", hours: 170, projects: 6, efficiency: 88 },
    { name: "Sarah Wilson", hours: 155, projects: 4, efficiency: 90 },
    { name: "David Brown", hours: 140, projects: 3, efficiency: 85 },
  ];

  const clientRevenueData = [
    { name: "RetailMax Inc.", revenue: 125000, projects: 5 },
    { name: "SecureBank", revenue: 89000, projects: 3 },
    { name: "TechManufacturing", revenue: 78000, projects: 4 },
    { name: "DataFlow Solutions", revenue: 45000, projects: 2 },
    { name: "StartupCo", revenue: 12000, projects: 1 },
  ];

  const stats = {
    totalRevenue: "$349,000",
    revenueGrowth: "+12.5%",
    totalProjects: 35,
    projectGrowth: "+8.3%",
    activeClients: 12,
    clientGrowth: "+16.7%",
    teamUtilization: "87%",
    utilizationChange: "+2.1%",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reports & Analytics
            </h1>
            <p className="text-gray-600">
              Track performance and generate insights
            </p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7-days">Last 7 days</SelectItem>
                <SelectItem value="last-30-days">Last 30 days</SelectItem>
                <SelectItem value="last-3-months">Last 3 months</SelectItem>
                <SelectItem value="last-6-months">Last 6 months</SelectItem>
                <SelectItem value="last-year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalRevenue}
                  </p>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">
                      {stats.revenueGrowth}
                    </span>
                  </div>
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
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-600">
                    Total Projects
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalProjects}
                  </p>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-sm text-blue-600">
                      {stats.projectGrowth}
                    </span>
                  </div>
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
                    Active Clients
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeClients}
                  </p>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-purple-600 mr-1" />
                    <span className="text-sm text-purple-600">
                      {stats.clientGrowth}
                    </span>
                  </div>
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
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-600">
                    Team Utilization
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.teamUtilization}
                  </p>
                  <div className="flex items-center  ">
                    <TrendingUp className="w-4 h-4 text-orange-600 mr-1" />
                    <span className="text-sm text-orange-600">
                      {stats.utilizationChange}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          `$${value.toLocaleString()}`,
                          "Revenue",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue vs Projects</CardTitle>
                  <CardDescription>
                    Correlation between revenue and project count
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" />
                      <Bar yAxisId="right" dataKey="projects" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Status Distribution</CardTitle>
                  <CardDescription>
                    Current status of all projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={projectStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {projectStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Completion Rate</CardTitle>
                  <CardDescription>
                    Monthly project completion trends
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">January</span>
                      <span className="text-sm text-gray-600">8/10 (80%)</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">February</span>
                      <span className="text-sm text-gray-600">9/10 (90%)</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">March</span>
                      <span className="text-sm text-gray-600">7/9 (78%)</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">April</span>
                      <span className="text-sm text-gray-600">11/12 (92%)</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Performance</CardTitle>
                  <CardDescription>
                    Hours worked and efficiency by team member
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={teamPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="hours" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team Efficiency</CardTitle>
                  <CardDescription>
                    Efficiency ratings by team member
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {teamPerformanceData.map((member) => (
                    <div key={member.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {member.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {member.efficiency}%
                        </span>
                      </div>
                      <Progress value={member.efficiency} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Revenue</CardTitle>
                  <CardDescription>
                    Revenue generated by each client
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={clientRevenueData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip
                        formatter={(value) => [
                          `$${value.toLocaleString()}`,
                          "Revenue",
                        ]}
                      />
                      <Bar dataKey="revenue" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Clients</CardTitle>
                  <CardDescription>
                    Clients ranked by total revenue
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {clientRevenueData.map((client, index) => (
                    <div
                      key={client.name}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-600">
                            {client.projects} projects
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${client.revenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
