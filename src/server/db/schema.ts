// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator, decimal, pgEnum } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
// export const createTable = pgTableCreator((name) => `college-app_${name}`);
export const createTable = pgTableCreator((name) => name);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const schools = createTable(
  "schools",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }).notNull(),
    city: d.varchar({ length: 256 }).notNull(),
    state: d.varchar({ length: 256 }).notNull(),
    size: d.integer().notNull(),
    tuition: d.integer().notNull(),
    acceptance_rate: decimal("acceptance_rate", { precision: 5, scale: 4 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("school_name_idx").on(t.name)],
);

export const applicationTypeEnum = pgEnum("application_type_enum", [
  "RD",
  "EA",
  "ED",
  "ED2",
]);

export const deadlines = createTable(
  "deadlines",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    school_id: d.integer().notNull().references(() => schools.id),
    appication_type: applicationTypeEnum(),
    date: d.date().notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
//   (t) => [index("deadlines_school_id_idx").on(t.school_id)],
);

export const supplements = createTable(
  "supplements",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    school_id: d.integer().notNull().references(() => schools.id),
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
