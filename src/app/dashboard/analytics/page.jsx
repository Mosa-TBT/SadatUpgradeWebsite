"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  DollarSign,
  Users,
  Target,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  const metrics = {
    revenue: {
      current: 125000,
      previous: 98000,
      change: 27.6,
      trend: "up",
    },
    projects: {
      current: 24,
      previous: 18,
      change: 33.3,
      trend: "up",
    },
    clients: {
      current: 15,
      previous: 12,
      change: 25.0,
      trend: "up",
    },
    avgProjectValue: {
      current: 5208,
      previous: 5444,
      change: -4.3,
      trend: "down",
    },
  };

  const projectsByStatus = [
    { status: "Completed", count: 8, percentage: 33.3, color: "bg-green-500" },
    {
      status: "In Progress",
      count: 12,
      percentage: 50.0,
      color: "bg-blue-500",
    },
    { status: "On Hold", count: 2, percentage: 8.3, color: "bg-yellow-500" },
    { status: "Review", count: 2, percentage: 8.3, color: "bg-purple-500" },
  ];

  const revenueByMonth = [
    { month: "Jan", revenue: 85000, projects: 6 },
    { month: "Feb", revenue: 92000, projects: 7 },
    { month: "Mar", revenue: 78000, projects: 5 },
    { month: "Apr", revenue: 105000, projects: 8 },
    { month: "May", revenue: 125000, projects: 9 },
    { month: "Jun", revenue: 118000, projects: 8 },
  ];

  const topClients = [
    { name: "RetailMax Inc.", revenue: 45000, projects: 3, growth: 15.2 },
    { name: "SecureBank", revenue: 38000, projects: 2, growth: 8.7 },
    {
      name: "TechManufacturing Corp",
      revenue: 25000,
      projects: 2,
      growth: -2.1,
    },
    { name: "DataFlow Solutions", revenue: 18000, projects: 1, growth: 22.5 },
    { name: "StartupCo", revenue: 12000, projects: 1, growth: 45.8 },
  ];

  const projectTypes = [
    { type: "Web Development", count: 12, revenue: 78000, percentage: 50.0 },
    { type: "Mobile Development", count: 4, revenue: 32000, percentage: 16.7 },
    { type: "UI/UX Design", count: 5, revenue: 25000, percentage: 20.8 },
    { type: "Branding", count: 3, revenue: 15000, percentage: 12.5 },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">
              Track your business performance and insights
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(metrics.revenue.current)}
                  </p>
                  <div className="flex items-center">
                    {metrics.revenue.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ml-1 ${
                        metrics.revenue.trend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatPercentage(metrics.revenue.change)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      vs last period
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
                    Active Projects
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.projects.current}
                  </p>
                  <div className="flex items-center ">
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600 ml-1">
                      {formatPercentage(metrics.projects.change)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      vs last period
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
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
                    {metrics.clients.current}
                  </p>
                  <div className="flex items-center">
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600 ml-1">
                      {formatPercentage(metrics.clients.change)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      vs last period
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
                    Avg Project Value
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(metrics.avgProjectValue.current)}
                  </p>
                  <div className="flex items-center">
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600 ml-1">
                      {formatPercentage(metrics.avgProjectValue.change)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      vs last period
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>
                Monthly revenue over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueByMonth.map((month, index) => (
                  <div
                    key={month.month}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 text-sm font-medium text-gray-600">
                        {month.month}
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full"
                            style={{
                              width: `${(month.revenue / 125000) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(month.revenue)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {month.projects} projects
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
              <CardDescription>
                Distribution of projects by current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectsByStatus.map((item) => (
                  <div
                    key={item.status}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${item.color}`}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {item.count}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.percentage}%
                        </div>
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Clients */}
          <Card>
            <CardHeader>
              <CardTitle>Top Clients</CardTitle>
              <CardDescription>Clients by revenue contribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClients.map((client, index) => (
                  <div
                    key={client.name}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {client.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {client.projects} projects
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(client.revenue)}
                      </div>
                      <div
                        className={`text-sm ${
                          client.growth > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {formatPercentage(client.growth)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Types */}
          <Card>
            <CardHeader>
              <CardTitle>Project Types</CardTitle>
              <CardDescription>
                Revenue breakdown by project category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectTypes.map((type) => (
                  <div key={type.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {type.type}
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(type.revenue)}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({type.count} projects)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                        style={{ width: `${type.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
