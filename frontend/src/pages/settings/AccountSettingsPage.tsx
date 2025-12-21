import { AuthTitle } from "@/components/auth/AuthTitle";
import { ChangeUsernameCard } from "@/components/settings/ChangeUsernameCard";
import { ChangeEmailCard } from "@/components/settings/ChangeEmailCard";
import { ChangePasswordCard } from "@/components/settings/ChangePasswordCard";

export default function AccountSettingsPage() {
  return (  
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <AuthTitle
        first="Account"
        second="Settings"
        subtitle="Manage your personal information and security"
      />

      <ChangeUsernameCard />
      <ChangeEmailCard />
      <ChangePasswordCard />
    </div>
  );
}
