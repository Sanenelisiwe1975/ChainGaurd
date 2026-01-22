/**
 * Unchecked External Call Analyzer
 * Detects external calls without proper return value checking
 */

export const uncheckedCallAnalyzer = {
  name: 'Unchecked External Call Analyzer',
  
  check: (code) => {
    const vulnerabilities = []
    const lines = code.split('\n')
    
    lines.forEach((line, index) => {
      // Check for .call() without checking return value
      if (/\.call\(/.test(line) || /\.call\{/.test(line)) {
        const hasCheck = /require\(/.test(line) || 
                        /if\s*\(/.test(line) ||
                        /\(bool\s+success/.test(line) ||
                        /\(bool success/.test(line)
        
        if (!hasCheck) {
          // Check next few lines for delayed check
          const nextLines = lines.slice(index, index + 3).join('\n')
          const hasDelayedCheck = /require\(.*success/.test(nextLines) ||
                                 /if\s*\(.*success/.test(nextLines)
          
          if (!hasDelayedCheck) {
            vulnerabilities.push({
              type: 'Unchecked External Call',
              severity: 'HIGH',
              line: index + 1,
              description: 'External call without checking return value',
              code: line.trim(),
              recommendation: 'Check return value: (bool success, ) = target.call(...); require(success);',
            })
          }
        }
      }
      
      // Check for .send() without checking return value
      if (/\.send\(/.test(line)) {
        const isChecked = /require\(/.test(line) || 
                         /if\s*\(/.test(line) ||
                         /bool\s+success/.test(line)
        
        if (!isChecked) {
          vulnerabilities.push({
            type: 'Unchecked Send',
            severity: 'MEDIUM',
            line: index + 1,
            description: '.send() return value not checked',
            code: line.trim(),
            recommendation: 'Use .transfer() or check .send() return value',
          })
        }
      }
      
      // Check for .delegatecall() without checking return value
      if (/\.delegatecall\(/.test(line)) {
        const hasCheck = /require\(/.test(line) || 
                        /\(bool\s+success/.test(line)
        
        if (!hasCheck) {
          vulnerabilities.push({
            type: 'Unchecked Delegatecall',
            severity: 'CRITICAL',
            line: index + 1,
            description: 'delegatecall without checking return value',
            code: line.trim(),
            recommendation: 'Always check delegatecall return value: (bool success, ) = target.delegatecall(...); require(success);',
          })
        }
      }
      
      // Check for external contract calls without try-catch
      if (/\w+\(.*\)\./.test(line) && !/try\s+/.test(line)) {
        const prevLines = lines.slice(Math.max(0, index - 2), index).join('\n')
        const hasTryCatch = /try\s+{/.test(prevLines)
        
        if (!hasTryCatch && /\.\w+\(/.test(line)) {
          vulnerabilities.push({
            type: 'External Call Without Error Handling',
            severity: 'LOW',
            line: index + 1,
            description: 'External contract call without try-catch',
            code: line.trim(),
            recommendation: 'Consider using try-catch for external calls',
          })
        }
      }
    })
    
    return {
      vulnerable: vulnerabilities.length > 0,
      vulnerabilities,
      severity: vulnerabilities.length > 0 ? 'HIGH' : 'NONE',
    }
  },
}

export default uncheckedCallAnalyzer