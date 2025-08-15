import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
        {/* Left side - Hero content */}
        <div className="hidden lg:flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-sm font-medium text-primary">
              ✨ Join RoyaleFresh today!
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold text-foreground leading-tight">
              Fresh Produce,
              <span className="block text-primary">Delivered Daily</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Farm-fresh fruits and vegetables delivered to your doorstep. Join
              thousands of satisfied customers.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary-foreground"
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
                <span className="text-foreground font-medium block">
                  Farm-Fresh Quality
                </span>
                <span className="text-sm text-muted-foreground">
                  Sourced directly from local farms
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary-foreground"
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
                <span className="text-foreground font-medium block">
                  Same-Day Delivery
                </span>
                <span className="text-sm text-muted-foreground">
                  Order by 2 PM for same-day delivery
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary-foreground"
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
                <span className="text-foreground font-medium block">
                  Best Price Guarantee
                </span>
                <span className="text-sm text-muted-foreground">
                  Competitive prices with exclusive deals
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile hero content */}
        <div className="lg:hidden text-center space-y-3 mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Join <span className="text-primary">RoyaleFresh</span>
          </h1>
          <p className="text-muted-foreground">
            Fresh produce delivered to your door
          </p>
        </div>

        {/* Right side - Signup form */}
        <div className="w-full flex justify-center lg:justify-end">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
