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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Ticket,
  Calendar,
  Percent,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getAllCoupons,
  createCoupon,
  assignCouponToAllUsers,
  assignCouponToUserArray,
} from "@/api/admin/couponAdminApi";
import { getTopUsersForCoupons } from "@/api/admin/usersApi";
import { PRODUCT_CATEGORIES } from "@/lib/types";

type Coupon = {
  couponId: string;
  code: string;
  description: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  discountMaxLimit?: number;
  expiryDate: string;
  minimumOrderValue: number;
  applicableCategories: string[];
  status: "active" | "inactive" | "expired";
  usageLimitPerUser: number;
  usageLimitGlobal: number;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
};

type TopUser = {
  userId: string;
  name: string;
  email: string;
  phone: string | "";
  totalOrders: number;
};

type CreateCouponData = {
  code: string;
  description: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  discountMaxLimit?: number;
  expiryDate: string;
  minimumOrderValue?: number;
  applicableCategories?: string[];
  usageLimitPerUser?: number;
  usageLimitGlobal?: number;
};

export default function AdminCoupons() {
  const { toast } = useToast();

  // State for coupons
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State for top users
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // Form state for creating coupon
  const [formData, setFormData] = useState<CreateCouponData>({
    code: "",
    description: "",
    discountType: "percentage", // Default to "percentage"
    discountValue: 0,
    discountMaxLimit: undefined,
    expiryDate: "",
    minimumOrderValue: 0,
    applicableCategories: [],
    usageLimitPerUser: 1,
    usageLimitGlobal: 100,
  });

  // Fetch coupons on component mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getAllCoupons();
      setCoupons(data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast({
        title: "Error",
        description: "Failed to fetch coupons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async () => {
    try {
      if (!formData.code || !formData.description || !formData.expiryDate) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      await createCoupon(formData);

      toast({
        title: "Success",
        description: "Coupon created successfully",
      });

      setCreateModalOpen(false);
      resetForm();
      fetchCoupons();
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast({
        title: "Error",
        description: "Failed to create coupon",
        variant: "destructive",
      });
    }
  };

  const handleAssignToAllUsers = async (couponCode: string) => {
    try {
      await assignCouponToAllUsers(couponCode);

      toast({
        title: "Success",
        description: `Coupon ${couponCode} assigned to all users`,
      });

      setAssignModalOpen(false);
      setSelectedCoupon(null);
    } catch (error) {
      console.error("Error assigning coupon:", error);
      toast({
        title: "Error",
        description: "Failed to assign coupon to all users",
        variant: "destructive",
      });
    }
  };

  const fetchTopUsers = async () => {
    try {
      setLoadingUsers(true);
      const users = await getTopUsersForCoupons();
      setTopUsers(users);
    } catch (error) {
      console.error("Error fetching top users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch top users",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAssignToSelectedUsers = async (couponCode: string) => {
    try {
      if (selectedUserIds.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one user",
          variant: "destructive",
        });
        return;
      }

      await assignCouponToUserArray(selectedUserIds, couponCode);

      toast({
        title: "Success",
        description: `Coupon ${couponCode} assigned to ${selectedUserIds.length} selected users`,
      });

      setAssignModalOpen(false);
      setSelectedCoupon(null);
      setSelectedUserIds([]);
    } catch (error) {
      console.error("Error assigning coupon to selected users:", error);
      toast({
        title: "Error",
        description: "Failed to assign coupon to selected users",
        variant: "destructive",
      });
    }
  };

  const handleUserSelection = (userId: string, checked: boolean) => {
    setSelectedUserIds((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

  const handleSelectAllUsers = (checked: boolean) => {
    setSelectedUserIds(checked ? topUsers.map((user) => user.userId) : []);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 0,
      discountMaxLimit: undefined,
      expiryDate: "",
      minimumOrderValue: 0,
      applicableCategories: [],
      usageLimitPerUser: 1,
      usageLimitGlobal: 100,
    });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      applicableCategories: checked
        ? [...(prev.applicableCategories || []), category]
        : (prev.applicableCategories || []).filter((c) => c !== category),
    }));
  };

  // Remove duplicates and keep the latest coupon by createdAt
  const uniqueCoupons = coupons.reduce((acc, coupon) => {
    const existingCoupon = acc.find((c) => c.couponId === coupon.couponId);
    if (!existingCoupon) {
      acc.push(coupon);
    } else {
      // Keep the one with the latest createdAt
      if (new Date(coupon.createdAt) > new Date(existingCoupon.createdAt)) {
        const index = acc.findIndex((c) => c.couponId === coupon.couponId);
        acc[index] = coupon;
      }
    }
    return acc;
  }, [] as Coupon[]);

  // Filter out incomplete coupons that don't have essential data
  const validCoupons = uniqueCoupons.filter((coupon) => {
    return (
      coupon.code &&
      coupon.description &&
      coupon.discountType !== null &&
      coupon.discountValue !== null &&
      coupon.expiryDate !== null &&
      coupon.minimumOrderValue !== null
    );
  });

  const filteredCoupons = validCoupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate active and expired coupons
  const activeCoupons = filteredCoupons.filter((coupon) => {
    const isExpired =
      coupon.expiryDate && new Date(coupon.expiryDate) <= new Date();
    return coupon.status === "active" && !isExpired;
  });

  const expiredCoupons = filteredCoupons.filter((coupon) => {
    const isExpired =
      coupon.expiryDate && new Date(coupon.expiryDate) <= new Date();
    return coupon.status !== "active" || isExpired;
  });

  const getStatusBadge = (coupon: Coupon) => {
    const isExpired =
      coupon.expiryDate && new Date(coupon.expiryDate) <= new Date();

    if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }

    switch (coupon.status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            Active
          </Badge>
        );
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Coupon Management</h1>
          <p className="text-muted-foreground">
            Manage promotional coupons and discounts
          </p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{validCoupons.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Coupons
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCoupons.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expired Coupons
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredCoupons.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coupons by code or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Coupons Table */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-green-600">Active Coupons</CardTitle>
              <CardDescription>
                Currently active promotional coupons
              </CardDescription>
            </div>
            <Badge variant="default" className="bg-green-500">
              {activeCoupons.length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading coupons...</div>
          ) : activeCoupons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No active coupons found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Min Order</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeCoupons.map((coupon) => (
                  <TableRow key={coupon.couponId}>
                    <TableCell className="font-medium">{coupon.code}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {coupon.description}
                    </TableCell>
                    <TableCell>
                      {coupon.discountType === "percentage" ? (
                        <div className="flex items-center gap-1">
                          <Percent className="h-3 w-3" />
                          {coupon.discountValue}%
                          {coupon.discountMaxLimit && (
                            <span className="text-xs text-muted-foreground">
                              (max £{coupon.discountMaxLimit})
                            </span>
                          )}
                        </div>
                      ) : coupon.discountType === "flat" ? (
                        `£${coupon.discountValue}`
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>£{coupon.minimumOrderValue || 0}</TableCell>
                    <TableCell>
                      {coupon.expiryDate
                        ? formatDate(coupon.expiryDate)
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {coupon.usedCount || 0} / {coupon.usageLimitGlobal || "∞"}
                    </TableCell>
                    <TableCell>{getStatusBadge(coupon)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCoupon(coupon);
                            setSelectedUserIds([]);
                            fetchTopUsers();
                            setAssignModalOpen(true);
                          }}
                          disabled={
                            (coupon.expiryDate &&
                              new Date(coupon.expiryDate) <= new Date()) ||
                            coupon.status !== "active"
                          }
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Expired Coupons Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-red-600">Expired Coupons</CardTitle>
              <CardDescription>
                Inactive or expired promotional coupons
              </CardDescription>
            </div>
            <Badge variant="destructive">{expiredCoupons.length} Expired</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading coupons...</div>
          ) : expiredCoupons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No expired coupons found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Min Order</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiredCoupons.map((coupon) => (
                  <TableRow key={coupon.couponId} className="opacity-60">
                    <TableCell className="font-medium">{coupon.code}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {coupon.description}
                    </TableCell>
                    <TableCell>
                      {coupon.discountType === "percentage" ? (
                        <div className="flex items-center gap-1">
                          <Percent className="h-3 w-3" />
                          {coupon.discountValue}%
                          {coupon.discountMaxLimit && (
                            <span className="text-xs text-muted-foreground">
                              (max £{coupon.discountMaxLimit})
                            </span>
                          )}
                        </div>
                      ) : coupon.discountType === "flat" ? (
                        `£${coupon.discountValue}`
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>£{coupon.minimumOrderValue || 0}</TableCell>
                    <TableCell>
                      {coupon.expiryDate
                        ? formatDate(coupon.expiryDate)
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {coupon.usedCount || 0} / {coupon.usageLimitGlobal || "∞"}
                    </TableCell>
                    <TableCell>{getStatusBadge(coupon)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Coupon Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Coupon</DialogTitle>
            <DialogDescription>
              Create a new promotional coupon for your customers
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g., SAVE20"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value: "percentage" | "flat") =>
                    setFormData({ ...formData, discountType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="flat">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the coupon offer"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Discount Value * (
                  {formData.discountType === "percentage" ? "%" : "£"})
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  placeholder={
                    formData.discountType === "percentage" ? "20" : "100"
                  }
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountValue: Number(e.target.value),
                    })
                  }
                />
              </div>
              {formData.discountType === "percentage" && (
                <div className="space-y-2">
                  <Label htmlFor="discountMaxLimit">
                    Max Discount Limit (£)
                  </Label>
                  <Input
                    id="discountMaxLimit"
                    type="number"
                    placeholder="500"
                    value={formData.discountMaxLimit || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountMaxLimit: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minimumOrderValue">
                  Minimum Order Value (£)
                </Label>
                <Input
                  id="minimumOrderValue"
                  type="number"
                  placeholder="0"
                  value={formData.minimumOrderValue || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minimumOrderValue: Number(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usageLimitPerUser">Usage Limit Per User</Label>
                <Input
                  id="usageLimitPerUser"
                  type="number"
                  placeholder="1"
                  value={formData.usageLimitPerUser || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usageLimitPerUser: Number(e.target.value) || 1,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usageLimitGlobal">Global Usage Limit</Label>
                <Input
                  id="usageLimitGlobal"
                  type="number"
                  placeholder="100"
                  value={formData.usageLimitGlobal || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usageLimitGlobal: Number(e.target.value) || 100,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Applicable Categories (Optional)</Label>
              <div className="grid grid-cols-3 gap-2">
                {PRODUCT_CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={
                        formData.applicableCategories?.includes(category) ||
                        false
                      }
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category, checked as boolean)
                      }
                    />
                    <Label htmlFor={category} className="text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty to apply to all categories
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCoupon}>Create Coupon</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Coupon Modal */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Coupon to Users</DialogTitle>
            <DialogDescription>
              Select users to assign the coupon "{selectedCoupon?.code}" to.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {loadingUsers ? (
              <div className="text-center py-8">Loading top users...</div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={
                        selectedUserIds.length === topUsers.length &&
                        topUsers.length > 0
                      }
                      onCheckedChange={handleSelectAllUsers}
                    />
                    <Label htmlFor="select-all" className="text-sm font-medium">
                      Select All ({topUsers.length} users)
                    </Label>
                  </div>
                  <Badge variant="outline">
                    {selectedUserIds.length} selected
                  </Badge>
                </div>

                <div className="border rounded-md max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Select</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Total Orders</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topUsers.map((user) => (
                        <TableRow key={user.userId}>
                          <TableCell>
                            <Checkbox
                              checked={selectedUserIds.includes(user.userId)}
                              onCheckedChange={(checked) =>
                                handleUserSelection(
                                  user.userId,
                                  checked as boolean
                                )
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {user.totalOrders}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  selectedCoupon && handleAssignToAllUsers(selectedCoupon.code)
                }
              >
                Assign to All Users
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setAssignModalOpen(false);
                  setSelectedCoupon(null);
                  setSelectedUserIds([]);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  selectedCoupon &&
                  handleAssignToSelectedUsers(selectedCoupon.code)
                }
                disabled={selectedUserIds.length === 0}
              >
                Assign to Selected ({selectedUserIds.length})
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
