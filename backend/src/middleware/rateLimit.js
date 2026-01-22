import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: config.rateLimit.windowMs / 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//stricter rate limit for audit endpoints (more expensive)
export const auditRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, //limit each IP to 10 audit requests per window
  message: {
    error: 'Audit request limit exceeded. Please try again later.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
});