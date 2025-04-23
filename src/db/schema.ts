import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const scores = pgTable('scores', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  score: integer('score').notNull(),
  date: timestamp('date', { mode: 'string' }).notNull().defaultNow(),
});
