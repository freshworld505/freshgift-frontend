import ManageAddresses from "@/components/account/ManageAddresses";

export default function AccountAddressesPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          My Addresses
        </h2>
        <p className="text-gray-600">
          Manage your delivery locations for a seamless shopping experience
        </p>
      </div>

      <ManageAddresses />
    </div>
  );
}
