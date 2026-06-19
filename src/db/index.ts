import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

// Singleton pool — safe to import anywhere server-side.
// Returns null when DB env vars are absent (e.g. build time).
function createDb() {
  if (
    !process.env.DB_HOST ||
    !process.env.DB_USER ||
    !process.env.DB_NAME
  ) {
    return null;
  }
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME,
  });
  return drizzle(pool, { schema, mode: "default" });
}

let _db: ReturnType<typeof createDb> | undefined;

export function getDb() {
  if (_db === undefined) _db = createDb();
  if (!_db) throw new Error("Database not configured. Set DB_HOST, DB_USER, DB_NAME in .env.local");
  return _db;
}

// Convenience re-export for server components / actions that call getDb() directly.
export type Db = NonNullable<ReturnType<typeof createDb>>;
