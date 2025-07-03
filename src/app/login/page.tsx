import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

function LoginContent() {
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8 lg:py-12">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left side - Hero content */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 pr-8">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-sm font-medium text-primary">
              🔐 Welcome back to FreshGift!
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-foreground leading-tight">
              Welcome Back to
              <span className="block text-primary">FreshGift</span>
            </h1>
            <p className="text-lg xl:text-xl text-muted-foreground leading-relaxed">
              Continue your journey with the freshest produce delivered to your
              doorstep. Access your account to manage orders, track deliveries,
              and discover new seasonal favorites.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <span className="text-foreground font-semibold block">
                  Order History
                </span>
                <span className="text-sm text-muted-foreground">
                  View and reorder your favorite items
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <span className="text-foreground font-semibold block">
                  Saved Addresses
                </span>
                <span className="text-sm text-muted-foreground">
                  Quick checkout with saved delivery locations
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <span className="text-foreground font-semibold block">
                  Personalized Recommendations
                </span>
                <span className="text-sm text-muted-foreground">
                  Discover products based on your preferences
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary-foreground"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-foreground font-medium mb-2">
                    "Love how easy it is to reorder my weekly favorites!"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    — Michael R., Loyal Customer ⭐⭐⭐⭐⭐
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile hero content */}
        <div className="lg:hidden text-center space-y-4 mb-4">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back to <span className="text-primary">FreshGift</span>
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your account and continue shopping
          </p>
        </div>

        {/* Right side - Login form */}
        <div className="w-full flex justify-center lg:justify-end">
          <Suspense
            fallback={
              <div className="text-center py-10">Loading login form...</div>
            }
          >
            <LoginContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
