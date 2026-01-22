/**
 * Access Control Analyzer
 * Detects missing or weak access control mechanisms
 */

export const accessControlAnalyzer = {
  name: 'Access Control Analyzer',
  
  check: (code) => {
    const vulnerabilities = []
    const lines = code.split('\n')
    
    // Administrative function patterns
    const adminPatterns = [
      /function\s+set\w+/gi,
      /function\s+update\w+/gi,
      /function\s+change\w+/gi,
      /function\s+configure/gi,
      /function\s+initialize/gi,
      /function\s+pause/gi,
      /function\s+unpause/gi,
      /function\s+withdraw/gi,
      /function\s+destroy/gi,
      /function\s+kill/gi,
    ]
    
    // Access control patterns
    const accessControlPatterns = [
      /onlyOwner/gi,
      /onlyAdmin/gi,
      /require\(msg\.sender\s*==\s*owner/gi,
      /require\(msg\.sender\s*==\s*admin/gi,
      /modifier\s+only\w+/gi,
    ]
    
    // Check each function
    let currentFunction = null
    let functionStartLine = 0
    let braceCount = 0
    
    lines.forEach((line, index) => {
      // Detect function declaration
      const functionMatch = line.match(/function\s+(\w+)/)
      if (functionMatch) {
        currentFunction = functionMatch[1]
        functionStartLine = index
        braceCount = 0
      }
      
      // Count braces to track function scope
      braceCount += (line.match(/{/g) || []).length
      braceCount -= (line.match(/}/g) || []).length
      
      // Check if this is an admin function
      const isAdminFunction = adminPatterns.some(pattern => 
        line.match(pattern)
      )
      
      if (isAdminFunction && currentFunction) {
        // Look for access control in this function
        const functionLines = lines.slice(functionStartLine, index + 10)
        const hasAccessControl = functionLines.some(funcLine =>
          accessControlPatterns.some(pattern => pattern.test(funcLine))
        )
        
        if (!hasAccessControl) {
          vulnerabilities.push({
            type: 'Access Control',
            severity: 'MEDIUM',
            line: index + 1,
            function: currentFunction,
            description: `Administrative function '${currentFunction}' lacks access control`,
            code: line.trim(),
            recommendation: 'Add onlyOwner or appropriate access control modifier',
          })
        }
      }
      
      // Reset when function ends
      if (braceCount === 0 && currentFunction) {
        currentFunction = null
      }
    })
    
    // Check for use of tx.origin (security anti-pattern)
    if (/tx\.origin/gi.test(code)) {
      vulnerabilities.push({
        type: 'Access Control',
        severity: 'MEDIUM',
        description: 'Use of tx.origin for authorization',
        recommendation: 'Use msg.sender instead of tx.origin',
      })
    }
    
    // Check if contract has any access control at all
    const hasAnyAccessControl = accessControlPatterns.some(pattern => 
      pattern.test(code)
    )
    
    const hasAdminFunctions = adminPatterns.some(pattern => 
      pattern.test(code)
    )
    
    if (hasAdminFunctions && !hasAnyAccessControl) {
      vulnerabilities.push({
        type: 'Access Control',
        severity: 'HIGH',
        description: 'Contract has administrative functions but no access control mechanism',
        recommendation: 'Implement Ownable or AccessControl pattern from OpenZeppelin',
      })
    }
    
    return {
      vulnerable: vulnerabilities.length > 0,
      vulnerabilities,
      severity: vulnerabilities.length > 0 ? 'MEDIUM' : 'NONE',
    }
  },
}

export default accessControlAnalyzer