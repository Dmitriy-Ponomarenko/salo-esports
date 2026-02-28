import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const userSchema = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  full_name: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  avatar_url: text('avatar_url'),
  password_hash: text('password_hash'),
  language: text('language').notNull(),
  created_at: integer('created_at')
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: integer('updated_at')
    .notNull()
    .default(sql`(unixepoch())`),
});
