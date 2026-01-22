import { parseContract } from '../../../ai-engine/src/utils/codeParser.js'
import logger from '../utils/logger.js'

/**
 * Parse and validate smart contract code
 */
export const parseContractCode = (code, language) => {
  try {
    logger.info(`Parsing ${language} contract`)
    
    const parsed = parseContract(code, language)
    
    // Basic validation
    if (language === 'solidity') {
      validateSolidityContract(parsed, code)
    }
    
    return parsed
  } catch (error) {
    logger.error('Contract parsing error:', error)
    throw new Error('Failed to parse contract: ' + error.message)
  }
}

/**
 * Validate Solidity contract structure
 */
const validateSolidityContract = (parsed, code) => {
  // Check for pragma statement
  if (!parsed.pragmas || parsed.pragmas.length === 0) {
    logger.warn('No pragma statement found')
  }
  
  // Check for at least one contract
  if (!parsed.contracts || parsed.contracts.length === 0) {
    throw new Error('No contract definition found')
  }
  
  // Check minimum code length
  if (code.length < 50) {
    throw new Error('Contract code too short')
  }
  
  logger.info(`Found ${parsed.contracts.length} contract(s)`)
  logger.info(`Found ${parsed.functions.length} function(s)`)
}

/**
 * Extract contract metadata
 */
export const extractMetadata = (code, language) => {
  const parsed = parseContract(code, language)
  
  return {
    language,
    version: parsed.version || 'unknown',
    contractCount: parsed.contracts?.length || 0,
    functionCount: parsed.functions?.length || 0,
    modifierCount: parsed.modifiers?.length || 0,
    eventCount: parsed.events?.length || 0,
    hasInheritance: parsed.inheritances && Object.keys(parsed.inheritances).length > 0,
    imports: parsed.imports?.length || 0,
  }
}

/**
 * Sanitize contract code
 */
export const sanitizeCode = (code) => {
  // Remove comments
  let sanitized = code.replace(/\/\*[\s\S]*?\*\//g, '') // Block comments
  sanitized = sanitized.replace(/\/\/.*/g, '') // Line comments
  
  // Remove extra whitespace
  sanitized = sanitized.replace(/\s+/g, ' ')
  sanitized = sanitized.trim()
  
  return sanitized
}

/**
 * Validate code doesn't contain malicious patterns
 */
export const validateCodeSafety = (code) => {
  const dangerousPatterns = [
    /<script>/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onload, etc.
    /<iframe>/i,
  ]
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      throw new Error('Code contains potentially malicious content')
    }
  }
  
  return true
}

export default {
  parseContractCode,
  extractMetadata,
  sanitizeCode,
  validateCodeSafety,
}