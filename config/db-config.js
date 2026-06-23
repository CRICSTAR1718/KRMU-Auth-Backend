require('dotenv').config()
const { drizzle } = require('drizzle-orm/postgres-js')
const postgres = require('postgres')

const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
})

const db = drizzle(client)

  // One-time DB connectivity message
  ; (async () => {
    try {
      // Lightweight ping to verify connectivity
      await client`select 1 as ok`
      console.log('✅ Connected to database')
    } catch (err) {
      console.error('❌ Database connection failed:', err?.message || err)
    }
  })()

module.exports = { db }

