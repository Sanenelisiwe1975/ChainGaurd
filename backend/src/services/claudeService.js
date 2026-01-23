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

    // Check if API key is valid (starts with sk-ant-)
    if (!config.anthropic.apiKey || config.anthropic.apiKey === 'sk-ant-test-key' || !config.anthropic.apiKey.startsWith('sk-ant-')) {
      logger.warn('Invalid or missing Anthropic API key, using demo response');
      return generateDemoAnalysis(code, language);
    }

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
    // Return demo response on error
    return generateDemoAnalysis(code, language);
  }
};

/**
 * Generate a demo analysis for testing without valid API key
 */
const generateDemoAnalysis = (code, language) => {
  logger.info('Generating demo analysis response');
  
  const hasReentrancy = code.includes('call{') || code.includes('.call(');
  const hasExternalCall = code.includes('external');
  const hasMappings = code.includes('mapping');
  const hasEvents = code.includes('emit');
  const codeLength = code.length;
  
  const vulnerabilities = [];
  
  if (hasReentrancy) {
    vulnerabilities.push({
      type: 'Potential Reentrancy Vulnerability',
      severity: 'HIGH',
      description: 'Contract uses external calls that could be vulnerable to reentrancy attacks. Ensure state changes occur before external calls or use checks-effects-interactions pattern.',
      location: 'External call detected in contract',
      recommendation: 'Apply the Checks-Effects-Interactions (CEI) pattern or use reentrancy guards like OpenZeppelin\'s ReentrancyGuard.'
    });
  }
  
  if (hasExternalCall && !code.includes('require') && !code.includes('revert')) {
    vulnerabilities.push({
      type: 'Unchecked External Call',
      severity: 'MEDIUM',
      description: 'External calls are made without proper error handling. Failed external calls may silently fail.',
      location: 'External function call',
      recommendation: 'Always check the return value of external calls or use try-catch blocks for delegatecalls.'
    });
  }
  
  if (!hasEvents && hasMappings) {
    vulnerabilities.push({
      type: 'Missing Event Logging',
      severity: 'LOW',
      description: 'State-changing operations are not emitting events. This makes it harder to track contract activity off-chain.',
      location: 'State mutation functions',
      recommendation: 'Emit events for all critical state changes to improve transparency and enable off-chain monitoring.'
    });
  }
  
  const securityScore = 100 - (vulnerabilities.length * 15);
  
  return {
    overallRisk: vulnerabilities.length === 0 ? 'LOW' : (vulnerabilities.some(v => v.severity === 'CRITICAL') ? 'CRITICAL' : vulnerabilities.some(v => v.severity === 'HIGH') ? 'HIGH' : 'MEDIUM'),
    securityScore: Math.max(20, securityScore),
    summary: `This ${language} contract${vulnerabilities.length > 0 ? ` contains ${vulnerabilities.length} potential security concern${vulnerabilities.length > 1 ? 's' : ''}` : ' appears to follow good security practices'}. Key areas of focus: proper error handling, state management, and event logging.`,
    vulnerabilities: vulnerabilities,
    bestPractices: [
      {
        category: 'Access Control',
        status: code.includes('onlyOwner') || code.includes('require(msg.sender') ? 'PASS' : 'WARNING',
        description: 'Contract implements access control restrictions'
      },
      {
        category: 'Input Validation',
        status: code.includes('require') ? 'PASS' : 'WARNING',
        description: 'Function inputs are validated before use'
      },
      {
        category: 'Event Logging',
        status: hasEvents ? 'PASS' : 'WARNING',
        description: 'Important state changes emit events'
      },
      {
        category: 'Error Handling',
        status: code.includes('revert') || code.includes('require') ? 'PASS' : 'WARNING',
        description: 'Proper error handling and validations in place'
      }
    ],
    gasOptimization: [
      {
        location: 'Storage operations',
        suggestion: 'Consider using storage packing for uint8/uint16 variables to reduce gas costs',
        estimatedSavings: '~2000 gas per operation'
      },
      {
        location: 'Loop iterations',
        suggestion: 'Cache array length in loops to avoid repeated SLOAD operations',
        estimatedSavings: '~3 gas per iteration'
      }
    ],
    recommendations: [
      'Use established library contracts (OpenZeppelin) instead of writing security-critical code from scratch',
      'Add comprehensive NatSpec documentation for all public functions',
      'Implement proper event logging for all state changes',
      'Consider using formal verification tools like Certora for critical contracts',
      'Add gas optimization comments explaining complex operations'
    ],
    demoMode: true
  };
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