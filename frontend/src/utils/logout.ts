// logout.ts
import { logoutApi } from "@/api/authApi";
import type { AuthContextType } from "@/auth/UserContext";

export async function logout(resetAuth: AuthContextType["resetAuth"]) {
  await logoutApi();
  localStorage.clear();
  resetAuth();
  window.location.href = "/login";
}
