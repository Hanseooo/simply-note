"use client";

import { useState } from "react";
import { Settings } from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type SettingsDialogProps = {
  trigger?: React.ReactNode;
};

export function SettingsDialog({ trigger }: SettingsDialogProps) {
  const user = useAuthStore((s) => s.user);

  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSaveProfile = () => {
    // TODO: hook to API
    console.log("Update profile", { username, email });
  };

  const handleChangePassword = () => {
    // TODO: hook to API
    console.log("Change password", { currentPassword, newPassword });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your account information and security.
          </DialogDescription>
        </DialogHeader>

        {/* Profile section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">
            Profile Information
          </h4>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <Button onClick={handleSaveProfile} className="mt-2">
            Save Changes
          </Button>
        </div>

        <Separator className="my-6" />

        {/* Password section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">
            Change Password
          </h4>

          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <Button variant="secondary" onClick={handleChangePassword}>
            Update Password
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
