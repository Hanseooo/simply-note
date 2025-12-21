import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthTitle } from "@/components/auth/AuthTitle";
import { InlineError } from "@/components/ui/InlineError";
import { useResetPassword } from "@/hooks/useResetPassword";
import { toast } from "sonner";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const { token } = useSearch({ from: "/reset-password" });

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string>();

  const { mutate, isPending } = useResetPassword();

  const handleSubmit = () => {
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    mutate(
      { token, password },
      {
        onSuccess: () => {
          toast.success("Password reset successfully");
          navigate({to : "/login"});
        },
        onError: (err: any) => {
          setError(err.response?.data?.detail);
        },
      }
    );
  };

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 flex flex-col justify-center">
      <Button
        onClick={() => navigate({ to: "/login" })}
        variant="ghost"
        className="mb-6 flex w-fit items-center gap-2 px-0 text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <AuthTitle
        first="Reset"
        second="Password"
        subtitle="Choose a new secure password"
      />

      <div className="space-y-4 mt-4">
        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <InlineError message={error} />

        <Button
          onClick={handleSubmit}
          disabled={!password || isPending}
          className="w-full font-semibold"
        >
          Reset Password
        </Button>
      </div>
    </div>
  );
}
