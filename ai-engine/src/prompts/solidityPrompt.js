/**
 * Optimized prompts for Solidity smart contract analysis
 */

export const SOLIDITY_ANALYSIS_PROMPT = `You are an expert smart contract security auditor specializing in Solidity. 

Analyze the following smart contract for security vulnerabilities and best practices.

CRITICAL VULNERABILITIES TO CHECK:
1. Reentrancy attacks (external calls before state changes)
2. Access control issues (missing modifiers on admin functions)
3. Integer overflow/underflow (if Solidity < 0.8 without SafeMath)
4. Unchecked external calls (missing return value checks)
5. Front-running vulnerabilities (transaction ordering dependence)
6. Denial of Service (gas limit issues, unbounded loops)
7. Timestamp dependence (using block.timestamp for critical logic)
8. tx.origin authentication (should use msg.sender)
9. Unprotected self-destruct
10. Logic errors and state management issues

SMART CONTRACT CODE:
\`\`\`solidity
{CODE}
\`\`\`

Provide a comprehensive security audit in the following JSON format (respond ONLY with valid JSON, no markdown):

{
  "overallRisk": "LOW|MEDIUM|HIGH|CRITICAL",
  "securityScore": 0-100,
  "summary": "2-3 sentence overview of findings",
  "vulnerabilities": [
    {
      "type": "vulnerability name",
      "severity": "LOW|MEDIUM|HIGH|CRITICAL",
      "description": "detailed explanation",
      "location": "function name or line reference",
      "recommendation": "specific fix"
    }
  ],
  "bestPractices": [
    {
      "category": "practice category",
      "status": "PASS|FAIL|WARNING",
      "description": "what was checked"
    }
  ],
  "gasOptimization": [
    {
      "location": "where to optimize",
      "suggestion": "optimization recommendation",
      "estimatedSavings": "gas estimate"
    }
  ],
  "recommendations": [
    "List of general security recommendations"
  ]
}

Be thorough, specific, and actionable in your analysis.`

export const RUST_ANALYSIS_PROMPT = `You are an expert in Rust smart contract security for Solana and other Rust-based blockchains.

Analyze the following Rust smart contract for security vulnerabilities.

CRITICAL AREAS TO CHECK:
1. Integer overflow/underflow
2. Access control and authority checks
3. Account validation
4. PDA (Program Derived Address) security
5. Signer verification
6. Re-initialization attacks
7. Arithmetic errors
8. Type confusion

SMART CONTRACT CODE:
\`\`\`rust
{CODE}
\`\`\`

Provide analysis in the same JSON format as Solidity analysis.`

export const VYPER_ANALYSIS_PROMPT = `You are an expert in Vyper smart contract security.

Analyze the following Vyper smart contract for security vulnerabilities.

Note: Vyper has built-in protections against some common vulnerabilities (reentrancy guards, overflow protection).

FOCUS AREAS:
1. Access control patterns
2. External call handling
3. State management
4. Gas optimization
5. Logic errors

SMART CONTRACT CODE:
\`\`\`vyper
{CODE}
\`\`\`

Provide analysis in the same JSON format as Solidity analysis.`

export const buildPrompt = (code, language = 'solidity') => {
  const prompts = {
    solidity: SOLIDITY_ANALYSIS_PROMPT,
    rust: RUST_ANALYSIS_PROMPT,
    vyper: VYPER_ANALYSIS_PROMPT,
  }

  const prompt = prompts[language.toLowerCase()] || prompts.solidity
  return prompt.replace('{CODE}', code)
}

export default {
  SOLIDITY_ANALYSIS_PROMPT,
  RUST_ANALYSIS_PROMPT,
  VYPER_ANALYSIS_PROMPT,
  buildPrompt,
}