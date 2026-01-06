import {
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { UserContext } from "./UserContext";
import type { User, Session } from "@/types/types";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [activeSessionCount, setActiveSessionCount] = useState<number>(0);

  const resetAuth = () => {
    setUser(null);
    setCurrentSession(null);
    setActiveSessionCount(0);
    localStorage.removeItem("user");
  };

  const value = useMemo(
    () => ({
      user,
      currentSession,
      activeSessionCount,
      setUser,
      setCurrentSession,
      setActiveSessionCount,
      resetAuth,
    }),
    [user, currentSession, activeSessionCount]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
