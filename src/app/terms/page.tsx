import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Scale,
  Shield,
  AlertTriangle,
  Mail,
  Phone,
} from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 dark:from-emerald-950 dark:via-slate-900 dark:to-lime-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Terms of Service
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Please read these terms carefully before using our service. By using
            RoyalFresh, you agree to these terms.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          {/* Acceptance of Terms */}
          <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <FileText className="h-5 w-5 text-emerald-600" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                By accessing and using RoyalFresh's website and services, you
                accept and agree to be bound by the terms and provision of this
                agreement.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                If you do not agree to abide by the above, please do not use
                this service. We reserve the right to change these terms at any
                time without prior notice.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Service Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                RoyalFresh is an online grocery delivery platform that provides:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                <li>Fresh produce and grocery items</li>
                <li>Online ordering and payment processing</li>
                <li>Home delivery services</li>
                <li>Customer support and order tracking</li>
                <li>AI-powered product recommendations</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Account Registration
                </h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>
                    You must be at least 18 years old to create an account
                  </li>
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>
                    You are responsible for all activities under your account
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Account Termination
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We reserve the right to terminate accounts that violate these
                  terms or engage in fraudulent activities.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Orders and Payments */}
          <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Orders and Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Order Processing
                </h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>
                    All orders are subject to availability and confirmation
                  </li>
                  <li>We reserve the right to refuse or cancel orders</li>
                  <li>Order confirmation does not guarantee delivery</li>
                  <li>Delivery times are estimates and may vary</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Payment Terms
                </h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Payment is required at the time of order placement</li>
                  <li>We accept major credit cards and cash on delivery</li>
                  <li>All prices are inclusive of applicable taxes</li>
                  <li>Payment processing is handled securely through Stripe</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Terms */}
          <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Delivery Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>
                  Delivery is available within our designated service areas
                </li>
                <li>
                  Delivery fees may apply based on order value and location
                </li>
                <li>You must provide accurate delivery information</li>
                <li>Someone must be available to receive the delivery</li>
                <li>We are not responsible for orders left unattended</li>
                <li>
                  Delivery times are estimates and subject to weather and
                  traffic conditions
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Returns and Refunds */}
          <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Returns and Refunds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Fresh Guarantee
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  We guarantee the freshness of our products. If you're not
                  satisfied:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Report issues within 24 hours of delivery</li>
                  <li>Provide photos of damaged or spoiled items</li>
                  <li>We will provide replacement or full refund</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Cancellation Policy
                </h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Orders can be cancelled before processing begins</li>
                  <li>
                    Cancellation may not be possible for orders in preparation
                  </li>
                  <li>Refunds are processed within 5-7 business days</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Uses */}
          <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Prohibited Uses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You may not use our service:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                <li>For any unlawful purpose or to solicit unlawful acts</li>
                <li>
                  To violate any international, federal, provincial, or state
                  regulations or laws
                </li>
                <li>
                  To transmit any malicious code, viruses, or harmful content
                </li>
                <li>To harass, abuse, insult, harm, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>
                  To interfere with the security or operation of the service
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Shield className="h-5 w-5 text-emerald-600" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                RoyalFresh shall not be held liable for:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>
                  Delays or failures due to circumstances beyond our control
                </li>
                <li>Third-party actions or content</li>
                <li>
                  Food allergies or dietary restrictions not properly
                  communicated
                </li>
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Our total liability shall not exceed the amount paid for the
                specific order in question.
              </p>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                All content on this website, including but not limited to text,
                graphics, logos, images, and software, is the property of
                RoyalFresh and is protected by intellectual property laws.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                You may not reproduce, distribute, or create derivative works
                without our express written permission.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting. Your continued use
                of the service after changes constitutes acceptance of the new
                terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-emerald-50 to-lime-50 dark:from-emerald-950/20 dark:to-lime-950/20 border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions about these Terms of Service, please
                contact us:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Mail className="h-4 w-4 text-emerald-600" />
                  <span>legal@RoyalFresh.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Phone className="h-4 w-4 text-emerald-600" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
