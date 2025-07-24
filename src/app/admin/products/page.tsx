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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Plus, Edit, Trash2, Package } from "lucide-react";
import { useAdminStore } from "@/hooks/use-admin-store";
import EditProductModal from "@/components/admin/EditProductModal";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function AdminProducts() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    products,
    productsLoading,
    error,
    fetchProducts,
    deleteProduct,
    productsPagination,
  } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  useEffect(() => {
    // Fetch products when component mounts or page changes
    fetchProducts(searchTerm, currentPage, 20);
  }, [fetchProducts, currentPage]);

  // Handle search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      fetchProducts(searchTerm, 1, 20);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchProducts]);

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleProductUpdated = () => {
    fetchProducts(searchTerm, currentPage, 20); // Refresh the current page
  };

  const handleAddProduct = () => {
    router.push("/admin/products/add");
  };

  const handleDeleteProduct = (product: any) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      // Refresh current page after deletion
      fetchProducts(searchTerm, currentPage, 20);
      toast({
        title: "Product deleted",
        description: `"${productToDelete.productName}" has been deleted.`,
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error deleting product",
        description: "An error occurred while deleting the product.",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts(searchTerm, page, 20);
  };

  const getStatusBadge = (product: any) => {
    const stock = product?.stock || 0;
    const isActive = product?.isActive !== false; // Default to true if undefined

    if (stock === 0 || !isActive) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stock < 10) {
      return <Badge variant="secondary">Low Stock</Badge>;
    } else {
      return <Badge variant="default">Active</Badge>;
    }
  };

  if (productsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Loading product management...
          </p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>
          <p className="mt-2 text-red-600">Error loading products: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your product inventory
          </p>
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productsPagination?.total || (products || []).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Business Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                (products || []).filter(
                  (p: any) =>
                    p?.businessDiscount &&
                    p.businessDiscount !== "0%" &&
                    p.businessDiscount !== 0
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                (products || []).filter(
                  (p: any) => p?.isActive && (p?.stock || 0) > 0
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                (products || []).filter((p: any) => (p?.stock || 0) === 0)
                  .length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                (products || []).filter(
                  (p: any) => (p?.stock || 0) < 10 && (p?.stock || 0) > 0
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>Search and manage all your products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Code</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Business Discount</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(products || []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        No products found
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  (products || []).map((product: any) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.productCode || product.id}
                      </TableCell>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>{product.category || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            £{product.finalPrice || product.price}
                          </span>
                          {product.actualPrice &&
                            product.actualPrice !== product.finalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                £{product.actualPrice}
                              </span>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.businessDiscount ? (
                          <div className="flex flex-col">
                            <Badge
                              variant="secondary"
                              className="text-xs w-fit"
                            >
                              {typeof product.businessDiscount === "number"
                                ? `${product.businessDiscount}%`
                                : product.businessDiscount}
                            </Badge>
                            {product.businessDiscount !== "0%" &&
                              product.businessDiscount !== 0 && (
                                <span className="text-xs text-green-600 mt-1">
                                  Business Deal
                                </span>
                              )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            No discount
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock < 10
                              ? "text-yellow-600"
                              : "text-green-600"
                          }
                        >
                          {product.stock || 0}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(product)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {productsPagination && productsPagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-gray-500">
                Showing{" "}
                {(productsPagination.page - 1) * productsPagination.limit + 1}{" "}
                to{" "}
                {Math.min(
                  productsPagination.page * productsPagination.limit,
                  productsPagination.total
                )}{" "}
                of {productsPagination.total} products
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                      className={
                        currentPage <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* Page numbers */}
                  {Array.from(
                    { length: Math.min(5, productsPagination.totalPages) },
                    (_, i) => {
                      const startPage = Math.max(1, currentPage - 2);
                      const pageNumber = startPage + i;

                      if (pageNumber <= productsPagination.totalPages) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNumber);
                              }}
                              isActive={pageNumber === currentPage}
                              className="cursor-pointer"
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    }
                  )}

                  {productsPagination.totalPages > 5 &&
                    currentPage < productsPagination.totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < productsPagination.totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage >= productsPagination.totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Product Modal */}
      {editModalOpen && selectedProduct && (
        <EditProductModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          product={selectedProduct}
          onProductUpdated={handleProductUpdated}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.productName}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
