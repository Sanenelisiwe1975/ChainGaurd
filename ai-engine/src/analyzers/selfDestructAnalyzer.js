/**
 * Self-Destruct Analyzer
 * Detects unprotected or dangerous self-destruct functionality
 */

export const selfDestructAnalyzer = {
  name: 'Self-Destruct Analyzer',
  
  check: (code) => {
    const vulnerabilities = []
    const lines = code.split('\n')
    
    lines.forEach((line, index) => {
      // Check for selfdestruct or deprecated suicide
      if (/selfdestruct\(|suicide\(/.test(line)) {
        // Get function context
        const functionContext = this.getFunctionContext(lines, index)
        
        // Check for access control
        const hasAccessControl = /onlyOwner|onlyAdmin|require\(msg\.sender/.test(functionContext)
        
        if (!hasAccessControl) {
          vulnerabilities.push({
            type: 'Unprotected Self-Destruct',
            severity: 'CRITICAL',
            line: index + 1,
            description: 'Self-destruct function without proper access control',
            code: line.trim(),
            recommendation: 'Add strict access control (onlyOwner modifier) to self-destruct function',
            details: 'Anyone can destroy the contract and steal funds',
          })
        } else {
          // Has access control but still risky
          vulnerabilities.push({
            type: 'Self-Destruct Present',
            severity: 'MEDIUM',
            line: index + 1,
            description: 'Contract includes self-destruct functionality',
            code: line.trim(),
            recommendation: 'Consider if self-destruct is necessary - it can destroy contract permanently',
            details: 'Even with access control, self-destruct can lead to loss of funds if misused',
          })
        }
        
        // Check if using deprecated suicide
        if (/suicide\(/.test(line)) {
          vulnerabilities.push({
            type: 'Deprecated Suicide',
            severity: 'LOW',
            line: index + 1,
            description: 'Using deprecated suicide() function',
            code: line.trim(),
            recommendation: 'Replace suicide() with selfdestruct()',
          })
        }
      }
    })
    
    return {
      vulnerable: vulnerabilities.length > 0,
      vulnerabilities,
      severity: vulnerabilities.some(v => v.severity === 'CRITICAL') ? 'CRITICAL' : 
                vulnerabilities.some(v => v.severity === 'MEDIUM') ? 'MEDIUM' : 'LOW',
    }
  },
  
  getFunctionContext: (lines, lineIndex) => {
    // Find function start
    let startIndex = lineIndex
    for (let i = lineIndex; i >= 0; i--) {
      if (/function\s+\w+/.test(lines[i])) {
        startIndex = i
        break
      }
    }
    
    // Get function body (up to 20 lines)
    return lines.slice(startIndex, lineIndex + 10).join('\n')
  },
}

export default selfDestructAnalyzer