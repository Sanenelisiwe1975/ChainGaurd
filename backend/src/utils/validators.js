import Joi from 'joi';

export const contractSchema = Joi.object({
  code: Joi.string().required().min(10).max(100000),
  language: Joi.string().valid('solidity', 'rust', 'vyper').required(),
  name: Joi.string().optional().max(100),
  version: Joi.string().optional().max(20)
});

export const verifySchema = Joi.object({
  contractHash: Joi.string().required().length(66), // 0x + 64 hex chars
  ipfsHash: Joi.string().required(),
  signature: Joi.string().required()
});

export const validateContract = (data) => {
  return contractSchema.validate(data);
};

export const validateVerification = (data) => {
  return verifySchema.validate(data);
};