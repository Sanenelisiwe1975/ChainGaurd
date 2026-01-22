/**
 * Vulnerability Analyzers
 * Each analyzer focuses on specific vulnerability patterns
 */

export const reentrancyAnalyzer = {
  name: 'Reentrancy Analyzer',
  pattern: /\.call\{value:/gi,
  check: (code) => {
    const hasExternalCall = /\.call\{value:|\.transfer\(|\.send\(/gi.test(code)
    const hasStateChange = /=\s*\w+|balances\[/gi.test(code)
    
    // Check if state changes happen after external calls
    const lines = code.split('\n')
    let externalCallLine = -1
    let stateChangeLine = -1
    
    lines.forEach((line, index) => {
      if (/\.call\{value:|\.transfer\(|\.send\(/gi.test(line)) {
        externalCallLine = index
      }
      if (/=\s*\w+|balances\[/gi.test(line) && externalCallLine !== -1) {
        stateChangeLine = index
      }
    })
    
    return {
      vulnerable: externalCallLine !== -1 && stateChangeLine > externalCallLine,
      severity: 'HIGH',
      description: 'Potential reentrancy vulnerability detected',
    }
  },
}

export const accessControlAnalyzer = {
  name: 'Access Control Analyzer',
  check: (code) => {
    const hasAdminFunctions = /function\s+set|function\s+update|function\s+configure/gi.test(code)
    const hasModifiers = /onlyOwner|onlyAdmin|require\(msg\.sender\s*==\s*owner\)/gi.test(code)
    
    return {
      vulnerable: hasAdminFunctions && !hasModifiers,
      severity: 'MEDIUM',
      description: 'Missing access control on administrative functions',
    }
  },
}

export const overflowAnalyzer = {
  name: 'Integer Overflow Analyzer',
  check: (code) => {
    const hasMath = /\+|\-|\*|\//gi.test(code)
    const hasSafeMath = /using\s+SafeMath|\.add\(|\.sub\(|\.mul\(/gi.test(code)
    const solidityVersion = code.match(/pragma solidity\s+\^?([\d.]+)/)
    
    const version = solidityVersion ? parseFloat(solidityVersion[1]) : 0
    const isSafe = version >= 0.8 || hasSafeMath
    
    return {
      vulnerable: hasMath && !isSafe,
      severity: 'MEDIUM',
      description: 'Potential integer overflow/underflow',
    }
  },
}

export const gasAnalyzer = {
  name: 'Gas Optimization Analyzer',
  check: (code) => {
    const issues = []
    
    // Check for unbounded loops
    if (/for\s*\(.*\.length/gi.test(code)) {
      issues.push({
        type: 'Unbounded Loop',
        severity: 'LOW',
        description: 'Loop iterating over dynamic array',
      })
    }
    
    // Check for repeated storage reads
    const storageReads = code.match(/storage\s+\w+\s*=\s*\w+/gi)
    if (storageReads && storageReads.length > 3) {
      issues.push({
        type: 'Storage Reads',
        severity: 'LOW',
        description: 'Multiple storage reads could be cached',
      })
    }
    
    return {
      issues,
      vulnerable: issues.length > 0,
      severity: 'LOW',
    }
  },
}

export const uncheckedCallAnalyzer = {
  name: 'Unchecked External Call Analyzer',
  check: (code) => {
    const hasCall = /\.call\(|\.delegatecall\(/gi.test(code)
    const hasCheck = /require\(.*\.call|if\s*\(.*\.call/gi.test(code)
    
    return {
      vulnerable: hasCall && !hasCheck,
      severity: 'HIGH',
      description: 'External call without checking return value',
    }
  },
}

export const timestampDependenceAnalyzer = {
  name: 'Timestamp Dependence Analyzer',
  check: (code) => {
    const usesTimestamp = /block\.timestamp|now/gi.test(code)
    const usedInLogic = /if\s*\(.*block\.timestamp|require\(.*block\.timestamp/gi.test(code)
    
    return {
      vulnerable: usesTimestamp && usedInLogic,
      severity: 'LOW',
      description: 'Logic depends on block timestamp',
    }
  },
}

export const txOriginAnalyzer = {
  name: 'tx.origin Analyzer',
  check: (code) => {
    const usesTxOrigin = /tx\.origin/gi.test(code)
    
    return {
      vulnerable: usesTxOrigin,
      severity: 'MEDIUM',
      description: 'Use of tx.origin for authorization',
    }
  },
}

export const selfDestructAnalyzer = {
  name: 'Self-Destruct Analyzer',
  check: (code) => {
    const hasSelfDestruct = /selfdestruct\(|suicide\(/gi.test(code)
    const hasProtection = /onlyOwner.*selfdestruct|require\(.*owner.*\).*selfdestruct/gi.test(code)
    
    return {
      vulnerable: hasSelfDestruct && !hasProtection,
      severity: 'CRITICAL',
      description: 'Unprotected self-destruct function',
    }
  },
}

// Export all analyzers
export const analyzers = [
  reentrancyAnalyzer,
  accessControlAnalyzer,
  overflowAnalyzer,
  gasAnalyzer,
  uncheckedCallAnalyzer,
  timestampDependenceAnalyzer,
  txOriginAnalyzer,
  selfDestructAnalyzer,
]

export default analyzers