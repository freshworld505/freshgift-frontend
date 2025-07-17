"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap, Building2, Phone, MapPin, Loader2 } from "lucide-react";
import { applyForBusinessUser } from "@/api/BusinessUserApi";
import { getUserAddresses } from "@/api/BusinessUserApi";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { Address } from "@/lib/types";

interface BusinessModalProps {
  children: React.ReactNode;
}

export default function BusinessModal({ children }: BusinessModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    businessName: "",
    businessId: "",
    businessPhone: "",
    addressId: "",
  });

  // Load user addresses when modal opens
  useEffect(() => {
    if (open && user) {
      loadAddresses();
    }
  }, [open, user]);

  const loadAddresses = async () => {
    if (!user) return;

    setLoadingAddresses(true);
    try {
      const userAddresses = await getUserAddresses();
      setAddresses(userAddresses);
    } catch (error) {
      console.error("Failed to load addresses:", error);
      toast({
        title: "Error",
        description: "Failed to load your addresses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingAddresses(false);
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove all spaces and special characters except +
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

    // UK phone number patterns
    const ukPatterns = [
      /^\+44[1-9]\d{8,9}$/, // +44 followed by area code and number
      /^44[1-9]\d{8,9}$/, // 44 without +
      /^0[1-9]\d{8,9}$/, // UK domestic format starting with 0
    ];

    // India phone number patterns
    const indiaPatterns = [
      /^\+91[6-9]\d{9}$/, // +91 followed by 10 digits starting with 6-9
      /^91[6-9]\d{9}$/, // 91 without +
      /^[6-9]\d{9}$/, // Indian domestic format (10 digits starting with 6-9)
    ];

    return [...ukPatterns, ...indiaPatterns].some((pattern) =>
      pattern.test(cleanPhone)
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for business deals.",
        variant: "destructive",
      });
      return;
    }

    if (
      !formData.businessName ||
      !formData.businessId ||
      !formData.businessPhone ||
      !formData.addressId
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!validatePhoneNumber(formData.businessPhone)) {
      toast({
        title: "Invalid Phone Number",
        description:
          "Please enter a valid UK or India phone number. Examples: +44 20 1234 5678, +91 98765 43210",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("Submitting business application with data:", formData);
      await applyForBusinessUser(formData);
      toast({
        title: "Application Submitted!",
        description:
          "Your business application has been submitted successfully. We'll review it and get back to you soon.",
      });
      setOpen(false);
      // Reset form
      setFormData({
        businessName: "",
        businessId: "",
        businessPhone: "",
        addressId: "",
      });
    } catch (error: any) {
      console.error("Failed to apply for business user:", error);
      toast({
        title: "Application Failed",
        description:
          error.message ||
          "Failed to submit your business application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-600" />
            Apply for Business Deals
          </DialogTitle>
          <DialogDescription>
            Get access to exclusive wholesale prices and bulk ordering options
            for your business.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-sm font-medium">
              Business Name *
            </Label>
            <Input
              id="businessName"
              placeholder="e.g., My Bakery Shop"
              value={formData.businessName}
              onChange={(e) =>
                handleInputChange("businessName", e.target.value)
              }
              required
            />
          </div>

          {/* Business ID */}
          <div className="space-y-2">
            <Label htmlFor="businessId" className="text-sm font-medium">
              Business Registration ID *
            </Label>
            <Input
              id="businessId"
              placeholder="e.g., REG-982347"
              value={formData.businessId}
              onChange={(e) => handleInputChange("businessId", e.target.value)}
              required
            />
          </div>

          {/* Business Phone */}
          <div className="space-y-2">
            <Label htmlFor="businessPhone" className="text-sm font-medium">
              Business Phone Number *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="businessPhone"
                type="tel"
                placeholder="UK: +44 20 1234 5678 or India: +91 98765 43210"
                value={formData.businessPhone}
                onChange={(e) =>
                  handleInputChange("businessPhone", e.target.value)
                }
                className={`pl-10 ${
                  formData.businessPhone &&
                  !validatePhoneNumber(formData.businessPhone)
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
                required
              />
            </div>
            {formData.businessPhone &&
              !validatePhoneNumber(formData.businessPhone) && (
                <p className="text-xs text-red-600">
                  Please enter a valid UK (+44) or India (+91) phone number
                </p>
              )}
          </div>

          {/* Address Selection */}
          <div className="space-y-2">
            <Label htmlFor="addressId" className="text-sm font-medium">
              Business Address *
            </Label>
            {loadingAddresses ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Loading addresses...
                </span>
              </div>
            ) : addresses.length > 0 ? (
              <Select
                value={formData.addressId}
                onValueChange={(value) => handleInputChange("addressId", value)}
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                    <SelectValue placeholder="Select business address" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {addresses.map((address) => (
                    <SelectItem key={address.id} value={address.id}>
                      <div className="flex flex-col text-left">
                        <span className="font-medium">{address.street}</span>
                        <span className="text-xs text-muted-foreground">
                          {address.city}, {address.state} {address.zipCode}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-muted-foreground p-3 border rounded-md">
                No addresses found. Please add an address in your account
                settings first.
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.addressId}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Apply Now
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
