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
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useLogin } from "@/hooks/useLogin";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const setAuth = useAuthStore((s) => s.setAuth)

    function handleSubmit() {
    // Frontend validation
    if (username.trim().length < 3) {
        toast.error("Username must be at least 3 characters");
        return;
    }

    if (password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
    }

    login.mutate(
      { username, password },
      {
        onSuccess: (data) => {
          // Check if JWT tokens and user object exist
          if (!data.access || !data.refresh || !data.user) {
            toast.error("Login succeeded but missing authentication data.");
            return;
          }

          toast.success("Logged in successfully!");
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);
          setAuth(data.user);
          navigate({to: "/home"})
        },
        onError: (error: any) => {
          // Check for DRF error formats
          if (error.response?.data) {
            const errData = error.response.data;

            // 1️⃣ detail field
            if (errData.detail) {
              toast.error(errData.detail);
              return;
            }

            // 2️⃣ non_field_errors array
            if (
              errData.non_field_errors &&
              errData.non_field_errors.length > 0
            ) {
              toast.error(errData.non_field_errors.join(" "));
              return;
            }

            // 3️⃣ field-specific errors
            const fieldErrors = Object.entries(errData)
              .map(([field, messages]) => {
                // Ensure messages is an array
                const msgs: string[] = Array.isArray(messages)
                  ? messages
                  : [messages];
                return `${field}: ${msgs.join(", ")}`;
              })
              .join(" | ");
            if (fieldErrors) {
              toast.error(fieldErrors);
              return;
            }
          }

          // Fallback error
          toast.error(
            error.message || "Failed to log in. Please check your credentials."
          );
        },
      }
    );
    }


  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-radial from-primary/10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Card className="w-full max-w-md shadow-2xl bg-card/50 shadow-primary/10">
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

          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Username or Email</Label>
            <Input
              id="email"
              type="text"
              placeholder="you@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className=" flex">
            <Button 
            onClick={() => navigate({to : "/forgot-password"})}
            className="self-end text-primary h-6 ml-auto justify-end"
            variant={"link"}>
              Forgot Password
            </Button>
          </div>

          <Button className="w-full" onClick={() => handleSubmit()}>
            Login
          </Button>

          <div className="text-center mt-2 text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate({ to: "/register" })}
              className="underline underline-offset-4 text-primary font-medium hover:text-primary/80 transition-colors"
            >
              Sign up
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
