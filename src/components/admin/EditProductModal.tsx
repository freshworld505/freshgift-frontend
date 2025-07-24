"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Upload } from "lucide-react";
import { uploadProductImages } from "@/api/admin/productApi";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SUBCATEGORIES,
  PRODUCT_TAGS,
} from "@/api/admin/analyticsApi";
import { useToast } from "@/hooks/use-toast";
import { useAdminStore } from "@/hooks/use-admin-store";

interface Product {
  id: string;
  productName: string;
  description: string;
  category: string;
  subCategory: string;
  tags: string | string[]; // Can be either string or array
  actualPrice: number;
  discount?: number;
  businessDiscount?: number | string; // Add businessDiscount field
  finalPrice: number;
  stock: number;
  productCode: string;
  rating?: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  isActive: boolean;
  expiryDate?: string;
  harvestDate?: string;
  shelfLife?: number;
  returnable?: boolean;
  storageInstructions?: string;
  maxPurchaseLimit?: number;
  deliveryType?: string;
  images: string[];
  productImages?: string[]; // Add productImages field
}

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onProductUpdated: () => void;
}

export default function EditProductModal({
  open,
  onOpenChange,
  product,
  onProductUpdated,
}: EditProductModalProps) {
  const { toast } = useToast();
  const { updateProduct } = useAdminStore();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    category: "",
    subCategory: "",
    tags: [] as string[], // Change to string array to match the logic
    actualPrice: 0,
    discount: 0,
    businessDiscount: 0, // Add businessDiscount to formData
    finalPrice: 0,
    stock: 0,
    productCode: "",
    rating: 0,
    isFeatured: false,
    isTrending: false,
    isNew: false,
    isActive: true,
    expiryDate: "",
    harvestDate: "",
    shelfLife: 0,
    returnable: false,
    storageInstructions: "",
    maxPurchaseLimit: 0,
    deliveryType: "",
    images: [] as string[],
  });

  // Populate form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || "",
        description: product.description || "",
        category: product.category || "",
        subCategory: product.subCategory || "",
        tags: product.tags
          ? typeof product.tags === "string"
            ? product.tags.split(",").filter(Boolean)
            : Array.isArray(product.tags)
            ? product.tags
            : []
          : [],
        actualPrice: product.actualPrice || 0,
        discount: product.discount || 0,
        businessDiscount: Number(product.businessDiscount) || 0,
        finalPrice: product.finalPrice || 0,
        stock: product.stock || 0,
        productCode: product.productCode || "",
        rating: product.rating || 0,
        isFeatured: product.isFeatured || false,
        isTrending: product.isTrending || false,
        isNew: product.isNew || false,
        isActive: product.isActive !== undefined ? product.isActive : true,
        expiryDate: product.expiryDate || "",
        harvestDate: product.harvestDate || "",
        shelfLife: product.shelfLife || 0,
        returnable:
          product.returnable !== undefined ? product.returnable : true,
        storageInstructions: product.storageInstructions || "",
        maxPurchaseLimit: product.maxPurchaseLimit || 0,
        deliveryType: product.deliveryType || "Instant",
        images: product.images || product.productImages || [],
      });
      setImagePreviews(product.images || []);
      setImageFiles([]);
    }
  }, [product]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    if (index < formData.images.length) {
      // Removing existing image
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else {
      // Removing new uploaded file
      const newFileIndex = index - formData.images.length;
      setImageFiles((prev) => prev.filter((_, i) => i !== newFileIndex));
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);
    try {
      // Upload new images if any
      let newImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        newImageUrls = await uploadProductImages(imageFiles);
      }

      // Combine existing images with new ones
      const allImages = [...formData.images, ...newImageUrls];

      // Prepare update data according to EditProductData interface (matching working cURL format)
      const updateData = {
        productId: product.id, // Required field for the API
        productName: formData.productName || undefined,
        productCode: formData.productCode || undefined,
        description: formData.description || undefined,
        actualPrice: formData.actualPrice || undefined,
        discount: formData.discount || undefined,
        businessDiscount: formData.businessDiscount || undefined,
        finalPrice: formData.finalPrice || undefined,
        stock: formData.stock || undefined,
        category: formData.category || undefined,
        subCategory: formData.subCategory || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        rating: formData.rating || undefined,
        isFeatured: formData.isFeatured,
        isTrending: formData.isTrending,
        isNew: formData.isNew,
        expiryDate: formData.expiryDate || undefined,
        harvestDate: formData.harvestDate || undefined,
        shelfLife: formData.shelfLife || undefined,
        returnable: formData.returnable,
        storageInstructions: formData.storageInstructions || undefined,
        maxPurchaseLimit: formData.maxPurchaseLimit || undefined,
        deliveryType: "Instant",
        productImages: allImages.length > 0 ? allImages : undefined,
      };

      // Filter out undefined values but keep 0, false, empty strings as valid values
      const cleanedData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      );

      console.log("🔍 EditProductModal - About to send update data:", {
        originalProduct: product,
        formData: formData,
        updateData: updateData,
        cleanedData: cleanedData,
        dataStructure: JSON.stringify(cleanedData, null, 2),
      });

      await updateProduct(product.id, cleanedData);

      toast({
        title: "Success",
        description: "Product updated successfully!",
      });

      onProductUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update product information and settings
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) =>
                  handleInputChange("productName", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productCode">Product Code *</Label>
              <Input
                id="productCode"
                value={formData.productCode}
                onChange={(e) =>
                  handleInputChange("productCode", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subcategory</Label>
              <Select
                value={formData.subCategory}
                onValueChange={(value) =>
                  handleInputChange("subCategory", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_SUBCATEGORIES.map((subcategory) => (
                    <SelectItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="actualPrice">Actual Price (£) *</Label>
              <Input
                id="actualPrice"
                type="number"
                step="0.01"
                value={formData.actualPrice || ""}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseFloat(e.target.value);
                  handleInputChange("actualPrice", isNaN(value) ? 0 : value);
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                value={formData.discount || ""}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseFloat(e.target.value);
                  handleInputChange("discount", isNaN(value) ? 0 : value);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessDiscount">Business Discount (%)</Label>
              <Input
                id="businessDiscount"
                type="number"
                step="0.01"
                value={formData.businessDiscount || ""}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseFloat(e.target.value);
                  handleInputChange(
                    "businessDiscount",
                    isNaN(value) ? 0 : value
                  );
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="finalPrice">Final Price (£) *</Label>
              <Input
                id="finalPrice"
                type="number"
                step="0.01"
                value={formData.finalPrice || ""}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseFloat(e.target.value);
                  handleInputChange("finalPrice", isNaN(value) ? 0 : value);
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock || ""}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseInt(e.target.value);
                  handleInputChange("stock", isNaN(value) ? 0 : value);
                }}
                required
              />
            </div>
          </div>

          {/* Additional Product Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating || ""}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseFloat(e.target.value);
                  handleInputChange("rating", isNaN(value) ? 0 : value);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shelfLife">Shelf Life (days)</Label>
              <Input
                id="shelfLife"
                type="number"
                value={formData.shelfLife || ""}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseInt(e.target.value);
                  handleInputChange("shelfLife", isNaN(value) ? 0 : value);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPurchaseLimit">Max Purchase Limit</Label>
              <Input
                id="maxPurchaseLimit"
                type="number"
                value={formData.maxPurchaseLimit || ""}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseInt(e.target.value);
                  handleInputChange(
                    "maxPurchaseLimit",
                    isNaN(value) ? 0 : value
                  );
                }}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="harvestDate">Harvest Date</Label>
              <Input
                id="harvestDate"
                type="date"
                value={formData.harvestDate}
                onChange={(e) =>
                  handleInputChange("harvestDate", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  handleInputChange("expiryDate", e.target.value)
                }
              />
            </div>
          </div>

          {/* Delivery Type */}
          <div className="space-y-2">
            <Label>Delivery Type</Label>
            <Select
              value={formData.deliveryType}
              onValueChange={(value) =>
                handleInputChange("deliveryType", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select delivery type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Instant">Instant</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Express">Express</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Storage Instructions */}
          <div className="space-y-2">
            <Label htmlFor="storageInstructions">Storage Instructions</Label>
            <Textarea
              id="storageInstructions"
              value={formData.storageInstructions}
              onChange={(e) =>
                handleInputChange("storageInstructions", e.target.value)
              }
              rows={2}
              placeholder="e.g., Store in a cool, dry place"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={formData.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Product Status Toggles */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) =>
                  handleInputChange("isFeatured", checked)
                }
              />
              <Label htmlFor="isFeatured">Featured</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isTrending"
                checked={formData.isTrending}
                onCheckedChange={(checked) =>
                  handleInputChange("isTrending", checked)
                }
              />
              <Label htmlFor="isTrending">Trending</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isNew"
                checked={formData.isNew}
                onCheckedChange={(checked) =>
                  handleInputChange("isNew", checked)
                }
              />
              <Label htmlFor="isNew">New</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="returnable"
                checked={formData.returnable}
                onCheckedChange={(checked) =>
                  handleInputChange("returnable", checked)
                }
              />
              <Label htmlFor="returnable">Returnable</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  handleInputChange("isActive", checked)
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="space-y-4">
              {/* Current Images */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload New Images */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="images" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Add more images
                      </span>
                      <input
                        id="images"
                        type="file"
                        className="sr-only"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Updating..." : "Update Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
