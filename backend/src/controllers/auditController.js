import { analyzeContract } from '../services/claudeService.js';
import { uploadToIPFS, pinContent } from '../services/ipfsService.js';
import { generateReport, formatMarkdownReport } from '../services/reportService.js';
import { validateContract } from '../utils/validators.js';
import logger from '../utils/logger.js';

/**
 * Main audit endpoint - analyzes contract and stores report
 */
export const auditContract = async (req, res, next) => {
  try {
    logger.info('Received audit request');

    // Validate input
    const { error, value } = validateContract(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { code, language, name, version } = value;

    // Step 1: Analyze contract with AI
    logger.info('Step 1: Analyzing contract with AI');
    const analysisResult = await analyzeContract(code, language);

    // Step 2: Generate comprehensive report
    logger.info('Step 2: Generating audit report');
    const report = generateReport(
      { code, language, name, version },
      analysisResult
    );

    // Step 3: Try to upload to IPFS (optional, don't fail if unavailable)
    let ipfsResult = null;
    try {
      logger.info('Step 3: Uploading report to IPFS');
      ipfsResult = await uploadToIPFS(report);
      
      // Step 4: Pin the content
      try {
        await pinContent(ipfsResult.cid);
      } catch (pinError) {
        logger.warn('Failed to pin content, continuing anyway:', pinError.message);
      }
    } catch (ipfsError) {
      logger.warn('IPFS upload failed, continuing with local report:', ipfsError.message);
      // Continue without IPFS - not a critical failure
    }

    // Step 5: Generate markdown version
    const markdownReport = formatMarkdownReport(report);

    logger.info(`Audit completed successfully: ${report.auditId}`);

    // Return the complete audit data
    res.json({
      success: true,
      data: {
        auditId: report.auditId,
        contractHash: report.contract.hash,
        securityScore: report.analysis.securityScore,
        overallRisk: report.analysis.overallRisk,
        ipfs: ipfsResult ? {
          cid: ipfsResult.cid,
          url: ipfsResult.url,
          size: ipfsResult.size
        } : null,
        report: {
          json: report,
          markdown: markdownReport
        },
        summary: {
          totalVulnerabilities: report.findings.vulnerabilities.length,
          criticalIssues: report.findings.vulnerabilities.filter(v => v.severity === 'CRITICAL').length,
          highIssues: report.findings.vulnerabilities.filter(v => v.severity === 'HIGH').length,
          mediumIssues: report.findings.vulnerabilities.filter(v => v.severity === 'MEDIUM').length,
          lowIssues: report.findings.vulnerabilities.filter(v => v.severity === 'LOW').length
        }
      }
    });
  } catch (error) {
    logger.error('Audit error:', error);
    next(error);
  }
};

/**
 * Quick analysis endpoint - AI analysis only, no IPFS storage
 */
export const quickAnalysis = async (req, res, next) => {
  try {
    const { error, value } = validateContract(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { code, language } = value;
    
    logger.info('Performing quick analysis');
    const analysisResult = await analyzeContract(code, language);

    res.json({
      success: true,
      data: analysisResult
    });
  } catch (error) {
    logger.error('Quick analysis error:', error);
    next(error);
  }
};

/**
 * Get audit status/info by ID
 */
export const getAuditById = async (req, res, next) => {
  try {
    const { auditId } = req.params;
    
    // In a real app, you'd fetch from database
    // For MVP, we'll return a placeholder
    res.json({
      success: true,
      message: 'Audit retrieval endpoint - to be implemented with database',
      auditId
    });
  } catch (error) {
    next(error);
  }
};

export default {
  auditContract,
  quickAnalysis,
  getAuditById
};