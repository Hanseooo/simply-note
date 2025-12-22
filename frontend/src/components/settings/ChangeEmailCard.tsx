"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InlineError } from "@/components/ui/InlineError";
import { toast } from "sonner";
import { useVerifyEmailChange } from "@/hooks/useVerifyEmailChange";
import { useRequestEmailChange } from "@/hooks/useRequestEmailChange";

export const ChangeEmailCard = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [error, setError] = useState<string>();

  const requestChange = useRequestEmailChange();
  const verifyChange = useVerifyEmailChange();

  const isEmailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const isCodeValid = useMemo(() => /^[0-9]{6}$/.test(code), [code]);

  const handleRequest = () => {
    setError(undefined);
    requestChange.mutate(email, {
      onSuccess: () => {
        toast.success("Verification code sent");
        setStep("code");
      },
      onError: (err: any) => {
        setError(err.response?.data?.detail ?? "Something went wrong");
      },
    });
  };

  const handleVerify = () => {
    verifyChange.mutate(
      { email, code },
      {
        onSuccess: () => {
          toast.success("Email updated successfully");
          setEmail("");
          setCode("");
          setStep("email");
        },
        onError: (err: any) => {
          setError(err.response?.data?.detail ?? "Verification failed");
        },
      }
    );
  };

  const isDisabled =
    (step === "email" && !isEmailValid) || (step === "code" && !isCodeValid);

  return (
    <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6 space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">
            Change Email
          </h3>
          <p className="text-sm text-muted-foreground">
            Update your account email and verify with a 6-digit code.
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-2">
          {step === "email" && (
            <>
              <Input
                placeholder="New email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
              />
              <InlineError message={error} />
              <Button
                onClick={handleRequest}
                disabled={isDisabled}
                className="font-medium w-full mt-2"
              >
                Send Verification Code
              </Button>
            </>
          )}

          {step === "code" && (
            <>
              <Input
                placeholder="6-digit verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="h-10"
              />
              <InlineError message={error} />
              <Button
                onClick={handleVerify}
                disabled={isDisabled}
                className="font-medium w-full"
              >
                Verify & Update Email
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
