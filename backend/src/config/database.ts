import { Database } from "bun:sqlite";
import { BunSQLiteDatabase, drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "../db/schema.ts";

let databasePath;

if (process.env.NODE_ENV === "development") {
  databasePath = "../data/pesa_cup_dev.sqlite";
  console.log(`Using database file: ${databasePath}`);
} else {
  databasePath = process.env.DATABASE_PATH || "./pesa_cup_prod.sqlite";
  console.log(`Using database file: ${databasePath}`);
}
const client = new Database(databasePath);

// 2. Enable Write-Ahead Logging (WAL) for concurrent read/write performance
client.run("PRAGMA journal_mode=WAL;");

client.run("PRAGMA foreign_keys = ON;");

// 3. Optional: Configure busy timeout to handle unexpected lock contention
client.run("PRAGMA busy_timeout = 5000;");

// 4. Initialize Drizzle ORM session with schema
const dbSession: BunSQLiteDatabase<typeof schema> = drizzle(client, { schema });
export { dbSession, client };

// const database = new Database(databasePath, {
//     create: true,
// });

// export type DbQueryParams = readonly any[];

// export interface DbSession {
//     query<T = Record<string, unknown>>(
//         queryString: string,
//         params?: DbQueryParams
//     ): Promise<T[]>;
//     execute(queryString: string, params?: DbQueryParams): Promise<number>;
//     transaction<T>(handler: () => T): T;
//     close(): void;
// }

// const dbSession: DbSession = {
//     async query<T = Record<string, unknown>>(
//         queryString: string,
//         params: DbQueryParams = []
//     ) {
//         return database.query(queryString).all(...params) as T[];
//     },
//     async execute(queryString: string, params: DbQueryParams = []) {
//         return database.query(queryString).run(...params).changes;
//     },
//     transaction<T>(handler: () => T) {
//         return database.transaction(handler)();
//     },
//     close() {
//         database.close();
//     },
// };
