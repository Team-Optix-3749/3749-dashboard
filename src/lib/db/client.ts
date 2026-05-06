import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL environment variable.")
}

export const sql = postgres(databaseUrl, {
  prepare: false,
})

export const db = drizzle(sql)
