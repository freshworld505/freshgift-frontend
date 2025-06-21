"use client";

import { useState, useEffect } from "react";
import type { Address } from "@/lib/types";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Edit2, Trash2, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  getUserAddresses,
  createAddress,
  deleteAddress,
  updateAddress,
} from "@/api/addressesApi";

const addressSchema = z.object({
  street: z.string().min(3, "Street address is required."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  zipCode: z.string().min(5, "Valid ZIP code is required."),
  country: z.string().min(2, "Country is required."),
  isDefault: z.boolean().optional(),
});

export default function ManageAddresses() {
  const { user, isAuthenticated } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "GB",
      isDefault: false,
    },
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userAddresses = await getUserAddresses();
        setAddresses(userAddresses);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
        toast({
          title: "Error loading addresses",
          description: "Failed to load your saved addresses. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (editingAddress) {
      form.reset(editingAddress);
    } else {
      form.reset({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "GB",
        isDefault: false,
      });
    }
  }, [editingAddress, form, isDialogOpen]);

  const handleAddOrUpdateAddress = async (
    values: z.infer<typeof addressSchema>
  ) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to manage addresses.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingAddress) {
        // Update existing address
        const fullAddress = `${values.street}, ${values.city}, ${values.state} ${values.zipCode}, ${values.country}`;
        const updatedAddress = await updateAddress(
          editingAddress.id,
          fullAddress
        );

        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === editingAddress.id ? updatedAddress : addr
          )
        );

        toast({
          title: "Address updated",
          description: "Your address has been updated successfully.",
        });
      } else {
        // Add new address
        const newAddress = await createAddress(values);
        setAddresses((prev) => [...prev, newAddress]);

        toast({
          title: "Address added",
          description: "Your new address has been saved successfully.",
        });
      }

      setIsDialogOpen(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Failed to save address:", error);
      toast({
        title: "Error saving address",
        description: "Failed to save your address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to manage addresses.",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteAddress(addressId);
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));

      toast({
        title: "Address deleted",
        description: "Your address has been deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast({
        title: "Error deleting address",
        description: "Failed to delete your address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-100">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Authentication Required
            </h3>
            <p className="text-gray-600 mb-8">
              Please log in to manage your delivery addresses
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Loading Addresses
            </h3>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="h-6 bg-gray-100 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Saved Addresses
          </h3>
          <p className="text-gray-600">
            Quick access to your delivery locations
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openAddDialog}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-6"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-2xl font-bold">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {editingAddress
                  ? "Update your delivery address details."
                  : "Enter the details for your new delivery address."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddOrUpdateAddress)}
                className="space-y-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Street Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter your street address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          City
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="City"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          State
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="State"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          ZIP Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="ZIP Code"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Country
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Country"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-gray-200 p-4 bg-gray-50/50">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Set as default address
                        </FormLabel>
                        <p className="text-xs text-gray-500">
                          This will be your primary delivery location
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-6">
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1 sm:flex-initial h-12 rounded-xl border-gray-200 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-initial h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-6"
                    >
                      {isSubmitting
                        ? editingAddress
                          ? "Saving..."
                          : "Adding..."
                        : editingAddress
                        ? "Save Changes"
                        : "Add Address"}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-100">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              No Addresses Added
            </h3>
            <p className="text-gray-600 mb-8">
              Add your first delivery address to make checkout faster and easier
            </p>
            <Button
              onClick={openAddDialog}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-8"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Address
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${
                address.isDefault
                  ? "ring-2 ring-blue-500 shadow-md bg-gradient-to-r from-blue-50/50 to-indigo-50/50"
                  : "border border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          address.isDefault ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      >
                        <MapPin
                          className={`h-5 w-5 ${
                            address.isDefault
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-lg">
                          {address.street}
                        </p>
                        {address.isDefault && (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
                            Default Address
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="ml-13 space-y-1">
                      <p className="text-gray-600">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="text-gray-500 text-sm">{address.country}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(address)}
                      className="rounded-xl border-gray-200 hover:bg-gray-50"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
