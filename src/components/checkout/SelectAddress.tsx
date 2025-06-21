"use client";

import { useState, useEffect } from "react";
import { Plus, MapPin, Check, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Address } from "@/lib/types";
import { getUserAddresses, createAddress } from "@/api/addressesApi";
import { useAuthStore } from "@/lib/store";
import { toast } from "@/hooks/use-toast";

// Address schema for new address form
const addressSchema = z.object({
  street: z.string().min(3, "Street address is required."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  zipCode: z.string().min(5, "Valid ZIP code is required."),
  country: z.string().min(2, "Country is required."),
  landmark: z.string().optional(),
  isDefault: z.boolean().optional(),
});

interface SelectAddressProps {
  selectedAddress: Address | null;
  onAddressSelect: (address: Address) => void;
  onAddressChange: (formData: {
    fullName: string;
    streetAddress: string;
    city: string;
    zipCode: string;
    country: string;
  }) => void;
  className?: string;
}

export default function SelectAddress({
  selectedAddress,
  onAddressSelect,
  onAddressChange,
  className = "",
}: SelectAddressProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(!isAuthenticated);

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "GB",
      landmark: "",
      isDefault: false,
    },
  });

  // Fetch user addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        setUseNewAddress(true);
        return;
      }

      try {
        const userAddresses = await getUserAddresses();
        setAddresses(userAddresses);

        // Auto-select default address if available
        const defaultAddress = userAddresses.find((addr) => addr.isDefault);
        if (defaultAddress && !selectedAddress) {
          onAddressSelect(defaultAddress);
          setUseNewAddress(false);
        } else if (userAddresses.length === 0) {
          setUseNewAddress(true);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
        toast({
          title: "Failed to load addresses",
          description: "Please try again or add a new address.",
          variant: "destructive",
        });
        setUseNewAddress(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [isAuthenticated, selectedAddress, onAddressSelect]);

  // Handle address selection
  const handleAddressSelect = (address: Address) => {
    onAddressSelect(address);
    setUseNewAddress(false);

    // Update the form data for checkout
    onAddressChange({
      fullName: user?.name || "",
      streetAddress: address.street,
      city: address.city,
      zipCode: address.zipCode,
      country: address.country,
    });
  };

  // Handle new address option
  const handleUseNewAddress = () => {
    setUseNewAddress(true);
    onAddressSelect({} as Address); // Clear selected address
  };

  // Handle new address creation
  const handleCreateAddress = async (values: z.infer<typeof addressSchema>) => {
    try {
      const newAddress = await createAddress(values);
      setAddresses((prev) => [...prev, newAddress]);
      setIsDialogOpen(false);

      // Auto-select the new address
      handleAddressSelect(newAddress);

      toast({
        title: "Address created successfully",
        description: "Your new address has been saved and selected.",
      });

      form.reset();
    } catch (error) {
      console.error("Failed to create address:", error);
      toast({
        title: "Failed to create address",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-3 pb-4 border-b border-emerald-100 dark:border-emerald-800">
          <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
            <MapPin className="h-3 w-3 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            Delivery Address
          </h3>
        </div>

        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-100 rounded-xl animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-3 pb-4 border-b border-emerald-100 dark:border-emerald-800">
        <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
          <MapPin className="h-3 w-3 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          Delivery Address
        </h3>
      </div>

      {/* Address Selection */}
      <div className="space-y-4">
        {/* Saved Addresses */}
        {isAuthenticated && addresses.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Choose from saved addresses:
            </h4>
            <div className="grid gap-3">
              {addresses.map((address) => (
                <Card
                  key={address.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedAddress?.id === address.id && !useNewAddress
                      ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  }`}
                  onClick={() => handleAddressSelect(address)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center mt-1">
                          {selectedAddress?.id === address.id &&
                          !useNewAddress ? (
                            <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">
                              {address.street}
                            </p>
                            {address.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {address.city}, {address.state} {address.zipCode},{" "}
                            {address.country}
                          </p>
                          {address.landmark && (
                            <p className="text-xs text-muted-foreground">
                              Near: {address.landmark}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Use New Address Option */}
        {isAuthenticated && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Or use a new address:
            </h4>
            <Card
              className={`cursor-pointer transition-all duration-200 ${
                useNewAddress
                  ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                  : "hover:bg-gray-50 dark:hover:bg-gray-900/50"
              }`}
              onClick={handleUseNewAddress}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center">
                    {useNewAddress ? (
                      <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium text-sm">Use new address</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Save New Address Button */}
        {isAuthenticated && useNewAddress && (
          <div className="pt-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Save this address for future use
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Save New Address</DialogTitle>
                  <DialogDescription>
                    Save this address to your account for faster checkout next
                    time.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleCreateAddress)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="123 Main Street"
                              className="rounded-xl"
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
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="City"
                                className="rounded-xl"
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
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="State"
                                className="rounded-xl"
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
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="12345"
                                className="rounded-xl"
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
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="GB"
                                className="rounded-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="landmark"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Landmark (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Near shopping mall, etc."
                              className="rounded-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isDefault"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Set as default address</FormLabel>
                            <p className="text-xs text-muted-foreground">
                              This will be your primary delivery location
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="rounded-xl"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="rounded-xl">
                        Save Address
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Guest User Notice */}
        {!isAuthenticated && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Checkout as Guest
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  You're checking out as a guest. Sign up to save addresses for
                  faster checkout.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
