"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BusinessRoleToggle from "@/components/layout/BusinessRoleToggle";

export default function AccountProfilePage() {
  const { user, updateUserProfile } = useAuthStore();
  const [editedName, setEditedName] = useState<string>("");

  useEffect(() => {
    if (user) {
      setEditedName(user.name || "");
    }
  }, [user]);

  if (!user) {
    return <p>Loading user profile...</p>;
  }

  const getUserInitials = () => {
    if (user?.name)
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return "VG";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (user) {
      // Only call updateUserProfile if the name has actually changed
      if (editedName !== (user.name || "")) {
        updateUserProfile({ name: editedName });
        // The store's updateUserProfile will show a generic toast.
        // We can show a more specific one here if needed, or rely on the store's.
        // For now, the store's toast for name change is good.
        toast({ title: "Profile name updated successfully!" });
      } else {
        toast({ title: "No changes to save.", variant: "default" });
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Profile Information
        </h2>
        <p className="text-gray-600">
          Manage your personal details and account preferences
        </p>
      </div>

      {/* Profile Avatar and Basic Info */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 ring-4 ring-green-200 transition-all duration-300 group-hover:ring-green-300">
              <AvatarImage
                src={
                  user.profilePicture ||
                  `https://placehold.co/100x100.png?text=${getUserInitials()}`
                }
                alt={user.name || user.email}
                data-ai-hint="profile avatar"
              />
              <AvatarFallback className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-green-600 text-white rounded-full p-2 shadow-lg">
              <UserCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {user.name || "RoyaleFresh User"}
            </h3>
            <p className="text-gray-600 text-lg">{user.email}</p>
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Active Member
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">Edit Profile</h3>
          <p className="text-gray-600 mt-1">Update your personal information</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </Label>
              <Input
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Enter your full name"
                className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="h-12 rounded-xl border-gray-200 bg-gray-50"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="submit"
              className="h-12 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
              disabled={editedName === (user.name || "")}
            >
              {editedName === (user.name || "") ? "No Changes" : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 px-8 rounded-xl border-gray-200 hover:bg-gray-50"
              onClick={() => setEditedName(user.name || "")}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>

      {/* Business Role Toggle Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">
            Business Account
          </h3>
          <p className="text-gray-600 mt-1">
            Switch between user and business modes
          </p>
        </div>
        <div className="p-6">
          <BusinessRoleToggle variant="standalone" className="bg-gray-50" />
        </div>
      </div>
    </div>
  );
}
