/**
 * Gas Optimization Analyzer
 * Identifies gas inefficiencies and optimization opportunities
 */

export const gasAnalyzer = {
  name: 'Gas Optimization Analyzer',
  
  check: (code) => {
    const issues = []
    const lines = code.split('\n')
    
    lines.forEach((line, index) => {
      // Unbounded loops
      if (/for\s*\(.*\.length/.test(line)) {
        issues.push({
          type: 'Unbounded Loop',
          severity: 'MEDIUM',
          line: index + 1,
          description: 'Loop iterates over dynamic array length',
          code: line.trim(),
          recommendation: 'Cache array length or use bounded iterations',
          estimatedSavings: '~100-500 gas per iteration',
        })
      }
      
      // Storage reads in loops
      if (/for\s*\(/.test(line)) {
        const loopEnd = this.findLoopEnd(lines, index)
        const loopBody = lines.slice(index, loopEnd).join('\n')
        
        if (/storage\s+\w+|\.slot|\.offset/.test(loopBody)) {
          issues.push({
            type: 'Storage Read in Loop',
            severity: 'MEDIUM',
            line: index + 1,
            description: 'Storage reads inside loop',
            recommendation: 'Cache storage values in memory before loop',
            estimatedSavings: '~2000 gas per iteration',
          })
        }
      }
      
      // Unused variables
      const varMatch = line.match(/(\w+)\s+(\w+)\s*=/)
      if (varMatch && !code.includes(varMatch[2], index + line.length)) {
        issues.push({
          type: 'Unused Variable',
          severity: 'LOW',
          line: index + 1,
          description: `Variable '${varMatch[2]}' is declared but never used`,
          recommendation: 'Remove unused variables',
          estimatedSavings: 'Deployment cost reduction',
        })
      }
      
      // Using uint8 instead of uint256 (no gas savings in most cases)
      if (/uint8|uint16|uint32/.test(line) && !/packed|struct/.test(line)) {
        issues.push({
          type: 'Inefficient Type',
          severity: 'LOW',
          line: index + 1,
          description: 'Using uint8/uint16/uint32 instead of uint256',
          recommendation: 'Use uint256 unless packing in struct',
          estimatedSavings: 'Gas increase avoided',
        })
      }
      
      // String comparison with keccak256
      if (/==.*string|string.*==/.test(line) && !/keccak256/.test(line)) {
        issues.push({
          type: 'String Comparison',
          severity: 'LOW',
          line: index + 1,
          description: 'Direct string comparison',
          recommendation: 'Use keccak256(bytes(str1)) == keccak256(bytes(str2))',
          estimatedSavings: '~100 gas',
        })
      }
      
      // Public functions that could be external
      if (/function\s+\w+\s*\([^)]*\)\s+public/.test(line)) {
        const functionName = line.match(/function\s+(\w+)/)?.[1]
        // Check if function is called internally
        const internalCalls = code.match(new RegExp(`this\\.${functionName}|${functionName}\\(`, 'g'))
        
        if (!internalCalls || internalCalls.length <= 1) {
          issues.push({
            type: 'Function Visibility',
            severity: 'LOW',
            line: index + 1,
            description: `Function '${functionName}' could be external instead of public`,
            recommendation: 'Change visibility to external if not called internally',
            estimatedSavings: '~200 gas per call',
          })
        }
      }
      
      // State variables that could be immutable or constant
      if (/^\s*(uint|address|bool|bytes32)\s+public\s+\w+\s*;/.test(line)) {
        const varName = line.match(/public\s+(\w+)/)?.[1]
        const isAssignedOnce = (code.match(new RegExp(`${varName}\\s*=`, 'g')) || []).length === 1
        
        if (isAssignedOnce && /constructor/.test(code)) {
          issues.push({
            type: 'State Variable',
            severity: 'LOW',
            line: index + 1,
            description: `Variable '${varName}' could be immutable`,
            recommendation: 'Add immutable keyword if set only in constructor',
            estimatedSavings: '~2000 gas per read',
          })
        }
      }
      
      // Multiple storage writes
      const storageWrites = line.match(/\w+\[\w+\]\s*=/g)
      if (storageWrites && storageWrites.length > 2) {
        issues.push({
          type: 'Multiple Storage Writes',
          severity: 'MEDIUM',
          line: index + 1,
          description: 'Multiple storage writes in single statement',
          recommendation: 'Batch operations or use memory',
          estimatedSavings: '~5000 gas per write',
        })
      }
    })
    
    return {
      vulnerable: false, // Gas issues aren't vulnerabilities
      issues,
      optimizations: issues,
      severity: 'LOW',
    }
  },
  
  findLoopEnd: (lines, startIndex) => {
    let braceCount = 0
    for (let i = startIndex; i < lines.length; i++) {
      braceCount += (lines[i].match(/{/g) || []).length
      braceCount -= (lines[i].match(/}/g) || []).length
      if (braceCount === 0) return i
    }
    return lines.length
  },
}

export default gasAnalyzer