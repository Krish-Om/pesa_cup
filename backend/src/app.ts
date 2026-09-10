import cors from "cors";
import express from "express";
import { join } from "node:path";
import pinoHttp from "pino-http";

import { requireAdmin } from "./middlewares/auth";
import { BASE_UPLOAD_DIR } from "./utils/local-storage";

import contacts from "./modules/contact/contacts.routes";
import fixtures from "./modules/fixtures/fixtures.routes";
import gallery from "./modules/gallery/gallery.routes";
import registrations from "./modules/registrations/registrations.routes";
import scorers from "./modules/scorers/scorers.routes";
import standings from "./modules/standings/standings.routes";
import tournament, {
  tournamentsRouter,
} from "./modules/tournament/tournament.routes";

import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import { logger } from "./utils/logger";

const app = express();

// ── 1. Request logger ────────────────────────────────────────────────────────
app.use(pinoHttp({ logger }));

// ── 2. Body parser ───────────────────────────────────────────────────────────
app.use(express.json());

// ── 4. CORS ──────────────────────────────────────────────────────────────────
const ALLOWED_ORIGIN_ENV = process.env.ALLOWED_ORIGINS;
const allowedOrigins = ALLOWED_ORIGIN_ENV
  ? ALLOWED_ORIGIN_ENV.split(",")
  : ["http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: ALLOWED_ORIGIN_ENV === "*" ? "*" : allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ── 3. Static file serving — one route per upload category ──────────────────
//
// Payment receipts contain sensitive financial data and are restricted to
// admin callers (Authorization: Bearer <ADMIN_API_KEY>).
app.use(
  "/uploads/receipts",
  requireAdmin,
  express.static(join(BASE_UPLOAD_DIR, "receipts")),
);

// Tournament gallery photos are public.
app.use("/uploads/gallery", express.static(join(BASE_UPLOAD_DIR, "gallery")));
app.use("/uploads/misc", express.static(join(BASE_UPLOAD_DIR, "misc")));

// ── 5. Health check ──────────────────────────────────────────────────────────
app.get("/api/v1/health", (req, res) => {
  req.log.info("Health check endpoint hit");
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── 6. Module routes ─────────────────────────────────────────────────────────
app.use("/api/v1/fixtures", fixtures);
app.use("/api/v1/contacts", contacts);
app.use("/api/v1/registrations", registrations);
app.use("/api/v1/standings", standings);
app.use("/api/v1/gallery", gallery);
app.use("/api/v1/scorers", scorers);
app.use("/api/v1/tournament", tournament);
app.use("/api/v1/tournaments", tournamentsRouter);

// ── 7. Global error handlers ─────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
