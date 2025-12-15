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

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <motion.div className="min-h-screen flex items-center justify-center bg-radial from-primary/10 px-4"
    initial={{ opacity: 0, }}
    animate={{ opacity: 1, }}
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
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>

          <Button className="w-full">Login</Button>

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
