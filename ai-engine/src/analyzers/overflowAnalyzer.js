/**
 * Integer Overflow/Underflow Analyzer
 * Detects potential integer overflow and underflow vulnerabilities
 */

export const overflowAnalyzer = {
  name: 'Integer Overflow Analyzer',
  
  check: (code) => {
    const vulnerabilities = []
    
    // Extract Solidity version
    const versionMatch = code.match(/pragma solidity\s+[\^]?([\d.]+)/)
    const version = versionMatch ? parseFloat(versionMatch[1]) : 0
    
    // Solidity 0.8+ has built-in overflow protection
    const hasBuiltInProtection = version >= 0.8
    
    // Check for SafeMath usage
    const hasSafeMath = /using\s+SafeMath/gi.test(code) ||
                        /\.add\(|\.sub\(|\.mul\(|\.div\(/gi.test(code)
    
    // Check for arithmetic operations
    const hasArithmetic = /[\+\-\*\/]/g.test(code)
    
    // Check for unchecked blocks (Solidity 0.8+)
    const hasUncheckedBlocks = /unchecked\s*{/gi.test(code)
    
    if (!hasBuiltInProtection && !hasSafeMath && hasArithmetic) {
      vulnerabilities.push({
        type: 'Integer Overflow/Underflow',
        severity: 'HIGH',
        description: `Solidity ${version} lacks overflow protection and SafeMath is not used`,
        recommendation: 'Upgrade to Solidity 0.8+ or use SafeMath library',
      })
    }
    
    if (hasBuiltInProtection && hasUncheckedBlocks) {
      vulnerabilities.push({
        type: 'Integer Overflow/Underflow',
        severity: 'MEDIUM',
        description: 'Unchecked block bypasses overflow protection',
        recommendation: 'Ensure unchecked arithmetic is intentional and safe',
      })
    }
    
    // Check for dangerous arithmetic patterns
    const lines = code.split('\n')
    lines.forEach((line, index) => {
      // Look for multiplication before division (precision loss)
      if (/\*.*\//.test(line) && !/\/.*\*/.test(line)) {
        vulnerabilities.push({
          type: 'Precision Loss',
          severity: 'LOW',
          line: index + 1,
          description: 'Multiplication before division can cause precision loss',
          code: line.trim(),
          recommendation: 'Consider order of operations for better precision',
        })
      }
      
      // Look for subtraction that could underflow
      if (/-=/.test(line) && !hasBuiltInProtection && !hasSafeMath) {
        vulnerabilities.push({
          type: 'Integer Underflow',
          severity: 'MEDIUM',
          line: index + 1,
          description: 'Subtraction without underflow protection',
          code: line.trim(),
          recommendation: 'Add check: require(a >= b) before a -= b',
        })
      }
    })
    
    return {
      vulnerable: vulnerabilities.length > 0,
      vulnerabilities,
      severity: vulnerabilities.length > 0 ? 'MEDIUM' : 'NONE',
    }
  },
}

export default overflowAnalyzer