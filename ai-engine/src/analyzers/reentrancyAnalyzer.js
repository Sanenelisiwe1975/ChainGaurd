/**
 * Reentrancy Vulnerability Analyzer
 * Detects potential reentrancy attacks in smart contracts
 */

export const reentrancyAnalyzer = {
  name: 'Reentrancy Analyzer',
  
  check: (code) => {
    const vulnerabilities = []
    const lines = code.split('\n')
    
    // Look for external calls
    const externalCallPatterns = [
      /\.call\{value:/gi,
      /\.transfer\(/gi,
      /\.send\(/gi,
      /\.call\(/gi,
      /\.delegatecall\(/gi,
    ]
    
    // Look for state changes
    const stateChangePatterns = [
      /balances\[.*\]\s*=\s*/gi,
      /\w+\s*=\s*(?!.*require|.*if)/gi,
      /\w+\s*\+=\s*/gi,
      /\w+\s*-=\s*/gi,
    ]
    
    lines.forEach((line, index) => {
      // Check if line has external call
      const hasExternalCall = externalCallPatterns.some(pattern => 
        pattern.test(line)
      )
      
      if (hasExternalCall) {
        // Check if there are state changes after this line
        const remainingLines = lines.slice(index + 1)
        const hasStateChangeAfter = remainingLines.some(remainingLine =>
          stateChangePatterns.some(pattern => pattern.test(remainingLine))
        )
        
        if (hasStateChangeAfter) {
          vulnerabilities.push({
            type: 'Reentrancy',
            severity: 'HIGH',
            line: index + 1,
            description: 'External call detected before state change',
            code: line.trim(),
            recommendation: 'Move state changes before external calls (Checks-Effects-Interactions pattern)',
          })
        }
      }
    })
    
    // Check for missing reentrancy guards
    const hasReentrancyGuard = /nonReentrant|ReentrancyGuard/gi.test(code)
    const hasSensitiveFunctions = /payable|\.call\{value:/gi.test(code)
    
    if (hasSensitiveFunctions && !hasReentrancyGuard) {
      vulnerabilities.push({
        type: 'Reentrancy',
        severity: 'MEDIUM',
        description: 'Contract handles value transfers without reentrancy guard',
        recommendation: 'Consider using OpenZeppelin ReentrancyGuard',
      })
    }
    
    return {
      vulnerable: vulnerabilities.length > 0,
      vulnerabilities,
      severity: vulnerabilities.length > 0 ? 'HIGH' : 'NONE',
    }
  },
}

export default reentrancyAnalyzer