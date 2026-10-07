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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  MapPin,
  Building,
  Shield,
  CreditCard,
  Globe,
  Camera,
  Save,
  Trash2,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Inc.",
    website: "https://techcorp.com",
    bio: "Experienced web developer and digital strategist with over 8 years in the industry.",
    location: "San Francisco, CA",
    timezone: "America/Los_Angeles",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    projectUpdates: true,
    marketingEmails: false,
    securityAlerts: true,
    invoiceReminders: true,
    weeklyReports: true,
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: "30",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileSave = () => {
    console.log("Saving profile:", profile);
    // Handle profile save
  };

  const handleNotificationsSave = () => {
    console.log("Saving notifications:", notifications);
    // Handle notifications save
  };

  const handleSecuritySave = () => {
    console.log("Saving security settings:", security);
    // Handle security save
  };

  const handlePasswordChange = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords don't match");
      return;
    }
    console.log("Changing password");
    // Handle password change
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and profile details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) =>
                            setProfile({ ...profile, lastName: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            className="pl-10"
                            value={profile.phone}
                            onChange={(e) =>
                              setProfile({ ...profile, phone: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="company"
                            className="pl-10"
                            value={profile.company}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                company: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="website"
                          className="pl-10"
                          value={profile.website}
                          onChange={(e) =>
                            setProfile({ ...profile, website: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        rows={4}
                        value={profile.bio}
                        onChange={(e) =>
                          setProfile({ ...profile, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="location"
                            className="pl-10"
                            value={profile.location}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                location: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={profile.timezone}
                          onValueChange={(value) =>
                            setProfile({ ...profile, timezone: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/Los_Angeles">
                              Pacific Time (PT)
                            </SelectItem>
                            <SelectItem value="America/Denver">
                              Mountain Time (MT)
                            </SelectItem>
                            <SelectItem value="America/Chicago">
                              Central Time (CT)
                            </SelectItem>
                            <SelectItem value="America/New_York">
                              Eastern Time (ET)
                            </SelectItem>
                            <SelectItem value="Europe/London">
                              London (GMT)
                            </SelectItem>
                            <SelectItem value="Europe/Paris">
                              Paris (CET)
                            </SelectItem>
                            <SelectItem value="Asia/Tokyo">
                              Tokyo (JST)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={handleProfileSave}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Picture */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Update your profile photo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="w-32 h-32">
                        <AvatarImage
                          src="/placeholder.svg?height=128&width=128"
                          alt="Profile"
                        />
                        <AvatarFallback className="text-2xl">
                          {profile.firstName[0]}
                          {profile.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">
                          <Camera className="w-4 h-4" />
                          Upload Photo
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove Photo
                        </Button>
                      </div>
                    </div>
                    <div className="text-center text-sm text-gray-500">
                      <p>Recommended: Square image, at least 400x400px</p>
                      <p>Max file size: 5MB</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified about updates and
                  activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          emailNotifications: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Project Updates</Label>
                      <p className="text-sm text-gray-500">
                        Get notified when projects are updated
                      </p>
                    </div>
                    <Switch
                      checked={notifications.projectUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          projectUpdates: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Marketing Emails</Label>
                      <p className="text-sm text-gray-500">
                        Receive promotional emails and newsletters
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          marketingEmails: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Security Alerts</Label>
                      <p className="text-sm text-gray-500">
                        Important security notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.securityAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          securityAlerts: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Invoice Reminders</Label>
                      <p className="text-sm text-gray-500">
                        Reminders for upcoming payments
                      </p>
                    </div>
                    <Switch
                      checked={notifications.invoiceReminders}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          invoiceReminders: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Weekly Reports</Label>
                      <p className="text-sm text-gray-500">
                        Weekly summary of your projects and activities
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          weeklyReports: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <Button
                  onClick={handleNotificationsSave}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Save className="w-4 h-4" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Password Change */}
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        value={passwords.currentPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            currentPassword: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        value={passwords.newPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            newPassword: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        value={passwords.confirmPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handlePasswordChange}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Shield className="w-4 h-4" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">
                          Two-Factor Authentication
                        </Label>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={security.twoFactorEnabled}
                          onCheckedChange={(checked) =>
                            setSecurity({
                              ...security,
                              twoFactorEnabled: checked,
                            })
                          }
                        />
                        {security.twoFactorEnabled && (
                          <Badge className="bg-green-100 text-green-800">
                            Enabled
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Login Alerts</Label>
                        <p className="text-sm text-gray-500">
                          Get notified of new login attempts
                        </p>
                      </div>
                      <Switch
                        checked={security.loginAlerts}
                        onCheckedChange={(checked) =>
                          setSecurity({ ...security, loginAlerts: checked })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout</Label>
                      <Select
                        value={security.sessionTimeout}
                        onValueChange={(value) =>
                          setSecurity({ ...security, sessionTimeout: value })
                        }
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">
                        Automatically log out after period of inactivity
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleSecuritySave}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Save className="w-4 h-4" />
                    Save Security Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-6">
              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>
                    Manage your subscription and billing information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Professional Plan
                      </h3>
                      <p className="text-gray-600">
                        Full access to all features
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Next billing date: March 15, 2024
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">$49</div>
                      <div className="text-sm text-gray-500">per month</div>
                      <Badge className="mt-2 bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-4">
                    <Button variant="outline">Change Plan</Button>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>
                    Manage your payment information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-8 h-8 text-gray-400" />
                      <div>
                        <div className="font-medium">•••• •••• •••• 4242</div>
                        <div className="text-sm text-gray-500">
                          Expires 12/25
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Primary</Badge>
                  </div>
                  <div className="flex gap-3 flex-wrap mt-4">
                    <Button variant="outline">Update Payment Method</Button>
                    <Button variant="outline">Add Payment Method</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>
                    View your past invoices and payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        date: "Feb 15, 2024",
                        amount: "$49.00",
                        status: "Paid",
                        invoice: "INV-001",
                      },
                      {
                        date: "Jan 15, 2024",
                        amount: "$49.00",
                        status: "Paid",
                        invoice: "INV-002",
                      },
                      {
                        date: "Dec 15, 2023",
                        amount: "$49.00",
                        status: "Paid",
                        invoice: "INV-003",
                      },
                    ].map((item) => (
                      <div
                        key={item.invoice}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{item.invoice}</div>
                          <div className="text-sm text-gray-500">
                            {item.date}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-medium">{item.amount}</div>
                            <Badge className="bg-green-100 text-green-800">
                              {item.status}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
