import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { 
    stack: err.stack,
    path: req.path,
    method: req.method 
  });

  // Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.details.map(d => d.message)
    });
  }

  // Anthropic API errors
  if (err.status && err.error) {
    return res.status(err.status).json({
      success: false,
      error: 'AI service error',
      message: err.error.message || 'Failed to analyze contract'
    });
  }

  // IPFS errors
  if (err.message && err.message.includes('IPFS')) {
    return res.status(503).json({
      success: false,
      error: 'Storage service unavailable',
      message: 'Failed to connect to IPFS node'
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};