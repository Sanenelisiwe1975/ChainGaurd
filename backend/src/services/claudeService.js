import Anthropic from '@anthropic-ai/sdk';
import config from '../config/index.js';
import logger from '../utils/logger.js';

const anthropic = new Anthropic({
  apiKey: config.anthropic.apiKey,
});

/**
 * Analyze smart contract using Claude AI
 */
export const analyzeContract = async (code, language = 'solidity') => {
  try {
    logger.info(`Starting AI analysis for ${language} contract`);

    const prompt = buildAnalysisPrompt(code, language);
    
    const message = await anthropic.messages.create({
      model: config.anthropic.model,
      max_tokens: config.anthropic.maxTokens,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3 // Lower temperature for more consistent security analysis
    });

    const response = message.content[0].text;
    logger.info('AI analysis completed successfully');

    // Parse the JSON response from Claude
    const analysis = parseAnalysisResponse(response);
    
    return analysis;
  } catch (error) {
    logger.error('Claude API error:', error);
    throw error;
  }
};

/**
 * Build the analysis prompt for Claude
 */
const buildAnalysisPrompt = (code, language) => {
  return `You are an expert smart contract security auditor. Analyze the following ${language} smart contract for security vulnerabilities.

SMART CONTRACT CODE:
\`\`\`${language}
${code}
\`\`\`

Perform a comprehensive security audit and respond ONLY with valid JSON in this exact format (no markdown, no backticks):

{
  "overallRisk": "LOW|MEDIUM|HIGH|CRITICAL",
  "securityScore": 0-100,
  "summary": "Brief 2-3 sentence overview of the contract and main findings",
  "vulnerabilities": [
    {
      "type": "vulnerability type (e.g., Reentrancy, Access Control, etc.)",
      "severity": "LOW|MEDIUM|HIGH|CRITICAL",
      "description": "Detailed description of the vulnerability",
      "location": "Function or line reference",
      "recommendation": "How to fix this issue"
    }
  ],
  "bestPractices": [
    {
      "category": "category name",
      "status": "PASS|FAIL|WARNING",
      "description": "What was checked"
    }
  ],
  "gasOptimization": [
    {
      "location": "where the optimization applies",
      "suggestion": "optimization recommendation",
      "estimatedSavings": "estimated gas savings"
    }
  ],
  "recommendations": [
    "List of general recommendations for improving the contract"
  ]
}

Focus on these critical vulnerability types:
1. Reentrancy attacks
2. Access control issues
3. Integer overflow/underflow
4. Unchecked external calls
5. Front-running vulnerabilities
6. Gas limit issues
7. Timestamp dependence
8. Logic errors

Be thorough but concise. Every vulnerability must have clear remediation steps.`;
};

/**
 * Parse Claude's response into structured data
 */
const parseAnalysisResponse = (response) => {
  try {
    // Remove any markdown formatting if present
    const cleaned = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const analysis = JSON.parse(cleaned);
    
    // Validate required fields
    if (!analysis.overallRisk || !analysis.securityScore || !analysis.vulnerabilities) {
      throw new Error('Invalid analysis response format');
    }
    
    return analysis;
  } catch (error) {
    logger.error('Failed to parse AI response:', error);
    // Return a fallback structure
    return {
      overallRisk: 'UNKNOWN',
      securityScore: 0,
      summary: 'Failed to parse analysis results',
      vulnerabilities: [],
      bestPractices: [],
      gasOptimization: [],
      recommendations: ['Manual review required - automated analysis failed'],
      parseError: true
    };
  }
};

export default {
  analyzeContract
};