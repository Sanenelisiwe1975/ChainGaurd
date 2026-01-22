import express from 'express';
import { getReport } from '../controllers/ipfsController.js';

const router = express.Router();

/**
 * GET /api/ipfs/:cid
 * Retrieve report from IPFS by CID
 */
router.get('/:cid', getReport);

export default router;