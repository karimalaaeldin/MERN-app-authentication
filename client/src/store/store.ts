import { create } from "zustand";

interface AuthState {
  auth: {
    username: string;
    active: boolean;
  };
  setUsername: (name: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  auth: {
    username: "",
    active: false,
  },
  setUsername: (name: string) =>
    set((state) => ({ auth: { ...state.auth, username: name } })),
}));
