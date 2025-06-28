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
} from "@/api/admin/couponAdminApi";
import { PRODUCT_CATEGORIES } from "@/lib/types";

type Coupon = {
  couponId: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
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

type CreateCouponData = {
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
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

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // Form state for creating coupon
  const [formData, setFormData] = useState<CreateCouponData>({
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

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (coupon: Coupon) => {
    const isExpired = new Date(coupon.expiryDate) < new Date();
    const status = isExpired ? "expired" : coupon.status;

    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            Active
          </Badge>
        );
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
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
            <div className="text-2xl font-bold">{coupons.length}</div>
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
            <div className="text-2xl font-bold">
              {
                coupons.filter(
                  (c) =>
                    c.status === "active" && new Date(c.expiryDate) > new Date()
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coupons.reduce(
                (sum, coupon) => sum + (coupon.usedCount || 0),
                0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Coupons</CardTitle>
              <CardDescription>Manage your promotional coupons</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading coupons...</div>
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
                {filteredCoupons.map((coupon) => (
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
                      ) : (
                        `£${coupon.discountValue}`
                      )}
                    </TableCell>
                    <TableCell>£{coupon.minimumOrderValue}</TableCell>
                    <TableCell>{formatDate(coupon.expiryDate)}</TableCell>
                    <TableCell>
                      {coupon.usedCount || 0} / {coupon.usageLimitGlobal}
                    </TableCell>
                    <TableCell>{getStatusBadge(coupon)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCoupon(coupon);
                            setAssignModalOpen(true);
                          }}
                          disabled={
                            new Date(coupon.expiryDate) < new Date() ||
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
                  onValueChange={(value: "percentage" | "fixed") =>
                    setFormData({ ...formData, discountType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
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
      <AlertDialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Assign Coupon to All Users</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to assign the coupon "{selectedCoupon?.code}
              " to all users? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setAssignModalOpen(false);
                setSelectedCoupon(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedCoupon && handleAssignToAllUsers(selectedCoupon.code)
              }
            >
              Assign to All Users
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
