"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TiltCard } from "@/components/ui/tilt-card";
import { resetPassword } from "@/lib/auth/auth-client";

function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await resetPassword({
        newPassword: password,
        token: token
      });

      if (error) {
        toast.error(error.message || "Failed to reset password. The link might have expired.");
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center animate-fade-in">
        <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Invalid Link</h3>
        <p className="text-sm text-muted-foreground mb-6">
          This password reset link is invalid or has expired.
        </p>
        <Link href="/forgot-password">
          <Button className="gradient-primary border-0 text-white">
            Request new link
          </Button>
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center animate-fade-in">
        <CheckCircle2 className="w-12 h-12 text-teal-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Password reset successful</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Your password has been changed. You will be redirected to the login page momentarily.
        </p>
        <Link href="/login">
          <Button variant="outline">
            Go to Login now
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-9 bg-black/20 border-white/10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
      </div>
      <Button className="w-full gradient-primary border-0 text-white" type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting...
          </>
        ) : (
          "Reset Password"
        )}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md z-10">
        <Link href="/login" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>
        
        <TiltCard tiltMax={4}>
          <Card className="glass border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Create new password</CardTitle>
              <CardDescription>
                Enter a new password for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="flex justify-center p-4"><Loader2 className="animate-spin w-6 h-6 text-teal-500" /></div>}>
                <ResetPasswordForm />
              </Suspense>
            </CardContent>
          </Card>
        </TiltCard>
      </div>
    </div>
  );
}
