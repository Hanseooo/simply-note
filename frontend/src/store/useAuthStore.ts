import { create } from "zustand";
import type { User } from "@/types/apiResponse";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setAuth: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearAuth: () => {
    localStorage.clear();
    sessionStorage.removeItem("welcomeDialogSeen");
    set({ user: null, isAuthenticated: false });
  },
}));
