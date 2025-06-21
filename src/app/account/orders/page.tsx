import OrderHistory from "@/components/account/OrderHistory";

export default function AccountOrdersPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          My Orders
        </h2>
        <p className="text-gray-600">
          Track your past and current orders with real-time updates
        </p>
      </div>

      <OrderHistory />
    </div>
  );
}
