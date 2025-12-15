import { redirect } from "@tanstack/react-router";

export function requireAuth() {
  return () => {
    const isLoggedIn = Boolean(localStorage.getItem("token")); // replace with your auth state
    if (!isLoggedIn) {
      throw redirect({ to: "/login" });
    }
  };
}

export function requireGuest() {
  return () => {
    const isLoggedIn = Boolean(localStorage.getItem("token"));
    if (isLoggedIn) {
      throw redirect({ to: "/home" });
    }
  };
}
