import { create } from 'ipfs-http-client';
import config from '../config/index.js';
import logger from '../utils/logger.js';

let ipfsClient;

/**
 * Initialize IPFS client
 */
const initIPFS = () => {
  if (!ipfsClient) {
    ipfsClient = create({
      host: config.ipfs.host,
      port: config.ipfs.port,
      protocol: config.ipfs.protocol
    });
    logger.info('IPFS client initialized');
  }
  return ipfsClient;
};

/**
 * Upload audit report to IPFS
 */
export const uploadToIPFS = async (data) => {
  try {
    const client = initIPFS();
    
    // Convert data to JSON string
    const content = JSON.stringify(data, null, 2);
    
    // Upload to IPFS
    const result = await client.add(content);
    
    logger.info(`Report uploaded to IPFS: ${result.path}`);
    
    return {
      cid: result.path,
      size: result.size,
      url: `https://ipfs.io/ipfs/${result.path}`
    };
  } catch (error) {
    logger.error('IPFS upload error:', error);
    throw new Error('Failed to upload to IPFS: ' + error.message);
  }
};

/**
 * Retrieve audit report from IPFS
 */
export const getFromIPFS = async (cid) => {
  try {
    const client = initIPFS();
    
    // Retrieve from IPFS
    const chunks = [];
    for await (const chunk of client.cat(cid)) {
      chunks.push(chunk);
    }
    
    const data = Buffer.concat(chunks).toString('utf-8');
    
    logger.info(`Report retrieved from IPFS: ${cid}`);
    
    return JSON.parse(data);
  } catch (error) {
    logger.error('IPFS retrieval error:', error);
    throw new Error('Failed to retrieve from IPFS: ' + error.message);
  }
};

/**
 * Pin content to ensure persistence
 */
export const pinContent = async (cid) => {
  try {
    const client = initIPFS();
    await client.pin.add(cid);
    logger.info(`Content pinned: ${cid}`);
    return true;
  } catch (error) {
    logger.error('IPFS pin error:', error);
    return false;
  }
};

export default {
  uploadToIPFS,
  getFromIPFS,
  pinContent
};