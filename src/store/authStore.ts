import { User } from "@/types";
import { create } from "zustand";

interface AuthState {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoadingUser: boolean;
    setIsLoadingUser: (isLoadingUser: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoadingUser: true,
    setUser: (user: User | null) => set({ user }),
    setIsLoadingUser: (isLoadingUser: boolean) => set({ isLoadingUser }),
}))