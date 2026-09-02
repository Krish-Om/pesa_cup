import rateLimit from "express-rate-limit";

// Strict limiter for POST endpoints susceptible to spam
export const contactFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Max 5 submissions per IP per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many contact requests submitted. Please try again later.",
    errors: [],
  },
});

// General limiter for public GET routes (Fixtures, Standings)
export const apiReadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 100, // Max 100 requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
    errors: [],
  },
});
