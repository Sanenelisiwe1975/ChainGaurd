import logger from '../utils/logger.js'

/**
 * API Key Authentication Middleware
 * Currently a placeholder - implement when adding API key auth
 */
export const authenticate = (req, res, next) => {
  // For now, allow all requests
  // TODO: Implement API key authentication in production
  
  const apiKey = req.headers['x-api-key']
  
  if (process.env.REQUIRE_API_KEY === 'true') {
    if (!apiKey) {
      logger.warn('Request without API key')
      return res.status(401).json({
        success: false,
        error: 'API key required'
      })
    }
    
    // TODO: Validate API key against database
    if (apiKey !== process.env.MASTER_API_KEY) {
      logger.warn('Invalid API key attempt')
      return res.status(401).json({
        success: false,
        error: 'Invalid API key'
      })
    }
  }
  
  next()
}

/**
 * Optional authentication - adds user context if API key provided
 */
export const optionalAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  
  if (apiKey) {
    // TODO: Look up user associated with API key
    req.user = {
      apiKey,
      // Add user details from database
    }
  }
  
  next()
}

export default {
  authenticate,
  optionalAuth,
}