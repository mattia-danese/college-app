// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from 'drizzle-orm';
import {
  index,
  pgTableCreator,
  decimal,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  text,
  unique,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
// export const createTable = pgTableCreator((name) => `college-app_${name}`);
export const createTable = pgTableCreator((name) => name);

export const posts = createTable(
  'post',
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index('name_idx').on(t.name)],
);

export const users = pgTable('users', (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 256 }).notNull(),
  email: d.varchar({ length: 256 }).notNull().unique(),
  clerk_id: d.text().notNull().unique(),
  createdAt: d
    .timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: d
    .timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  // Google Calendar fields
  googleCalendarAccessToken: d.text('google_calendar_access_token'),
  googleCalendarRefreshToken: d.text('google_calendar_refresh_token'),
  googleCalendarTokenExpires: d.timestamp('google_calendar_token_expires', {
    withTimezone: true,
  }),

  // Apple Calendar fields
  appleCalendarAccessToken: d.text('apple_calendar_access_token'),
  appleCalendarRefreshToken: d.text('apple_calendar_refresh_token'),
  appleCalendarTokenExpires: timestamp('apple_calendar_token_expires', {
    withTimezone: true,
  }),
}));

export const lists = pgTable('lists', (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 256 }).notNull(),
  user_id: d
    .integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: d
    .timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: d
    .timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export const list_entries = pgTable(
  'list_entries',
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    user_id: d
      .integer()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    list_id: d
      .integer()
      .notNull()
      .references(() => lists.id, { onDelete: 'cascade' }),
    school_id: d
      .integer()
      .notNull()
      .references(() => schools.id, { onDelete: 'cascade' }),
    createdAt: d
      .timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: d
      .timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  }),
  (t) => ({
    userSchoolUnique: unique().on(t.user_id, t.school_id),
  }),
);

export const schools = pgTable(
  'schools',
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }).notNull(),
    city: d.varchar({ length: 256 }).notNull(),
    state: d.varchar({ length: 256 }).notNull(),
    size: d.integer().notNull(),
    tuition: d.integer().notNull(),
    acceptance_rate: decimal('acceptance_rate', {
      precision: 5,
      scale: 4,
    }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index('school_name_idx').on(t.name)],
);

export const applicationTypeEnum = pgEnum('application_type_enum', [
  'RD',
  'EA',
  'ED',
  'ED2',
]);

export const deadlines = pgTable(
  'deadlines',
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    school_id: d
      .integer()
      .notNull()
      .references(() => schools.id, { onDelete: 'cascade' }),
    application_type: applicationTypeEnum(),
    date: d.date().notNull().$type<Date>(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  //   (t) => [index("deadlines_school_id_idx").on(t.school_id)],
);

export const supplements = pgTable(
  'supplements',
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    school_id: d
      .integer()
      .notNull()
      .references(() => schools.id, { onDelete: 'cascade' }),
    prompt: d.varchar({ length: 256 }).notNull(),
    description: d.varchar({ length: 256 }).notNull(),
    word_count: d.varchar({ length: 256 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  //   (t) => [index("deadlines_school_id_idx").on(t.school_id)],
);

export const calendar_events = pgTable(
  'calendar_events',
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    user_id: d
      .integer()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    supplement_id: d
      .integer()
      .references(() => supplements.id, { onDelete: 'cascade' }),
    deadline_id: d
      .integer()
      .references(() => deadlines.id, { onDelete: 'cascade' }),
    title: d.varchar({ length: 256 }).notNull(),
    description: d.text(),
    start: d.timestamp({ withTimezone: true }).notNull(),
    end: d.timestamp({ withTimezone: true }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    // Enforce that either supplement_id OR deadline_id is set (optional, DB-level check can be done with triggers or partial indexes)
    // But this can't be done with Drizzle directly; you can add app-level validation.

    // Example indexes:
    // index("calendar_events_user_id_idx").on(t.user_id),
    // index("calendar_events_supplement_id_idx").on(t.supplement_id),
    // index("calendar_events_deadline_id_idx").on(t.deadline_id),

    // Unique per user + supplement
    uniqueIndex('unique_user_supplement_event')
      .on(t.user_id, t.supplement_id)
      .where(sql`${t.supplement_id} IS NOT NULL`),

    // Unique per user + deadline
    uniqueIndex('unique_user_deadline_event')
      .on(t.user_id, t.deadline_id)
      .where(sql`${t.deadline_id} IS NOT NULL`),
  ],
);
