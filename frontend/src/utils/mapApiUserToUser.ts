import { type ApiUser, type User } from "@/types/types";

export const mapApiUserToUser = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  name: apiUser.name,
  email: apiUser.email,
  isAccountVerified: apiUser.isAccountVerified,
  isTwoFactorEnabled: apiUser.is2fa,
  lastLoginAt: apiUser.lastLoginAt,
  createdAt: apiUser.createdAt,
  updatedAt: apiUser.updatedAt,
});
