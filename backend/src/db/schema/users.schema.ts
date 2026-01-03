import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: varchar("name", { length: 250 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),

  password: text("password").notNull(),

is2fa: boolean("is_2fa").notNull().default(false),

twoFactorSecret: text("two_factor_secret"),
twoFactorNonce: text("two_factor_nonce"),

isAccountDeleted: boolean("is_account_deleted").notNull().default(false),
isAccountVerified: boolean("is_account_verified").notNull().default(false),


  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),

  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export default Users;
