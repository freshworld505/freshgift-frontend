"use client";

import { useEffect, useState } from "react";
import { useCouponStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Gift,
  Ticket,
  Plus,
  RefreshCw,
  Calendar,
  Percent,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Copy,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { UserCoupon } from "@/lib/types";

export default function CouponManagement() {
  const {
    coupons,
    isLoading,
    error,
    fetchCoupons,
    redeemCouponCode,
    getAvailableCoupons,
    getExpiredCoupons,
    getUsedCoupons,
    clearError,
  } = useCouponStore();

  const [redeemCode, setRedeemCode] = useState("");
  const [isRedeemDialogOpen, setIsRedeemDialogOpen] = useState(false);
  const [isRedeemLoading, setIsRedeemLoading] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleRedeemCoupon = async () => {
    if (!redeemCode.trim()) {
      toast({
        title: "Invalid coupon code",
        description: "Please enter a valid coupon code.",
        variant: "destructive",
      });
      return;
    }

    setIsRedeemLoading(true);
    try {
      const result = await redeemCouponCode(redeemCode.trim());
      if (result.success) {
        setRedeemCode("");
        setIsRedeemDialogOpen(false);
        // Refresh the coupons list
        fetchCoupons();
      }
    } catch (error) {
      console.error("Failed to redeem coupon:", error);
    } finally {
      setIsRedeemLoading(false);
    }
  };

  const handleRefresh = () => {
    clearError();
    fetchCoupons();
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: `Coupon code "${code}" copied to clipboard.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDiscount = (coupon: UserCoupon["coupon"]) => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}% OFF`;
    } else {
      return `$${coupon.discountValue} OFF`;
    }
  };

  const CouponCard = ({
    userCoupon,
    status,
  }: {
    userCoupon: UserCoupon;
    status: "available" | "expired" | "used";
  }) => {
    const { coupon } = userCoupon;
    const isExpired = status === "expired";
    const isUsed = status === "used";
    const isAvailable = status === "available";

    return (
      <Card
        className={`transition-all duration-200 hover:shadow-lg ${
          isAvailable
            ? "border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-lime-50/50 dark:from-emerald-950/20 dark:to-lime-950/20"
            : isExpired
            ? "border-red-200 bg-red-50/30 dark:bg-red-950/10 opacity-60"
            : "border-gray-200 bg-gray-50/30 dark:bg-gray-950/10 opacity-60"
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isAvailable
                    ? "bg-emerald-600"
                    : isExpired
                    ? "bg-red-600"
                    : "bg-gray-600"
                }`}
              >
                {isAvailable ? (
                  <Ticket className="h-4 w-4 text-white" />
                ) : isExpired ? (
                  <Clock className="h-4 w-4 text-white" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">
                  {formatDiscount(coupon)}
                </CardTitle>
                {coupon.discountMaxLimit && (
                  <CardDescription className="text-sm">
                    Max discount: ${coupon.discountMaxLimit}
                  </CardDescription>
                )}
              </div>
            </div>
            <Badge
              variant={
                isAvailable
                  ? "default"
                  : isExpired
                  ? "destructive"
                  : "secondary"
              }
              className="text-xs"
            >
              {isAvailable ? "Available" : isExpired ? "Expired" : "Used"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{coupon.description}</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Code:</span>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                  {coupon.code}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyCouponCode(coupon.code)}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Min Order:</span>
              <span className="font-medium">${coupon.minimumOrderValue}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Expires:</span>
              <span
                className={`font-medium ${isExpired ? "text-red-600" : ""}`}
              >
                {formatDate(coupon.expiryDate)}
              </span>
            </div>

            {userCoupon.redeemedAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Used:</span>
                <span className="font-medium text-gray-600">
                  {formatDate(userCoupon.redeemedAt)}
                </span>
              </div>
            )}
          </div>

          {coupon.applicableCategories.length > 0 && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">
                Applicable to:
              </span>
              <div className="flex flex-wrap gap-1">
                {coupon.applicableCategories.slice(0, 3).map((category) => (
                  <Badge key={category} variant="outline" className="text-xs">
                    {category}
                  </Badge>
                ))}
                {coupon.applicableCategories.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{coupon.applicableCategories.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const availableCoupons = getAvailableCoupons();
  const expiredCoupons = getExpiredCoupons();
  const usedCoupons = getUsedCoupons();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Coupons</h2>
          <p className="text-muted-foreground">
            Manage your discount coupons and redeem new ones
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Dialog
            open={isRedeemDialogOpen}
            onOpenChange={setIsRedeemDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Redeem Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Redeem Coupon</DialogTitle>
                <DialogDescription>
                  Enter a coupon code to add it to your collection.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coupon-code">Coupon Code</Label>
                  <Input
                    id="coupon-code"
                    placeholder="Enter coupon code"
                    value={redeemCode}
                    onChange={(e) =>
                      setRedeemCode(e.target.value.toUpperCase())
                    }
                    className="uppercase"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsRedeemDialogOpen(false)}
                  disabled={isRedeemLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRedeemCoupon}
                  disabled={isRedeemLoading || !redeemCode.trim()}
                  className="flex items-center gap-2"
                >
                  {isRedeemLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Gift className="h-4 w-4" />
                  )}
                  Redeem
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-red-600 font-medium">Error loading coupons</p>
              <p className="text-red-600/80 text-sm">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="ml-auto"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Coupons Content */}
      {!isLoading && (
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Available ({availableCoupons.length})
            </TabsTrigger>
            <TabsTrigger value="used" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Used ({usedCoupons.length})
            </TabsTrigger>
            <TabsTrigger value="expired" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Expired ({expiredCoupons.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            {availableCoupons.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {availableCoupons.map((userCoupon) => (
                  <CouponCard
                    key={userCoupon.id}
                    userCoupon={userCoupon}
                    status="available"
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No available coupons
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any available coupons at the moment.
                  </p>
                  <Button onClick={() => setIsRedeemDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Redeem a Coupon
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="used">
            {usedCoupons.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {usedCoupons.map((userCoupon) => (
                  <CouponCard
                    key={userCoupon.id}
                    userCoupon={userCoupon}
                    status="used"
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No used coupons
                  </h3>
                  <p className="text-muted-foreground">
                    You haven't used any coupons yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="expired">
            {expiredCoupons.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {expiredCoupons.map((userCoupon) => (
                  <CouponCard
                    key={userCoupon.id}
                    userCoupon={userCoupon}
                    status="expired"
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No expired coupons
                  </h3>
                  <p className="text-muted-foreground">
                    You don't have any expired coupons.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
