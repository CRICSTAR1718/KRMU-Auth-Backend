const { pgTable, text, numeric, integer, jsonb, uuid, timestamp, foreignKey } = require('drizzle-orm/pg-core')
const { users } = require('./user.model')

const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  price: numeric('price').notNull(),
  stock: integer('stock').notNull(),
  images: jsonb('images').notNull().default([]),
  user_id: uuid('user_id').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdFk: foreignKey({
    columns: [table.user_id],
    foreignColumns: [users.id],
  }).onDelete('cascade'),
}))

module.exports = { products }
