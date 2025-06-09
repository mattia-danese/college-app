// src/stores/useUserStore.ts
import { create } from 'zustand';

export type DBUser = {
  id: number;
  name: string;
  email: string;
  clerk_id: string;
  createdAt: Date;
  updatedAt: Date;
  googleCalendarAccessToken?: string | null;
  googleCalendarRefreshToken?: string | null;
  googleCalendarTokenExpires?: Date | null;
  appleCalendarAccessToken?: string | null;
  appleCalendarRefreshToken?: string | null;
  appleCalendarTokenExpires?: Date | null;
};

type UserStore = {
  user: DBUser | null;
  setUser: (user: DBUser | null) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
