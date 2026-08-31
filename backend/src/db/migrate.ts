// src/db/migrate.ts
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { dbSession } from '../config/database';
import { resolve } from 'path';

async function runMigrations() {
  console.log('Running database migrations...');
  
  try {
    const migrationsFolder = resolve(import.meta.dir, '../../drizzle');
    
    await migrate(dbSession, { migrationsFolder });
    console.log('✓ Migrations completed successfully.');
  } catch (error) {
    console.error('× Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();