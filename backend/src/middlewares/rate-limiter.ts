import rateLimit from "express-rate-limit";

// Strict limiter for POST endpoints susceptible to spam
export const contactFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Max 10 submissions per IP per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many contact requests submitted. Please try again later.",
    errors: [],
  },
});

// Dedicated limiter for public registration submission endpoints.
// Isolated from contactFormLimiter so registration traffic never shares
// a rate-limit bucket with unrelated public/admin write routes.
export const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Max 10 submissions per IP per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many registration requests submitted. Please try again later.",
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
