import { Database } from "bun:sqlite";
import { BunSQLiteDatabase, drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "../db/schema.ts";
import { resolve, dirname } from "path";
import { mkdirSync } from "fs";

let databasePath: string;

if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
  // Resolves to pesa_cup/data/pesa_cup_futsal_dev.db
  databasePath = resolve(import.meta.dir, "../../../data/pesa_cup_futsal_dev.db");
} else {
  // Resolves to pesa_cup/data/pesa_cup_futsal_prod.db
  databasePath = process.env.DATABASE_PATH
    ? resolve(process.cwd(), process.env.DATABASE_PATH)
    : resolve(import.meta.dir, "../../../data/pesa_cup_futsal_prod.db");
}
// Ensure the root data directory exists before opening SQLite
mkdirSync(dirname(databasePath), { recursive: true });

console.log(`Using database file: ${databasePath}`);

const client = new Database(databasePath);

// 2. Enable Write-Ahead Logging (WAL) for concurrent read/write performance
client.run("PRAGMA journal_mode=WAL;");

client.run("PRAGMA foreign_keys = ON;");

// 3. Optional: Configure busy timeout to handle unexpected lock contention
client.run("PRAGMA busy_timeout = 5000;");

// 4. Initialize Drizzle ORM session with schema
const dbSession: BunSQLiteDatabase<typeof schema> = drizzle(client, { schema });
export { dbSession, client };
