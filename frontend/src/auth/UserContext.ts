import { createContext } from "react";
import {type User,type Session } from "@/types/types";
import type { AuthState } from "./AuthState";

export interface AuthContextType extends AuthState {
   setUser: (user: User | null) => void;
  setCurrentSession: (session: Session | null) => void;
  setActiveSessionCount: (count: number) => void;
  resetAuth: () => void;
}

export const UserContext = createContext<AuthContextType | null>(null)