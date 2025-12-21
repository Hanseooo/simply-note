"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InlineError } from "@/components/ui/InlineError";
import { toast } from "sonner";
import { useChangePassword } from "@/hooks/useChangePassword";

export const ChangePasswordCard = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string>();

  const changePassword = useChangePassword();

  /* ------------------ Validators ------------------ */
  const isNewPasswordValid = useMemo(
    () => newPassword.length >= 8,
    [newPassword]
  );

  const passwordsMatch = useMemo(
    () => newPassword === confirm,
    [newPassword, confirm]
  );

  const isDisabled =
    !currentPassword ||
    !isNewPasswordValid ||
    !passwordsMatch ||
    changePassword.isPending;

  /* ------------------ Handlers ------------------ */
  const handleSubmit = () => {
    setError(undefined);

    changePassword.mutate(
      {
        current_password: currentPassword,
        new_password: newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password updated successfully");
          setCurrentPassword("");
          setNewPassword("");
          setConfirm("");
        },
        onError: (err : any) => {
          setError(
            err.response?.data?.detail ??
              "Unable to change password. Please try again."
          );
        },
      }
    );
  };

  return (
    <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6 space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">
            Change Password
          </h3>
          <p className="text-sm text-muted-foreground">
            Update your account password. Minimum 8 characters.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <Input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="h-10"
          />

          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="h-10"
          />

          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="h-10"
          />

          {/* Inline validation feedback */}
          {!isNewPasswordValid && newPassword && (
            <InlineError message="Password must be at least 8 characters" />
          )}

          {newPassword && confirm && !passwordsMatch && (
            <InlineError message="Passwords do not match" />
          )}

          <InlineError message={error} />
        </div>

        {/* Action */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isDisabled}
            className="font-medium"
          >
            Update Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
