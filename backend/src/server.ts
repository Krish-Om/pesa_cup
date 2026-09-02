// server.ts
import app from "./app";
import { dbSession } from "./config/database";
import { migrate } from "drizzle-orm/bun-sqlite/migrator"; // Or your respective DB driver migrator
import { logger } from "./utils/logger";

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    // Run pending SQL migrations automatically on startup
    logger.info("Running database migrations...");
    migrate(dbSession, {migrationsFolder: "./drizzle"});
    logger.info("Database migrations completed successfully.");

    // Start HTTP listener
    app.listen(PORT, () => {
      logger.info(`✓ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error({ error }, "Failed to run migrations or start server");
    process.exit(1);
  }
}

startServer();