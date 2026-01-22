import analyzers from './analyzers/index.js'
import { buildPrompt } from './prompts/solidityPrompt.js'

/**
 * Run static analysis on contract code
 * This provides quick heuristic-based checks
 */
export const runStaticAnalysis = (code, language = 'solidity') => {
  const results = []

  analyzers.forEach((analyzer) => {
    const result = analyzer.check(code)
    
    if (result.vulnerable) {
      results.push({
        analyzer: analyzer.name,
        ...result,
      })
    }
  })

  return results
}

/**
 * Calculate security score based on findings
 */
export const calculateSecurityScore = (vulnerabilities) => {
  let score = 100

  vulnerabilities.forEach((vuln) => {
    switch (vuln.severity) {
      case 'CRITICAL':
        score -= 25
        break
      case 'HIGH':
        score -= 15
        break
      case 'MEDIUM':
        score -= 10
        break
      case 'LOW':
        score -= 5
        break
    }
  })

  return Math.max(0, Math.min(100, score))
}

/**
 * Determine overall risk level
 */
export const determineRiskLevel = (vulnerabilities) => {
  const hasCritical = vulnerabilities.some((v) => v.severity === 'CRITICAL')
  const hasHigh = vulnerabilities.some((v) => v.severity === 'HIGH')
  const hasMedium = vulnerabilities.some((v) => v.severity === 'MEDIUM')

  if (hasCritical) return 'CRITICAL'
  if (hasHigh) return 'HIGH'
  if (hasMedium) return 'MEDIUM'
  return 'LOW'
}

/**
 * Generate AI analysis prompt
 */
export const generatePrompt = (code, language = 'solidity') => {
  return buildPrompt(code, language)
}

export default {
  runStaticAnalysis,
  calculateSecurityScore,
  determineRiskLevel,
  generatePrompt,
  analyzers,
}