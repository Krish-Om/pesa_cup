import { Database } from "bun:sqlite";

let databasePath;

if (process.env.NODE_ENV === "development" ) {
    databasePath = "./pesa_cup_dev.sqlite";
    console.log(`Using database file: ${databasePath}`);
}else{
    databasePath = process.env.DATABASE_PATH || "./pesa_cup_prod.sqlite";
    console.log(`Using database file: ${databasePath}`);
}

const database = new Database(databasePath, {
    create: true,
});

export type DbQueryParams = readonly any[];

export interface DbSession {
    query<T = Record<string, unknown>>(
        queryString: string,
        params?: DbQueryParams
    ): Promise<T[]>;
    execute(queryString: string, params?: DbQueryParams): Promise<number>;
    transaction<T>(handler: () => T): T;
    close(): void;
}

const dbSession: DbSession = {
    async query<T = Record<string, unknown>>(
        queryString: string,
        params: DbQueryParams = []
    ) {
        return database.query(queryString).all(...params) as T[];
    },
    async execute(queryString: string, params: DbQueryParams = []) {
        return database.query(queryString).run(...params).changes;
    },
    transaction<T>(handler: () => T) {
        return database.transaction(handler)();
    },
    close() {
        database.close();
    },
};

export default dbSession;
export { database };

