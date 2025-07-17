"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Phone,
  MapPin,
  User,
  Calendar,
  Check,
  X,
  Eye,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getBusinessRequests,
  approveBusinessRequest,
  rejectBusinessRequest,
  checkBusinessUserStatus,
  type BusinessRequest,
} from "@/api/admin/businessUsersApi";

export default function BusinessRequestsPage() {
  const [requests, setRequests] = useState<BusinessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<BusinessRequest | null>(null);
  const [currentTab, setCurrentTab] = useState<string>("all");
  const { toast } = useToast();

  // Load business requests on component mount and when tab changes
  useEffect(() => {
    loadBusinessRequests(currentTab);
  }, [currentTab]);

  const loadBusinessRequests = async (status?: string) => {
    setLoading(true);
    try {
      let data: BusinessRequest[];
      if (status && status !== "all") {
        // Use the new status-specific API
        const response = await checkBusinessUserStatus(status);
        data = response.requests;
      } else {
        // Use the existing API to get all requests
        data = await getBusinessRequests();
      }
      setRequests(data);
    } catch (error: any) {
      console.error("Failed to load business requests:", error);
      toast({
        title: "Error",
        description: "Failed to load business requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      const result = await approveBusinessRequest(requestId);
      toast({
        title: "Request Approved",
        description: result.message,
      });
      // Reload requests to get updated data
      await loadBusinessRequests(currentTab);
    } catch (error: any) {
      console.error("Failed to approve request:", error);
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve business request.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      const result = await rejectBusinessRequest(requestId);
      toast({
        title: "Request Rejected",
        description: result.message,
      });
      // Reload requests to get updated data
      await loadBusinessRequests(currentTab);
    } catch (error: any) {
      console.error("Failed to reject request:", error);
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject business request.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg">Loading business requests...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Business Requests</h1>
          <p className="text-muted-foreground">
            Manage and review business account applications
          </p>
        </div>
        <Button
          onClick={() => loadBusinessRequests(currentTab)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {requests.filter((r) => r.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {requests.filter((r) => r.status === "approved").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab} className="mt-6">
          {/* Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle>Business Requests</CardTitle>
              <CardDescription>
                Review and manage business account applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">
                    No business requests found
                  </p>
                  <p className="text-muted-foreground">
                    Business applications will appear here when submitted.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Info</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.requestId}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">
                                {request.businessName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ID: {request.businessId}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img
                                src={request.user.profilePicture}
                                alt={request.user.name}
                                className="h-8 w-8 rounded-full"
                              />
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {request.user.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {request.user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Phone className="h-3 w-3 mr-1" />
                                {request.businessPhone}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                {request.address.city}, {request.address.state}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(request.status)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDate(request.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {/* View Details Button */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedRequest(request)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Business Request Details
                                    </DialogTitle>
                                    <DialogDescription>
                                      Complete information about this business
                                      application
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedRequest && (
                                    <div className="space-y-6">
                                      {/* Business Information */}
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="font-semibold mb-2">
                                            Business Details
                                          </h4>
                                          <div className="space-y-2 text-sm">
                                            <div>
                                              <span className="font-medium">
                                                Name:
                                              </span>{" "}
                                              {selectedRequest.businessName}
                                            </div>
                                            <div>
                                              <span className="font-medium">
                                                ID:
                                              </span>{" "}
                                              {selectedRequest.businessId}
                                            </div>
                                            <div>
                                              <span className="font-medium">
                                                Phone:
                                              </span>{" "}
                                              {selectedRequest.businessPhone}
                                            </div>
                                            <div>
                                              <span className="font-medium">
                                                Status:
                                              </span>{" "}
                                              {getStatusBadge(
                                                selectedRequest.status
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold mb-2">
                                            User Information
                                          </h4>
                                          <div className="space-y-2 text-sm">
                                            <div className="flex items-center space-x-2">
                                              <img
                                                src={
                                                  selectedRequest.user
                                                    .profilePicture
                                                }
                                                alt={selectedRequest.user.name}
                                                className="h-6 w-6 rounded-full"
                                              />
                                              <span>
                                                {selectedRequest.user.name}
                                              </span>
                                            </div>
                                            <div>
                                              <span className="font-medium">
                                                Email:
                                              </span>{" "}
                                              {selectedRequest.user.email}
                                            </div>
                                            <div>
                                              <span className="font-medium">
                                                Role:
                                              </span>{" "}
                                              {selectedRequest.user.role}
                                            </div>
                                            <div>
                                              <span className="font-medium">
                                                User ID:
                                              </span>{" "}
                                              {selectedRequest.user.userId}
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Address Information */}
                                      <div>
                                        <h4 className="font-semibold mb-2">
                                          Business Address
                                        </h4>
                                        <div className="text-sm bg-muted p-3 rounded-md">
                                          <div>
                                            {
                                              selectedRequest.address
                                                .addressLine
                                            }
                                          </div>
                                          {selectedRequest.address.landmark && (
                                            <div>
                                              Landmark:{" "}
                                              {selectedRequest.address.landmark}
                                            </div>
                                          )}
                                          <div>
                                            {selectedRequest.address.city},{" "}
                                            {selectedRequest.address.state}{" "}
                                            {selectedRequest.address.pincode}
                                          </div>
                                          <div>
                                            {selectedRequest.address.country}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Timestamps */}
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <span className="font-medium">
                                            Submitted:
                                          </span>{" "}
                                          {formatDate(
                                            selectedRequest.createdAt
                                          )}
                                        </div>
                                        <div>
                                          <span className="font-medium">
                                            Last Updated:
                                          </span>{" "}
                                          {formatDate(
                                            selectedRequest.updatedAt
                                          )}
                                        </div>
                                      </div>

                                      {/* Action Buttons */}
                                      {selectedRequest.status === "pending" && (
                                        <div className="flex justify-end space-x-2 pt-4 border-t">
                                          <Button
                                            variant="outline"
                                            onClick={() =>
                                              handleReject(
                                                selectedRequest.requestId
                                              )
                                            }
                                            disabled={
                                              actionLoading ===
                                              selectedRequest.requestId
                                            }
                                            className="text-red-600 border-red-600 hover:bg-red-50"
                                          >
                                            {actionLoading ===
                                            selectedRequest.requestId ? (
                                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                              <X className="h-4 w-4 mr-2" />
                                            )}
                                            Reject
                                          </Button>
                                          <Button
                                            onClick={() =>
                                              handleApprove(
                                                selectedRequest.requestId
                                              )
                                            }
                                            disabled={
                                              actionLoading ===
                                              selectedRequest.requestId
                                            }
                                            className="bg-green-600 hover:bg-green-700"
                                          >
                                            {actionLoading ===
                                            selectedRequest.requestId ? (
                                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                              <Check className="h-4 w-4 mr-2" />
                                            )}
                                            Approve
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>

                              {/* Action Buttons for Pending Requests */}
                              {request.status === "pending" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleReject(request.requestId)
                                    }
                                    disabled={
                                      actionLoading === request.requestId
                                    }
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                  >
                                    {actionLoading === request.requestId ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <X className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleApprove(request.requestId)
                                    }
                                    disabled={
                                      actionLoading === request.requestId
                                    }
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {actionLoading === request.requestId ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Check className="h-4 w-4" />
                                    )}
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
