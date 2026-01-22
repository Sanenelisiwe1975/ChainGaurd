import express from 'express';
import { auditContract, quickAnalysis, getAuditById } from '../controllers/auditController.js';
import { auditRateLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

/**
 * POST /api/audit/analyze
 * Full audit with IPFS storage
 */
router.post('/analyze', auditRateLimiter, auditContract);

/**
 * POST /api/audit/quick
 * Quick AI analysis only (no storage)
 */
router.post('/quick', auditRateLimiter, quickAnalysis);

/**
 * GET /api/audit/:auditId
 * Get audit by ID
 */
router.get('/:auditId', getAuditById);

export default router;