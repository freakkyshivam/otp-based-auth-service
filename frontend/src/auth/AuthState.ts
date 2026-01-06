import type { User, Session } from "@/types/types";

export interface AuthState {
  user: User | null;
  currentSession: Session | null;
  activeSessionCount: number;
}
