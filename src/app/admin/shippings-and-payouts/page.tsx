"use client";

import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Package,
  DollarSign,
  Save,
  RefreshCw,
  Settings,
  AlertCircle,
  CreditCard,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getShippingDetails,
  updateShippingDetails,
  getStripeBalance,
  createStripePayout,
} from "@/api/admin/orderApi";

interface ShippingSettings {
  shippingCharge: number;
  freeShippingThreshold: number;
}

interface StripeBalanceAmount {
  amount: number;
  currency: string;
}

interface StripeTransaction {
  id: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  description: string | null;
  createdAt: string;
  fee: number;
  net: number;
}

interface StripeBalanceData {
  available: StripeBalanceAmount[];
  pending: StripeBalanceAmount[];
  recentTransactions: StripeTransaction[];
}

const Page = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [settings, setSettings] = useState<ShippingSettings>({
    shippingCharge: 0,
    freeShippingThreshold: 0,
  });
  const [formData, setFormData] = useState<ShippingSettings>({
    shippingCharge: 0,
    freeShippingThreshold: 0,
  });
  const [stripeBalance, setStripeBalance] = useState<StripeBalanceData | null>(
    null
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<string>("");
  const [creatingPayout, setCreatingPayout] = useState(false);

  // Fetch current shipping settings
  const fetchShippingSettings = async () => {
    try {
      setLoading(true);
      const response = await getShippingDetails();

      const safeSettings = {
        shippingCharge: Number(response.shippingCharge) || 0,
        freeShippingThreshold: Number(response.freeShippingThreshold) || 0,
      };

      setSettings(safeSettings);
      setFormData(safeSettings);
      setHasChanges(false);

      //console.log("📦 Shipping settings loaded:", safeSettings);
    } catch (error) {
      console.error("❌ Error fetching shipping settings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch shipping settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch Stripe balance
  const fetchStripeBalance = async () => {
    try {
      setBalanceLoading(true);
      const response = await getStripeBalance();

      // Ensure all numeric values are safe
      const safeBalance: StripeBalanceData = {
        available: response.balance.available.map((item) => ({
          amount: Number(item.amount) || 0,
          currency: item.currency,
        })),
        pending: response.balance.pending.map((item) => ({
          amount: Number(item.amount) || 0,
          currency: item.currency,
        })),
        recentTransactions: response.balance.recentTransactions.map((txn) => ({
          ...txn,
          amount: Number(txn.amount) || 0,
          fee: Number(txn.fee) || 0,
          net: Number(txn.net) || 0,
        })),
      };

      setStripeBalance(safeBalance);
      //console.log("💳 Stripe balance loaded:", safeBalance);
    } catch (error) {
      console.error("❌ Error fetching Stripe balance:", error);
      toast({
        title: "Error",
        description: "Failed to fetch payout information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBalanceLoading(false);
    }
  };

  // Update shipping settings
  const handleUpdateSettings = async () => {
    try {
      setUpdating(true);

      // Validate form data
      const validatedData = {
        shippingCharge: Number(formData.shippingCharge) || 0,
        freeShippingThreshold: Number(formData.freeShippingThreshold) || 0,
      };

      if (validatedData.shippingCharge < 0) {
        toast({
          title: "Validation Error",
          description: "Shipping charge cannot be negative.",
          variant: "destructive",
        });
        return;
      }

      if (validatedData.freeShippingThreshold < 0) {
        toast({
          title: "Validation Error",
          description: "Free shipping threshold cannot be negative.",
          variant: "destructive",
        });
        return;
      }

      await updateShippingDetails(validatedData);

      setSettings(validatedData);
      setHasChanges(false);

      toast({
        title: "Success",
        description: "Shipping settings updated successfully!",
        variant: "default",
      });

      //console.log("✅ Shipping settings updated:", validatedData);
    } catch (error) {
      console.error("❌ Error updating shipping settings:", error);
      toast({
        title: "Error",
        description: "Failed to update shipping settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof ShippingSettings, value: string) => {
    const numericValue = parseFloat(value) || 0;
    const newFormData = { ...formData, [field]: numericValue };
    setFormData(newFormData);

    // Check if there are changes
    const changed =
      newFormData.shippingCharge !== settings.shippingCharge ||
      newFormData.freeShippingThreshold !== settings.freeShippingThreshold;
    setHasChanges(changed);
  };

  // Reset form to current settings
  const handleReset = () => {
    setFormData(settings);
    setHasChanges(false);
  };

  // Handle manual payout
  const handleCreatePayout = async () => {
    try {
      setCreatingPayout(true);

      const amount = parseFloat(payoutAmount);

      if (isNaN(amount) || amount <= 1) {
        toast({
          title: "Validation Error",
          description: "Payout amount must be greater than £1.00",
          variant: "destructive",
        });
        return;
      }

      const availableBalance = stripeBalance?.available[0]?.amount || 0;
      if (amount > availableBalance) {
        toast({
          title: "Insufficient Balance",
          description: `Cannot payout £${amount.toFixed(
            2
          )}. Available balance is £${availableBalance.toFixed(2)}`,
          variant: "destructive",
        });
        return;
      }

      await createStripePayout(amount, "gbp");

      toast({
        title: "Payout Created",
        description: `Successfully created payout of £${amount.toFixed(2)}`,
        variant: "default",
      });

      // Reset form and refresh balance
      setPayoutAmount("");
      fetchStripeBalance();

      //console.log(`✅ Payout created: £${amount.toFixed(2)}`);
    } catch (error: any) {
      console.error("❌ Error creating payout:", error);
      toast({
        title: "Payout Failed",
        description:
          error.message || "Failed to create payout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreatingPayout(false);
    }
  };

  useEffect(() => {
    fetchShippingSettings();
    fetchStripeBalance();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shipping & Payouts
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Loading shipping settings...
          </p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Shipping & Payouts
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Manage shipping costs, delivery settings, and payout
              configurations
            </p>
          </div>

          <Button
            onClick={() => {
              fetchShippingSettings();
              fetchStripeBalance();
            }}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled={loading || updating || balanceLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading || balanceLoading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Current Settings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-500" />
              Shipping Charge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{settings.shippingCharge.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Standard delivery fee
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4 text-green-500" />
              Free Shipping Threshold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{settings.freeShippingThreshold.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Minimum order for free delivery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-500" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Shipping settings are live
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Shipping Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Shipping Configuration
          </CardTitle>
          <CardDescription>
            Update shipping charges and free delivery thresholds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Shipping Charge Setting */}
          <div className="space-y-3">
            <Label htmlFor="shippingCharge" className="text-sm font-medium">
              Standard Shipping Charge (£)
            </Label>
            <Input
              id="shippingCharge"
              type="number"
              step="0.01"
              min="0"
              value={formData.shippingCharge}
              onChange={(e) =>
                handleInputChange("shippingCharge", e.target.value)
              }
              placeholder="Enter shipping charge"
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground">
              The standard delivery fee charged to customers when their order
              doesn't qualify for free shipping.
            </p>
          </div>

          <Separator />

          {/* Free Shipping Threshold */}
          <div className="space-y-3">
            <Label
              htmlFor="freeShippingThreshold"
              className="text-sm font-medium"
            >
              Free Shipping Threshold (£)
            </Label>
            <Input
              id="freeShippingThreshold"
              type="number"
              step="0.01"
              min="0"
              value={formData.freeShippingThreshold}
              onChange={(e) =>
                handleInputChange("freeShippingThreshold", e.target.value)
              }
              placeholder="Enter minimum order value"
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground">
              Orders above this amount qualify for free shipping. Set to 0 to
              always charge shipping.
            </p>
          </div>

          <Separator />

          {/* Preview & Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Shipping Preview
                </p>
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <p>
                    • Orders under £{formData.freeShippingThreshold.toFixed(2)}{" "}
                    will be charged £{formData.shippingCharge.toFixed(2)} for
                    shipping
                  </p>
                  <p>
                    • Orders of £{formData.freeShippingThreshold.toFixed(2)} or
                    more qualify for free shipping
                  </p>
                  {formData.freeShippingThreshold === 0 && (
                    <p className="font-medium">
                      • All orders will be charged £
                      {formData.shippingCharge.toFixed(2)} for shipping
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              onClick={handleUpdateSettings}
              disabled={!hasChanges || updating}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {updating ? "Updating..." : "Save Changes"}
            </Button>

            {hasChanges && (
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={updating}
              >
                Reset
              </Button>
            )}

            {hasChanges && (
              <Badge variant="secondary" className="ml-auto">
                Unsaved Changes
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stripe Balance & Payouts Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Stripe Balance & Payouts
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Monitor your Stripe account balance and recent transactions
          </p>
        </div>

        {balanceLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded w-full"></div>
          </div>
        ) : stripeBalance ? (
          <>
            {/* Balance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Available Balance */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-green-500" />
                    Available Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    £{(stripeBalance.available[0]?.amount || 0).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ready for payout
                  </p>
                </CardContent>
              </Card>

              {/* Pending Balance */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    Pending Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    £{(stripeBalance.pending[0]?.amount || 0).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Processing transactions
                  </p>
                </CardContent>
              </Card>

              {/* Total Transactions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {stripeBalance.recentTransactions.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last few transactions
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Manual Payout Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Manual Payout
                </CardTitle>
                <CardDescription>
                  Create a manual payout from your available balance (minimum
                  £1.00)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="payoutAmount">Payout Amount (£)</Label>
                      <Input
                        id="payoutAmount"
                        type="number"
                        placeholder="Enter amount (min £1.00)"
                        value={payoutAmount}
                        onChange={(e) => setPayoutAmount(e.target.value)}
                        min="1"
                        step="0.01"
                        disabled={creatingPayout}
                      />
                      <p className="text-xs text-muted-foreground">
                        Available balance: £
                        {(stripeBalance?.available[0]?.amount || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={handleCreatePayout}
                        disabled={
                          !payoutAmount ||
                          parseFloat(payoutAmount) <= 1 ||
                          parseFloat(payoutAmount) >
                            (stripeBalance?.available[0]?.amount || 0) ||
                          creatingPayout
                        }
                        className="w-full flex items-center gap-2"
                      >
                        <DollarSign className="h-4 w-4" />
                        {creatingPayout
                          ? "Creating Payout..."
                          : "Create Payout"}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                        <p className="font-medium">Payout Information:</p>
                        <ul className="text-xs space-y-1 ml-2">
                          <li>• Minimum payout amount is £1.00</li>
                          <li>
                            • Payouts typically arrive in 1-2 business days
                          </li>
                          <li>• Stripe may charge fees for manual payouts</li>
                          <li>• Cannot exceed your available balance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>
                  Latest payment transactions from your Stripe account
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stripeBalance.recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {stripeBalance.recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-300"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              Transaction #{transaction.id.slice(-8)}
                            </p>
                            <Badge
                              variant={
                                transaction.status === "available"
                                  ? "default"
                                  : transaction.status === "pending"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {transaction.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {transaction.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {new Date(transaction.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            £{transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Fee: £{transaction.fee.toFixed(2)}
                          </p>
                          <p className="text-sm font-medium text-green-600">
                            Net: £{transaction.net.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      No recent transactions found
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Failed to load payout information
              </p>
              <Button
                onClick={fetchStripeBalance}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Page;
