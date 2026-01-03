import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import Users from "./users.schema.js";

export const backupCodesTable = pgTable("backup_codes", {
  id: uuid().primaryKey().defaultRandom(),

  userId: uuid()
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }),

  hashCode: text().notNull().unique(),

  used: boolean().notNull().default(false),

  usedAt: timestamp({ withTimezone: true }),

  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow(),
});

export default backupCodesTable;
