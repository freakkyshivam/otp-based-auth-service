import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  inet,
} from "drizzle-orm/pg-core";

import Users from "./users.schema.js";

export enum ActivityType {
  // Password / Email auth
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILED = "LOGIN_FAILED",

  // OTP / 2FA
  OTP_SENT = "OTP_SENT",
  OTP_FAILED = "OTP_FAILED",
  OTP_SUCCESS = "OTP_SUCCESS",

  // Passkey (WebAuthn)
  PASSKEY_REGISTERED = "PASSKEY_REGISTERED",
  PASSKEY_LOGIN_SUCCESS = "PASSKEY_LOGIN_SUCCESS",
  PASSKEY_LOGIN_FAILED = "PASSKEY_LOGIN_FAILED",
  PASSKEY_REMOVED = "PASSKEY_REMOVED",

  // Account security
  PASSWORD_CHANGED = "PASSWORD_CHANGED",
  PASSWORD_RESET_REQUEST = "PASSWORD_RESET_REQUEST",

  // Sessions
  SESSION_CREATED = "SESSION_CREATED",
  SESSION_REVOKED = "SESSION_REVOKED",

  // Security settings
  TWO_FA_ENABLED = "TWO_FA_ENABLED",
  TWO_FA_DISABLED = "TWO_FA_DISABLED",
}
