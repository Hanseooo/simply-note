"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthTitle } from "@/components/auth/AuthTitle";
import { InlineError } from "@/components/ui/InlineError";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

  const { mutate, isPending } = useForgotPassword();

  const isEmailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);

  const handleSubmit = () => {
    setError(undefined);

    mutate(email, {
      onSuccess: () => {
        setSubmitted(true);
      },
      onError: () => {
        setError("Unable to send reset link. Please try again.");
      },
    });
  };

  return (
    <motion.main
    initial={{opacity: 0.2}}
    animate={{opacity: 1}}
    transition={{duration: 0.3, ease:"easeIn"}}
     className="mx-auto min-h-screen max-w-md px-4 flex flex-col justify-center">
      {/* Back button */}
      <Button
        onClick={() => navigate({ to: "/login" })}
        variant="ghost"
        className="mb-6 flex w-fit items-center gap-2 px-0 text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <AuthTitle
        first="Forgot"
        second="Password"
        subtitle="We’ll send you a secure reset link"
      />

      {!submitted ? (
        <div className="mt-8 space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
            {!isEmailValid && email && (
              <InlineError message="Please enter a valid email address" />
            )}
            <InlineError message={error} />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!isEmailValid || isPending}
            className="w-full font-semibold"
          >
            Send Reset Link
          </Button>
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-border/60 bg-card/50 p-4 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            If an account exists with this email, you’ll receive a password
            reset link shortly.
          </p>
        </div>
      )}
    </motion.main>
  );
}
