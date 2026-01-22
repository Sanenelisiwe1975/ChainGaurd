import express from 'express';
import { verifySignature } from '../utils/crypto.js';
import { getFromIPFS } from '../services/ipfsService.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/verify
 * Verify an audit report's authenticity
 */
router.post('/', async (req, res, next) => {
  try {
    const { cid, signature } = req.body;

    if (!cid || !signature) {
      return res.status(400).json({
        success: false,
        error: 'CID and signature are required'
      });
    }

    logger.info(`Verifying report: ${cid}`);

    // Retrieve report from IPFS
    const report = await getFromIPFS(cid);

    // Extract signature from report
    const reportSignature = report.signature;
    delete report.signature;

    // Verify the signature
    const isValid = verifySignature(report, reportSignature);

    res.json({
      success: true,
      data: {
        verified: isValid,
        cid,
        auditId: report.auditId,
        timestamp: report.timestamp,
        contractHash: report.contract.hash
      }
    });
  } catch (error) {
    logger.error('Verification error:', error);
    next(error);
  }
});

export default router;