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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { signUpWithEmail, signInWithGoogle } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Password confirmation is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    try {
      const user = await signUpWithEmail(
        values.email,
        values.password,
        values.name
      );
      signup(user);

      // Redirect to the page they were trying to access, or to home page
      const redirectTo = searchParams.get("redirect") || "/";
      router.push(redirectTo);
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = "Failed to create account. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "Password is too weak. Please choose a stronger password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      }

      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    setIsGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      signup(user);

      // Redirect to the page they were trying to access, or to home page
      const redirectTo = searchParams.get("redirect") || "/";
      router.push(redirectTo);
    } catch (error: any) {
      console.error("Google sign up error:", error);
      let errorMessage = "Failed to sign up with Google.";

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign up was cancelled.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup was blocked. Please allow popups and try again.";
      }

      toast({
        title: "Google sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
      <CardHeader className="text-center space-y-3 pb-6">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-2">
          <svg
            className="w-6 h-6 text-primary-foreground"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Create Account
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Join FreshGift and start your fresh journey today
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                      className="h-11 border-border/60 focus:border-primary transition-colors duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                      className="h-11 border-border/60 focus:border-primary transition-colors duration-200"
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
                  <FormLabel className="text-sm font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Create a strong password"
                      {...field}
                      className="h-11 border-border/60 focus:border-primary transition-colors duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                      className="h-11 border-border/60 focus:border-primary transition-colors duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isGoogleLoading}
            onClick={handleGoogleSignUp}
            className="h-11 border-border/60 hover:border-primary/50 transition-colors duration-200"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing up with Google...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                Continue with Google
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          By creating an account, you agree to our{" "}
          <Link
            href="/terms"
            className="text-primary hover:underline font-medium"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-primary hover:underline font-medium"
          >
            Privacy Policy
          </Link>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-center pt-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-semibold transition-colors duration-200"
          >
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
