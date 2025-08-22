"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { signInWithEmail, signInWithGoogle, resetPassword } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { Loader2, Mail } from "lucide-react";
import { getAuth } from "firebase/auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const auth = getAuth();
  const afterLoginUser = auth.currentUser;

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const user = await signInWithEmail(values.email, values.password);
      login(user);

      if (afterLoginUser) {
        afterLoginUser
          .getIdToken(/* forceRefresh */ true)
          .then((idToken) => {
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
              },
            });
          })
          .catch((error) => {
            // Handle error
            console.error("Error getting ID token:", error);
          });
      }

      // Redirect to the page they were trying to access, or to home page
      const redirectTo = searchParams.get("redirect") || "/";
      router.push(redirectTo);
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Failed to sign in. Please check your credentials.";

      if (error.code === "auth/user-not-found") {
        setShowSignupModal(true);
        return; // Don't show toast, show modal instead
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      }

      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      login(user);

      if (afterLoginUser) {
        afterLoginUser
          .getIdToken(/* forceRefresh */ true)
          .then((idToken) => {
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
              },
            });
          })
          .catch((error) => {
            // Handle error
            console.error("Error getting ID token:", error);
          });
      }

      const redirectTo = searchParams.get("redirect") || "/";
      router.push(redirectTo);
    } catch (error: any) {
      console.error("Google sign in error:", error);
      let errorMessage = "Failed to sign in with Google.";

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign in was cancelled.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup was blocked. Please allow popups and try again.";
      }

      toast({
        title: "Google sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  async function handleForgotPassword() {
    const email = form.getValues("email");
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await resetPassword(email);
      toast({
        title: "Password reset email sent",
        description:
          "Check your email for instructions to reset your password.",
      });
      setShowForgotPassword(false);
    } catch (error: any) {
      console.error("Password reset error:", error);
      let errorMessage = "Failed to send password reset email.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      }

      toast({
        title: "Password reset failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="shadow-lg border bg-card">
        <CardHeader className="text-center pb-3">
          <h2 className="text-xl font-bold">Sign In</h2>
        </CardHeader>

        <CardContent className="space-y-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="h-9 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs">Password</FormLabel>
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-xs text-primary"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot?
                      </Button>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        className="h-9 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showForgotPassword && (
                <div className="bg-muted/50 p-3 rounded text-center">
                  <p className="text-xs text-muted-foreground mb-2">
                    Enter your email and we'll send a reset link.
                  </p>
                  <Button
                    type="button"
                    onClick={handleForgotPassword}
                    className="w-full h-8 text-xs"
                    variant="outline"
                  >
                    Send Reset Email
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-9 bg-primary hover:bg-primary/90 text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <div className="relative my-3">
            <Separator className="w-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-card px-2 text-xs text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={isGoogleLoading}
            onClick={handleGoogleSignIn}
            className="w-full h-9 text-sm"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms
            </Link>{" "}
            &{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pt-2 pb-4">
          <p className="text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Signup Modal */}
      <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              Account Not Found
            </DialogTitle>
            <DialogDescription className="text-left">
              We couldn't find an account with the email address{" "}
              <span className="font-medium text-foreground">
                {form.getValues("email")}
              </span>
              . Would you like to create a new account instead?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSignupModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                const redirectTo = searchParams.get("redirect") || "/";
                router.push(
                  `/signup?redirect=${encodeURIComponent(redirectTo)}`
                );
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
