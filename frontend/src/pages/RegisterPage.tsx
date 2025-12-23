import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
// import { useAuthStore } from "@/store/useAuthStore";
import { useRegister } from "@/hooks/useRegister";
import type { RegisterPayload } from "@/types/apiPayloads";
import { toast } from "sonner";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("");
//   const setAuth = useAuthStore((s) => s.setAuth)
  const register = useRegister()

    function handleSubmit() {
    if (password1 !== password2) {
        toast.error("Passwords do not match");
        return;
    }

    if (password1.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
    }

    if (!email.includes("@")) {
        toast.error("Enter a valid email address");
        return;
    }

    if (username.trim().length < 3) {
        toast.error("Username should be at least 3 characters");
        return;
    }

    if (username.includes(" ") || email.includes(" ")) {
        toast.error("Spaces in username or email are not allowed");
        return;
    }

    const payload: RegisterPayload = {
        username,
        email,
        password1,
        password2,
    };

    register.mutate(payload, {
        onSuccess: (data) => {
        // Backend should return the verification key
        const key = data.key;
        if (!key) {
            toast.error("Registration succeeded but no verification key returned.");
            return;
        }

        toast.success("Registration successful! Please verify your email.");
        navigate({ to: `/verify-email?key=${key}` });
        },
        onError: (error: any) => {
        // Handles backend validation errors
        if (error.response?.data) {
            const errData = error.response.data;
            if (errData.username) {
            toast.error(`Username error: ${errData.username.join(", ")}`);
            }
            if (errData.email) {
            toast.error(`Email error: ${errData.email.join(", ")}`);
            }
            if (errData.password1) {
            toast.error(`Password error: ${errData.password1.join(", ")}`);
            }
            return;
        }
        toast.error(`Registration Error: ${error.message || "Unknown error"}`);
        },
    });
    }


  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-radial from-primary/10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Card className="w-full max-w-md bg-sidebar/40 shadow-2xl shadow-primary/10">
        <CardHeader className="space-y-1">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-fit px-0"
            onClick={() => navigate({ to: "/" })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Sign up to get started</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              type="text"
              placeholder="yourusername"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button onClick={() => handleSubmit()} className="w-full">
            Create account
          </Button>

          <div className="text-center mt-2 text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              disabled={register.isPending}
              onClick={() => navigate({ to: "/login" })}
              className="underline underline-offset-4 text-primary font-medium hover:text-primary/80 transition-colors"
            >
              {register.isPending ? (<Loader2 className="animate-spin" />) : "Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
