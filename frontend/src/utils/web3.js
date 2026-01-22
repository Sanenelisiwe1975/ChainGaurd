import { ethers } from 'ethers'
import { CONTRACT_ADDRESSES } from '../config/constants'

// ABI imports (simplified - you'd import the full ABIs from artifacts)
const AUDIT_REGISTRY_ABI = [
  'function registerAudit(bytes32 auditId, bytes32 contractHash, string ipfsCID, uint8 securityScore, string overallRisk, uint16 vulnerabilityCount)',
  'function getAudit(bytes32 auditId) view returns (bytes32, string, address, uint256, uint8, string, uint16, bool)',
  'function getContractAudits(bytes32 contractHash) view returns (bytes32[])',
  'function getLatestAudit(bytes32 contractHash) view returns (bytes32, string, uint8, string, uint256)',
  'event AuditRegistered(bytes32 indexed auditId, bytes32 indexed contractHash, string ipfsCID, address indexed auditor, uint8 securityScore)',
]

const AUDIT_VERIFIER_ABI = [
  'function verifyReport(bytes32 reportHash, bytes signature, address auditorAddress) returns (bool)',
  'function isReportVerified(bytes32 reportHash) view returns (bool)',
  'function generateReportHash(bytes32 auditId, bytes32 contractHash, string ipfsCID, uint256 timestamp) pure returns (bytes32)',
]

export const getAuditRegistryContract = (signerOrProvider) => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.AUDIT_REGISTRY,
    AUDIT_REGISTRY_ABI,
    signerOrProvider
  )
}

export const getAuditVerifierContract = (signerOrProvider) => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.AUDIT_VERIFIER,
    AUDIT_VERIFIER_ABI,
    signerOrProvider
  )
}

export const registerAuditOnChain = async (signer, auditData) => {
  const contract = getAuditRegistryContract(signer)
  
  const auditId = ethers.id(auditData.auditId)
  const contractHash = auditData.contractHash
  
  const tx = await contract.registerAudit(
    auditId,
    contractHash,
    auditData.ipfs.cid,
    auditData.securityScore,
    auditData.overallRisk,
    auditData.summary.totalVulnerabilities
  )
  
  return tx.wait()
}

export const getAuditFromChain = async (provider, auditId) => {
  const contract = getAuditRegistryContract(provider)
  const auditIdHash = ethers.id(auditId)
  
  const audit = await contract.getAudit(auditIdHash)
  
  return {
    contractHash: audit[0],
    ipfsCID: audit[1],
    auditor: audit[2],
    timestamp: audit[3],
    securityScore: audit[4],
    overallRisk: audit[5],
    vulnerabilityCount: audit[6],
    isVerified: audit[7],
  }
}

export const verifyReportOnChain = async (signer, reportHash, signature, auditorAddress) => {
  const contract = getAuditVerifierContract(signer)
  
  const tx = await contract.verifyReport(reportHash, signature, auditorAddress)
  return tx.wait()
}

export const formatAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatDate = (timestamp) => {
  return new Date(Number(timestamp) * 1000).toLocaleString()
}