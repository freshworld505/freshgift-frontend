"use client";

import SaveCardForm from "@/components/checkout/SaveCardForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState, useEffect, useMemo } from "react";
import { useAllProducts } from "@/hooks/use-products";
import { Product } from "@/lib/types";
import Image from "next/image";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Search,
  CreditCard,
  Repeat,
  MapPin,
  Package,
  Play,
  Pause,
  X,
  Calendar,
  Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  saveCardDetailsForRecurringOrders,
  createRecurringOrder,
  getAllRecurringOrders,
  pauseRecurringOrder,
  resumeRecurringOrder,
  cancelRecurringOrder,
} from "@/api/orderApi";
import { getUserAddresses } from "@/api/addressesApi";
import { Address } from "@/lib/types";

// Local storage key for temp cart
const TEMP_CART_KEY = "recurring-orders-temp-cart";

// Temp cart item type
type TempCartItem = {
  product: Product;
  quantity: number;
};

// Recurring order type (based on API response)
type RecurringOrder = {
  id: string;
  frequency: string;
  dayOfWeek: number;
  nextRunAt: string;
  isActive: boolean;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    product: {
      id: string;
      productName: string;
      productImages: string[];
      finalPrice: number;
    };
  }[];
  address: {
    addressId: string;
    label: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
};

export default function RecurringOrdersPage() {
  const [showCardForm, setShowCardForm] = useState(false);
  const [tempCart, setTempCart] = useState<TempCartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [frequency, setFrequency] = useState("Weekly");
  const [dayOfWeek, setDayOfWeek] = useState(1); // Monday
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [recurringOrders, setRecurringOrders] = useState<RecurringOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Fetch products
  const { data: products = [], isLoading, error } = useAllProducts(1, 100);

  // Load temp cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(TEMP_CART_KEY);
    if (savedCart) {
      try {
        setTempCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading temp cart:", error);
      }
    }
  }, []);

  // Save temp cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(TEMP_CART_KEY, JSON.stringify(tempCart));
  }, [tempCart]);

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const userAddresses = await getUserAddresses();
        setAddresses(userAddresses);

        // Auto-select default address if available
        const defaultAddress = userAddresses.find((addr) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else if (userAddresses.length > 0) {
          // If no default, select first address
          setSelectedAddressId(userAddresses[0].id);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        toast({
          title: "Error loading addresses",
          description:
            "Failed to load your saved addresses. Please add an address first.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  // Fetch recurring orders
  useEffect(() => {
    const fetchRecurringOrders = async () => {
      try {
        setIsLoadingOrders(true);
        const orders = await getAllRecurringOrders();
        setRecurringOrders(orders as unknown as RecurringOrder[]);
      } catch (error) {
        console.error("Error fetching recurring orders:", error);
        toast({
          title: "Error loading orders",
          description: "Failed to load your recurring orders.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchRecurringOrders();
  }, []);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    return products.filter(
      (product: Product) =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Calculate temp cart totals
  const cartTotals = useMemo(() => {
    const subtotal = tempCart.reduce(
      (sum, item) => sum + item.product.finalPrice * item.quantity,
      0
    );
    const totalItems = tempCart.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, totalItems };
  }, [tempCart]);

  // Add to temp cart function
  const addToTempCart = (product: Product) => {
    setTempCart((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        // Increase quantity if already in cart
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        return [...prev, { product, quantity: 1 }];
      }
    });
    toast({
      title: "Added to recurring order",
      description: `${product.productName} added to your recurring order list.`,
    });
  };

  // Update quantity in temp cart
  const updateTempCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      setTempCart((prev) =>
        prev.filter((item) => item.product.id !== productId)
      );
    } else {
      setTempCart((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  // Remove from temp cart
  const removeFromTempCart = (productId: string) => {
    setTempCart((prev) => prev.filter((item) => item.product.id !== productId));
    toast({
      title: "Item removed",
      description: "Item removed from recurring order list.",
    });
  };

  // Clear temp cart
  const clearTempCart = () => {
    setTempCart([]);
    toast({
      title: "Cart cleared",
      description: "All items removed from recurring order list.",
    });
  };

  // Get quantity of product in temp cart
  const getTempCartQuantity = (productId: string) => {
    const item = tempCart.find((item) => item.product.id === productId);
    return item?.quantity || 0;
  };

  // Handle card save success
  const handleCardSaveSuccess = async (paymentMethodId: string) => {
    try {
      // Validate address selection
      if (!selectedAddressId) {
        toast({
          title: "Address Required",
          description: "Please select a delivery address before proceeding.",
          variant: "destructive",
        });
        return;
      }

      // Show loading state
      toast({
        title: "Processing...",
        description: "Setting up your recurring order...",
      });

      // Save card details for recurring orders
      const stripeCustomerId = await saveCardDetailsForRecurringOrders(
        paymentMethodId
      );
      console.log("Stripe Customer ID:", stripeCustomerId);

      // Prepare recurring order data
      const recurringOrderData = {
        items: tempCart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        frequency: frequency,
        dayOfWeek: dayOfWeek,
        addressId: selectedAddressId,
        paymentMethodId: paymentMethodId,
      };

      // Create recurring order
      const result = await createRecurringOrder(recurringOrderData);
      console.log("Recurring order created:", result);

      // Success feedback
      toast({
        title: "Recurring Order Created!",
        description: "Your recurring order has been set up successfully.",
      });

      // Clear temp cart and close form
      clearTempCart();
      setShowCardForm(false);

      // Switch to a success view or redirect
      setActiveTab("cart");
    } catch (error) {
      console.error("Error creating recurring order:", error);
      toast({
        title: "Error",
        description: "Failed to create recurring order. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle pause recurring order
  const handlePauseOrder = async (orderId: string) => {
    try {
      await pauseRecurringOrder(orderId);

      // Update local state
      setRecurringOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, isActive: false } : order
        )
      );

      toast({
        title: "Order Paused",
        description: "Your recurring order has been paused successfully.",
      });
    } catch (error) {
      console.error("Error pausing order:", error);
      toast({
        title: "Error",
        description: "Failed to pause recurring order. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle resume recurring order
  const handleResumeOrder = async (orderId: string) => {
    try {
      await resumeRecurringOrder(orderId);

      // Update local state
      setRecurringOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, isActive: true } : order
        )
      );

      toast({
        title: "Order Resumed",
        description: "Your recurring order has been resumed successfully.",
      });
    } catch (error) {
      console.error("Error resuming order:", error);
      toast({
        title: "Error",
        description: "Failed to resume recurring order. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle cancel recurring order
  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelRecurringOrder(orderId);

      // Remove from local state
      setRecurringOrders((prev) =>
        prev.filter((order) => order.id !== orderId)
      );

      toast({
        title: "Order Cancelled",
        description: "Your recurring order has been cancelled successfully.",
      });
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error",
        description: "Failed to cancel recurring order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Recurring Orders
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Manage your recurring orders for a seamless shopping experience
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger
            value="products"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Browse Products</span>
            <span className="sm:hidden">Products</span>
            <span className="text-xs">({filteredProducts.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="cart"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Recurring Cart</span>
            <span className="sm:hidden">Cart</span>
            <span className="text-xs">({cartTotals.totalItems})</span>
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
          >
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">My Orders</span>
            <span className="sm:hidden">Orders</span>
            <span className="text-xs">({recurringOrders.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4 sm:space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-32 sm:h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-2 sm:p-4">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 sm:h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-red-500 text-sm sm:text-base px-4">
                Error loading products:{" "}
                {error.message || "Something went wrong"}
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-sm sm:text-base">
                No products found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product: Product) => {
                const tempCartQuantity = getTempCartQuantity(product.id);
                const isInStock = (product.stock ?? 0) > 0;

                return (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Product Image */}
                    <div className="relative h-32 sm:h-48">
                      <Image
                        src={
                          product.productImages?.[0] ||
                          "/placeholder-product.jpg"
                        }
                        alt={product.productName}
                        fill
                        className={`object-cover ${
                          !isInStock ? "grayscale" : ""
                        }`}
                      />
                      {!isInStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="destructive" className="text-xs">
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-2 sm:p-4">
                      <h3 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2">
                        {product.productName}
                      </h3>
                      <Badge variant="outline" className="mb-1 sm:mb-2 text-xs">
                        {product.category}
                      </Badge>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                        <div className="mb-1 sm:mb-0">
                          <span className="text-sm sm:text-lg font-bold text-green-600">
                            £{product.finalPrice.toFixed(2)}
                          </span>
                          {product.actualPrice > product.finalPrice && (
                            <span className="text-xs sm:text-sm text-gray-500 line-through ml-1 sm:ml-2 block sm:inline">
                              £{product.actualPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Controls */}
                      {isInStock && (
                        <div className="space-y-1 sm:space-y-2">
                          {tempCartQuantity === 0 ? (
                            <Button
                              onClick={() => addToTempCart(product)}
                              className="w-full bg-green-600 hover:bg-green-700 text-xs sm:text-sm h-7 sm:h-9"
                              size="sm"
                            >
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden sm:inline">
                                Add to Recurring
                              </span>
                              <span className="sm:hidden">Add</span>
                            </Button>
                          ) : (
                            <div className="flex items-center justify-between bg-green-50 rounded-lg p-1 sm:p-3">
                              <Button
                                onClick={() =>
                                  updateTempCartQuantity(
                                    product.id,
                                    tempCartQuantity - 1
                                  )
                                }
                                variant="outline"
                                size="sm"
                                className="h-6 w-6 sm:h-9 sm:w-9 p-0 hover:bg-white"
                              >
                                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <span className="font-semibold px-1 sm:px-4 text-xs sm:text-lg">
                                {tempCartQuantity}
                              </span>
                              <Button
                                onClick={() =>
                                  updateTempCartQuantity(
                                    product.id,
                                    tempCartQuantity + 1
                                  )
                                }
                                variant="outline"
                                size="sm"
                                className="h-6 w-6 sm:h-9 sm:w-9 p-0 hover:bg-white"
                                disabled={
                                  tempCartQuantity >= (product.stock ?? 0)
                                }
                              >
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Cart Tab */}
        <TabsContent value="cart" className="space-y-4 sm:space-y-6">
          {tempCart.length === 0 ? (
            <Card className="text-center py-8 sm:py-12">
              <CardContent>
                <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  Your recurring cart is empty
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4 px-4">
                  Add products to create your recurring order
                </p>
                <Button
                  onClick={() => setActiveTab("products")}
                  variant="outline"
                  size="sm"
                >
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Cart Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Recurring Order Items ({cartTotals.totalItems})
                </h3>
                <Button
                  onClick={clearTempCart}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 self-start sm:self-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>

              {/* Cart Items */}
              <div className="space-y-3 sm:space-y-4">
                {tempCart.map((item) => (
                  <Card key={item.product.id}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
                            <Image
                              src={
                                item.product.productImages?.[0] ||
                                "/placeholder-product.jpg"
                              }
                              alt={item.product.productName}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm sm:text-base">
                              {item.product.productName}
                            </h4>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {item.product.category}
                            </Badge>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                              £{item.product.finalPrice.toFixed(2)} each
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() =>
                                updateTempCartQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                            >
                              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <span className="font-semibold w-6 sm:w-8 text-center text-sm sm:text-base">
                              {item.quantity}
                            </span>
                            <Button
                              onClick={() =>
                                updateTempCartQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                              disabled={
                                item.quantity >= (item.product.stock ?? 0)
                              }
                            >
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm sm:text-base">
                              £
                              {(
                                item.product.finalPrice * item.quantity
                              ).toFixed(2)}
                            </p>
                            <Button
                              onClick={() =>
                                removeFromTempCart(item.product.id)
                              }
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 p-1 mt-1"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Cart Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Repeat className="h-4 w-4 sm:h-5 sm:w-5" />
                    Recurring Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Delivery Schedule */}
                  <div className="space-y-4 border-b pb-4">
                    <h4 className="font-semibold text-sm sm:text-base">
                      Delivery Schedule
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium">
                          Frequency
                        </label>
                        <Select value={frequency} onValueChange={setFrequency}>
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium">
                          Day of Week
                        </label>
                        <Select
                          value={dayOfWeek.toString()}
                          onValueChange={(value) =>
                            setDayOfWeek(parseInt(value))
                          }
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Monday</SelectItem>
                            <SelectItem value="2">Tuesday</SelectItem>
                            <SelectItem value="3">Wednesday</SelectItem>
                            <SelectItem value="4">Thursday</SelectItem>
                            <SelectItem value="5">Friday</SelectItem>
                            <SelectItem value="6">Saturday</SelectItem>
                            <SelectItem value="0">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Address Selection */}
                    <div>
                      <label className="text-xs sm:text-sm font-medium">
                        Delivery Address
                      </label>
                      {isLoadingAddresses ? (
                        <div className="mt-2 p-3 border rounded-lg bg-gray-50">
                          <p className="text-xs sm:text-sm text-gray-500">
                            Loading addresses...
                          </p>
                        </div>
                      ) : addresses.length === 0 ? (
                        <div className="mt-2 p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                          <div className="flex items-center gap-2 text-yellow-700">
                            <MapPin className="h-4 w-4" />
                            <p className="text-xs sm:text-sm">
                              No addresses found
                            </p>
                          </div>
                          <p className="text-xs text-yellow-600 mt-1">
                            Please add an address in your{" "}
                            <a
                              href="/account/addresses"
                              className="underline font-medium"
                            >
                              Account Settings
                            </a>{" "}
                            before setting up recurring orders.
                          </p>
                        </div>
                      ) : (
                        <Select
                          value={selectedAddressId}
                          onValueChange={setSelectedAddressId}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Select delivery address" />
                          </SelectTrigger>
                          <SelectContent>
                            {addresses.map((address) => (
                              <SelectItem key={address.id} value={address.id}>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <div>
                                    <div className="font-medium text-sm">
                                      {address.street}, {address.city}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {address.state} {address.zipCode}
                                      {address.isDefault && (
                                        <span className="ml-2 text-green-600 font-medium">
                                          (Default)
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between text-sm sm:text-lg">
                    <span>Total Items:</span>
                    <span className="font-semibold">
                      {cartTotals.totalItems}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg sm:text-xl font-bold border-t pt-4">
                    <span>Total Amount:</span>
                    <span className="text-green-600">
                      £{cartTotals.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    This amount will be charged {frequency.toLowerCase()} on{" "}
                    {
                      [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ][dayOfWeek]
                    }
                  </p>

                  {/* Add Card Details Button */}
                  <Button
                    onClick={() => setShowCardForm(true)}
                    disabled={!selectedAddressId || addresses.length === 0}
                    className="w-full bg-green-600 hover:bg-green-700 h-10 sm:h-12 text-sm sm:text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="hidden sm:inline">
                      Add Card Details & Setup Recurring Order
                    </span>
                    <span className="sm:hidden">Setup Recurring Order</span>
                  </Button>

                  {!selectedAddressId && addresses.length > 0 && (
                    <p className="text-xs sm:text-sm text-red-600 text-center">
                      Please select a delivery address to continue
                    </p>
                  )}

                  {addresses.length === 0 && !isLoadingAddresses && (
                    <p className="text-xs sm:text-sm text-red-600 text-center px-2">
                      Please add an address in your account settings before
                      setting up recurring orders
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* My Orders Tab */}
        <TabsContent value="orders" className="space-y-4 sm:space-y-6">
          {isLoadingOrders ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4 sm:p-6">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recurringOrders.length === 0 ? (
            <Card className="text-center py-8 sm:py-12">
              <CardContent>
                <Package className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  No recurring orders found
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4 px-4">
                  Create your first recurring order to see it here
                </p>
                <Button
                  onClick={() => setActiveTab("products")}
                  variant="outline"
                  size="sm"
                >
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Orders Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-semibold">
                  My Recurring Orders ({recurringOrders.length})
                </h3>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {recurringOrders.map((order) => {
                  const orderTotal = order.items.reduce(
                    (sum, item) =>
                      sum + item.product.finalPrice * item.quantity,
                    0
                  );
                  const nextDelivery = new Date(order.nextRunAt);
                  const dayNames = [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ];

                  return (
                    <Card
                      key={order.id}
                      className={`${!order.isActive ? "opacity-75" : ""}`}
                    >
                      <CardHeader className="pb-3 sm:pb-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="flex-1">
                            <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-base sm:text-lg">
                              <div className="flex items-center gap-2">
                                <Repeat className="h-4 w-4 sm:h-5 sm:w-5" />
                                {order.frequency} Order
                              </div>
                              <div className="flex gap-2">
                                {!order.isActive && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Paused
                                  </Badge>
                                )}
                                {order.isActive && (
                                  <Badge
                                    variant="default"
                                    className="bg-green-100 text-green-800 text-xs"
                                  >
                                    Active
                                  </Badge>
                                )}
                              </div>
                            </CardTitle>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                Every {dayNames[order.dayOfWeek]}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                Next: {nextDelivery.toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                                {order.address.city}, {order.address.pincode}
                              </div>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-base sm:text-lg font-bold text-green-600">
                              £{orderTotal.toFixed(2)}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              per delivery
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Order Items */}
                        <div>
                          <h4 className="font-medium mb-3 text-sm sm:text-base">
                            Items ({order.items.length})
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                                  <Image
                                    src={
                                      item.product.productImages?.[0] ||
                                      "/placeholder-product.jpg"
                                    }
                                    alt={item.product.productName}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-xs sm:text-sm truncate">
                                    {item.product.productName}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Qty: {item.quantity} × £
                                    {item.product.finalPrice.toFixed(2)}
                                  </p>
                                </div>
                                <div className="text-xs sm:text-sm font-medium">
                                  £
                                  {(
                                    item.quantity * item.product.finalPrice
                                  ).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery Address */}
                        <div>
                          <h4 className="font-medium mb-2 text-sm sm:text-base">
                            Delivery Address
                          </h4>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-gray-500" />
                              <div>
                                <p className="font-medium text-xs sm:text-sm">
                                  {order.address.label}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {order.address.addressLine}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {order.address.city}, {order.address.state}{" "}
                                  {order.address.pincode}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                          {order.isActive ? (
                            <Button
                              onClick={() => handlePauseOrder(order.id)}
                              variant="outline"
                              size="sm"
                              className="flex items-center justify-center gap-2 text-xs sm:text-sm"
                            >
                              <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                              Pause Order
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleResumeOrder(order.id)}
                              variant="outline"
                              size="sm"
                              className="flex items-center justify-center gap-2 text-green-600 border-green-600 hover:bg-green-50 text-xs sm:text-sm"
                            >
                              <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                              Resume Order
                            </Button>
                          )}
                          <Button
                            onClick={() => handleCancelOrder(order.id)}
                            variant="outline"
                            size="sm"
                            className="flex items-center justify-center gap-2 text-red-600 border-red-600 hover:bg-red-50 text-xs sm:text-sm"
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                            Cancel Order
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Save Card Form Modal */}
      {showCardForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md mx-4">
            <SaveCardForm
              onClose={() => setShowCardForm(false)}
              onSuccess={handleCardSaveSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
