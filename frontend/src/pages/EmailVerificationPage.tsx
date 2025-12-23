import { useNavigate, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";
import { useEffect, useRef, useState } from "react";
import { useResendVerificationCode } from "@/hooks/useResendVerificationCode";
import { toast } from "sonner";

export default function EmailVerificationPage() {
  const navigate = useNavigate();
  const { key } = useSearch({ from: '/verify-email' });
  const [code, setCode] = useState("");
  const verifyEmail = useVerifyEmail();
  const setAuth = useAuthStore((s) => s.setAuth);
  const resendCode = useResendVerificationCode()
  const [cooldown, setCooldown] = useState(0);
  const didAutoResend = useRef(false);


    useEffect(() => {
    if (cooldown === 0) return;

    const timer = setTimeout(() => {
        setCooldown((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
    }, [cooldown]);

    useEffect(() => {
    if (!key || didAutoResend.current) return;

    resendCode.mutate(key, {
        onSuccess: () => setCooldown(90),
    });

    didAutoResend.current = true;
    }, [key]);




  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-radial from-primary/10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Card className="w-full max-w-md shadow-2xl shadow-primary/10">
        <CardHeader className="space-y-1">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-fit px-0"
            onClick={() => navigate({ to: "/login" })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription>
            Enter the 6-digit code we sent to your email address
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* OTP Input */}
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => setCode(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            className="w-full"
            onClick={() =>
              verifyEmail.mutate(
                { key, code },
                {
                  onSuccess: (data) => {
                    localStorage.setItem("access", data.access);
                    localStorage.setItem("refresh", data.refresh);
                    setAuth(data.user);
                    navigate({ to: "/home" });
                  },
                }
              )
            }
            disabled={verifyEmail.isPending || code.length !== 6}
          >
            Verify email
          </Button>
          <div className="text-sm text-muted-foreground/50 text-center">
            check the spam folder if you don't see the email verification code
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Didn’t receive the code?{" "}
            <button
              disabled={cooldown > 0 || resendCode.isPending}
              onClick={() =>
                resendCode.mutate(key, {
                  onSuccess: () => {
                    toast.success("Verification code resent successfully");
                    setCooldown(90);
                  },
                  onError: (err: any) => {
                    const retryAfter = err?.response?.data?.retry_after;
                    if (retryAfter) setCooldown(retryAfter);
                    toast.error("Please wait before requesting another code");
                  },
                })
              }
              className="underline underline-offset-4 text-primary font-medium
             disabled:opacity-50 disabled:pointer-events-none"
            >
              {cooldown > 0 ? `${cooldown}s` : "resend"}
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
