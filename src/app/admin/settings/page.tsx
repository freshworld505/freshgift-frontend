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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Bell,
  Shield,
  Mail,
  Globe,
  Database,
  Save,
  AlertTriangle,
} from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    storeName: "FreshGift",
    storeDescription: "Fresh produce delivered to your door",
    storeEmail: "admin@veggieco.com",
    storePhone: "+1 234-567-8900",
    currency: "USD",
    timezone: "America/New_York",

    // Notification Settings
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    marketingEmails: false,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,

    // Admin Email Access
    adminEmails: [
      "ajbaggar@gmail.com",
      "admin@veggieco.com",
      "aryan@veggieco.com",
      "admin@freshworld.com",
      "adminuser@freshworld.com",
    ],
  });

  const [newAdminEmail, setNewAdminEmail] = useState("");

  const handleSave = () => {
    // Here you would save settings to your backend
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  const addAdminEmail = () => {
    if (newAdminEmail && !settings.adminEmails.includes(newAdminEmail)) {
      setSettings((prev) => ({
        ...prev,
        adminEmails: [...prev.adminEmails, newAdminEmail],
      }));
      setNewAdminEmail("");
    }
  };

  const removeAdminEmail = (email: string) => {
    setSettings((prev) => ({
      ...prev,
      adminEmails: prev.adminEmails.filter((e) => e !== email),
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your store configuration and preferences
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <CardTitle>General Settings</CardTitle>
          </div>
          <CardDescription>
            Basic store information and configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    storeName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Store Email</Label>
              <Input
                id="storeEmail"
                type="email"
                value={settings.storeEmail}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    storeEmail: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeDescription">Store Description</Label>
            <Textarea
              id="storeDescription"
              value={settings.storeDescription}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  storeDescription: e.target.value,
                }))
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storePhone">Phone Number</Label>
              <Input
                id="storePhone"
                value={settings.storePhone}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    storePhone: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={settings.currency}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, currency: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={settings.timezone}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, timezone: e.target.value }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Access Control */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Admin Access Control</CardTitle>
          </div>
          <CardDescription>
            Manage which email addresses have admin access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Only users with these email addresses can access the admin panel
            </p>
          </div>

          <div className="space-y-3">
            <Label>Authorized Admin Emails</Label>
            <div className="flex flex-wrap gap-2">
              {settings.adminEmails.map((email) => (
                <Badge
                  key={email}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{email}</span>
                  <button
                    onClick={() => removeAdminEmail(email)}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <Input
              placeholder="Enter admin email address"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              type="email"
            />
            <Button onClick={addAdminEmail} variant="outline">
              Add Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notification Settings</CardTitle>
          </div>
          <CardDescription>
            Configure your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for important events
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  emailNotifications: checked,
                }))
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Order Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new orders are placed
              </p>
            </div>
            <Switch
              checked={settings.orderNotifications}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  orderNotifications: checked,
                }))
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts when products are running low
              </p>
            </div>
            <Switch
              checked={settings.lowStockAlerts}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, lowStockAlerts: checked }))
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Subscribe to marketing and promotional emails
              </p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, marketingEmails: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Security Settings</CardTitle>
          </div>
          <CardDescription>
            Manage your account security preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, twoFactorAuth: checked }))
              }
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout || ""}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseInt(e.target.value);
                  setSettings((prev) => ({
                    ...prev,
                    sessionTimeout: isNaN(value) ? 0 : value,
                  }));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
              <Input
                id="passwordExpiry"
                type="number"
                value={settings.passwordExpiry || ""}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseInt(e.target.value);
                  setSettings((prev) => ({
                    ...prev,
                    passwordExpiry: isNaN(value) ? 0 : value,
                  }));
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Settings</span>
        </Button>
      </div>
    </div>
  );
}
