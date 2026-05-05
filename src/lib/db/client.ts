import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

const databaseUrl = import.meta.env.VITE_DATABASE_URL as string

export const sql = postgres(databaseUrl, {
  prepare: false,
})

export const db = drizzle(sql)
