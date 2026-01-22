/**
 * Timestamp Dependence Analyzer
 * Detects reliance on block.timestamp for critical logic
 */

export const timestampDependenceAnalyzer = {
  name: 'Timestamp Dependence Analyzer',
  
  check: (code) => {
    const vulnerabilities = []
    const lines = code.split('\n')
    
    lines.forEach((line, index) => {
      // Check for block.timestamp or now in conditional logic
      const hasTimestamp = /block\.timestamp|now/.test(line)
      
      if (hasTimestamp) {
        // Check if used in critical logic
        const isInCondition = /if\s*\(.*block\.timestamp|if\s*\(.*now/.test(line) ||
                             /require\(.*block\.timestamp|require\(.*now/.test(line)
        
        const isInComparison = /[<>=!]=?\s*block\.timestamp|[<>=!]=?\s*now/.test(line)
        
        if (isInCondition || isInComparison) {
          // Determine severity based on context
          let severity = 'LOW'
          let description = 'Logic depends on block timestamp'
          
          // Check if it's used for randomness (critical)
          if (/random|rand|lottery|winner/.test(code)) {
            severity = 'HIGH'
            description = 'Timestamp used for randomness - predictable by miners'
          }
          // Check if it's for time-sensitive operations
          else if (/deadline|expir|auction|timeout/.test(line.toLowerCase())) {
            severity = 'MEDIUM'
            description = 'Timestamp used for time-sensitive logic - 15 second manipulation possible'
          }
          
          vulnerabilities.push({
            type: 'Timestamp Dependence',
            severity,
            line: index + 1,
            description,
            code: line.trim(),
            recommendation: severity === 'HIGH' 
              ? 'Never use timestamp for randomness - use Chainlink VRF instead'
              : 'Be aware miners can manipulate timestamp by ~15 seconds',
          })
        }
      }
      
      // Check for block.number used as time proxy
      if (/block\.number/.test(line)) {
        const isTimeLogic = /expir|deadline|timeout|duration/.test(line.toLowerCase())
        
        if (isTimeLogic) {
          vulnerabilities.push({
            type: 'Block Number as Time',
            severity: 'LOW',
            line: index + 1,
            description: 'Using block.number as time proxy',
            code: line.trim(),
            recommendation: 'Block times are not constant - use block.timestamp instead',
          })
        }
      }
    })
    
    return {
      vulnerable: vulnerabilities.length > 0,
      vulnerabilities,
      severity: vulnerabilities.length > 0 ? 'LOW' : 'NONE',
    }
  },
}

export default timestampDependenceAnalyzer