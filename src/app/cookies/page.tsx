import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Cookie,
  Settings,
  Shield,
  BarChart,
  Target,
  Mail,
  Phone,
} from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 dark:from-emerald-950 dark:via-slate-900 dark:to-lime-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
              <Cookie className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Cookie Policy
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            This policy explains how we use cookies and similar technologies to
            enhance your experience on RoyalFresh.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          {/* What Are Cookies */}
          <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Cookie className="h-5 w-5 text-emerald-600" />
                What Are Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Cookies are small text files that are stored on your device when
                you visit a website. They help websites remember your
                preferences and improve your browsing experience.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                We use cookies to enhance functionality, analyze site usage, and
                provide personalized content and advertisements.
              </p>
            </CardContent>
          </Card>

          {/* Types of Cookies */}
          <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Essential Cookies */}
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-900 dark:text-red-100">
                    Essential Cookies
                  </h3>
                  <span className="text-xs bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">
                    Required
                  </span>
                </div>
                <p className="text-red-700 dark:text-red-300 text-sm mb-3">
                  These cookies are necessary for the website to function
                  properly and cannot be disabled.
                </p>
                <ul className="list-disc list-inside text-red-600 dark:text-red-400 text-sm space-y-1">
                  <li>Authentication and session management</li>
                  <li>Shopping cart functionality</li>
                  <li>Security and fraud prevention</li>
                  <li>Load balancing and performance</li>
                </ul>
              </div>

              {/* Performance Cookies */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    Performance Cookies
                  </h3>
                  <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                    Optional
                  </span>
                </div>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                  These cookies help us understand how visitors interact with
                  our website.
                </p>
                <ul className="list-disc list-inside text-blue-600 dark:text-blue-400 text-sm space-y-1">
                  <li>Google Analytics for usage statistics</li>
                  <li>Page load times and error tracking</li>
                  <li>Popular content and navigation patterns</li>
                  <li>A/B testing and optimization</li>
                </ul>
              </div>

              {/* Functional Cookies */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-3 mb-2">
                  <Settings className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                    Functional Cookies
                  </h3>
                  <span className="text-xs bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full">
                    Optional
                  </span>
                </div>
                <p className="text-emerald-700 dark:text-emerald-300 text-sm mb-3">
                  These cookies enable enhanced functionality and
                  personalization.
                </p>
                <ul className="list-disc list-inside text-emerald-600 dark:text-emerald-400 text-sm space-y-1">
                  <li>Language and region preferences</li>
                  <li>Theme and display settings</li>
                  <li>Recent searches and favorites</li>
                  <li>Personalized recommendations</li>
                </ul>
              </div>

              {/* Marketing Cookies */}
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                    Marketing Cookies
                  </h3>
                  <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                    Optional
                  </span>
                </div>
                <p className="text-purple-700 dark:text-purple-300 text-sm mb-3">
                  These cookies are used to deliver relevant advertisements and
                  track campaign effectiveness.
                </p>
                <ul className="list-disc list-inside text-purple-600 dark:text-purple-400 text-sm space-y-1">
                  <li>Social media integration (Facebook, Instagram)</li>
                  <li>Google Ads and retargeting</li>
                  <li>Email marketing campaign tracking</li>
                  <li>Cross-device user identification</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Management */}
          <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Settings className="h-5 w-5 text-emerald-600" />
                Managing Your Cookie Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                You have control over which cookies you allow. Here's how you
                can manage them:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Website Cookie Settings
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Use our cookie preference center to control which cookies
                    are active.
                  </p>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Cookie Preferences
                  </Button>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Browser Settings
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Configure cookie settings directly in your browser
                    preferences.
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• Chrome: Settings → Privacy → Cookies</li>
                    <li>• Firefox: Options → Privacy → Cookies</li>
                    <li>• Safari: Preferences → Privacy</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Cookies */}
          <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We work with trusted third-party services that may also set
                cookies on your device:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Analytics & Performance
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    <li>Google Analytics</li>
                    <li>Hotjar (heat mapping)</li>
                    <li>New Relic (performance monitoring)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Marketing & Social
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    <li>Google Ads</li>
                    <li>Facebook Pixel</li>
                    <li>Mailchimp (email marketing)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Retention */}
          <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">
                Cookie Retention Periods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Session Cookies
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Deleted when browser closes
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Functional Cookies
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    30 days to 1 year
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Analytics Cookies
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Up to 2 years
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Marketing Cookies
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    30 days to 2 years
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact of Disabling Cookies */}
          <Card className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl text-yellow-900 dark:text-yellow-100">
                <Shield className="h-5 w-5 text-yellow-600" />
                Impact of Disabling Cookies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                If you choose to disable certain cookies, some features may not
                work properly:
              </p>
              <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>Shopping cart may not remember items between sessions</li>
                <li>Personalized recommendations will be less accurate</li>
                <li>You may need to re-enter preferences on each visit</li>
                <li>Some social media features may not function</li>
                <li>Analytics data will be incomplete</li>
              </ul>
            </CardContent>
          </Card>

          {/* Updates to Cookie Policy */}
          <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                We may update this Cookie Policy from time to time to reflect
                changes in our practices or applicable laws. We will notify you
                of any significant changes by posting the updated policy on our
                website and updating the "Last updated" date.
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
                If you have any questions about our use of cookies, please
                contact us:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Mail className="h-4 w-4 text-emerald-600" />
                  <span>cookies@RoyalFresh.com</span>
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
