import crypto from 'crypto';

/**
 * Generate SHA256 hash of content
 */
export const generateHash = (content) => {
  return '0x' + crypto
    .createHash('sha256')
    .update(content)
    .digest('hex');
};

/**
 * Generate a unique audit ID
 */
export const generateAuditId = () => {
  return 'audit_' + crypto.randomBytes(16).toString('hex');
};

/**
 * Create a signature for the audit report
 */
export const signReport = (reportData, privateKey = null) => {
  //for MVP, we'll use a simple HMAC signature
  //in production, use proper cryptographic signatures
  const secret = privateKey || process.env.SIGNING_SECRET || 'chainguard-secret';
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(reportData));
  return hmac.digest('hex');
};

/**
 * Verify a report signature
 */
export const verifySignature = (reportData, signature, privateKey = null) => {
  const expectedSignature = signReport(reportData, privateKey);
  return signature === expectedSignature;
};