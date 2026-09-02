import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";

import fixtures from "./modules/fixtures/fixtures.routes";
import standings from "./modules/standings/standings.routes";
import scorers from "./modules/scorers/scorers.routes";
import gallery from "./modules/gallery/gallery.routes";
import contacts from "./modules/contact/contacts.routes";
import tournament from "./modules/tournament/tournament.routes";

import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import { logger } from "./utils/logger"; // Importing standalone Pino logger instance

const app = express();

// 1. HTTP Request Logger Middleware
app.use(pinoHttp({ logger }));

// 2. Body Parser Middleware
app.use(express.json());

// 3. CORS Configuration
const ALLOWED_ORIGIN_ENV = process.env.ALLOWED_ORIGINS;
const allowedOrigins = ALLOWED_ORIGIN_ENV
    ? ALLOWED_ORIGIN_ENV.split(",")
    : ["http://localhost:3000", "http://localhost:5173"];

app.use(
    cors({
      origin: ALLOWED_ORIGIN_ENV === "*" ? "*" : allowedOrigins,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  req.log.info("Health check endpoint hit");
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Module Routes
app.use("/api/v1/fixtures", fixtures);
// app.use("/api/v1/standings", standings);
// app.use("/api/v1/scorers", scorers);
// app.use("/api/v1/gallery", gallery);
// app.use("/api/v1/contacts", contacts);
// app.use("/api/v1/tournament", tournament);

// Global Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;