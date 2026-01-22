/**
 * tx.origin Analyzer
 * Detects dangerous use of tx.origin for authorization
 */

export const txOriginAnalyzer = {
  name: 'tx.origin Authorization Analyzer',
  
  check: (code) => {
    const vulnerabilities = []
    const lines = code.split('\n')
    
    lines.forEach((line, index) => {
      if (/tx\.origin/.test(line)) {
        // Check if used for authorization
        const isAuth = /require\(.*tx\.origin|if\s*\(.*tx\.origin|tx\.origin\s*==/.test(line)
        
        if (isAuth) {
          vulnerabilities.push({
            type: 'tx.origin Authentication',
            severity: 'HIGH',
            line: index + 1,
            description: 'Using tx.origin for authorization - vulnerable to phishing attacks',
            code: line.trim(),
            recommendation: 'Use msg.sender instead of tx.origin for authentication',
            details: 'tx.origin returns the original sender of the transaction, which can be exploited through malicious contracts',
          })
        } else {
          // tx.origin used but not for auth
          vulnerabilities.push({
            type: 'tx.origin Usage',
            severity: 'LOW',
            line: index + 1,
            description: 'tx.origin should generally be avoided',
            code: line.trim(),
            recommendation: 'Consider if tx.origin is necessary - msg.sender is usually preferred',
          })
        }
      }
    })
    
    return {
      vulnerable: vulnerabilities.length > 0,
      vulnerabilities,
      severity: vulnerabilities.some(v => v.severity === 'HIGH') ? 'HIGH' : 'LOW',
    }
  },
}

export default txOriginAnalyzer