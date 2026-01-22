import { getFromIPFS } from '../services/ipfsService.js';
import logger from '../utils/logger.js';

/**
 * Retrieve audit report from IPFS
 */
export const getReport = async (req, res, next) => {
  try {
    const { cid } = req.params;

    logger.info(`Retrieving report from IPFS: ${cid}`);
    
    const report = await getFromIPFS(cid);

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    logger.error('IPFS retrieval error:', error);
    next(error);
  }
};

export default {
  getReport
};