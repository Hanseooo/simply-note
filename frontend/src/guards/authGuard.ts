import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Auth guard - token-based only
 */
export function requireAuth() {
  return () => {
    const token = localStorage.getItem("access");
    if (!token) {
      throw redirect({ to: "/login" });
    }
  };
}

/**
 * Email verification guard
 */
export function requireVerifiedEmail() {
  return () => {
    const { user } = useAuthStore.getState();

    // User not loaded yet, let the page fetch
    if (!user) return;

    // If email not verified, redirect to verify-email with key
    if (!user.is_email_verified) {
      throw redirect({
        to: "/verify-email",
        search: {
          key: String(user.id),
        },
      });
    }
  };
}

/**
 * Guest-only guard
 */
export function requireGuest() {
  return () => {
    const token = localStorage.getItem("access");
    if (token) {
      throw redirect({ to: "/home" });
    }
  };
}
