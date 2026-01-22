import axios from 'axios'
import { API_BASE_URL } from '../config/constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Audit endpoints
export const analyzeContract = async (contractData) => {
  return api.post('/audit/analyze', contractData)
}

export const quickAnalysis = async (contractData) => {
  return api.post('/audit/quick', contractData)
}

export const getAuditById = async (auditId) => {
  return api.get(`/audit/${auditId}`)
}

// IPFS endpoints
export const getReportFromIPFS = async (cid) => {
  return api.get(`/ipfs/${cid}`)
}

// Verification endpoint
export const verifyReport = async (data) => {
  return api.post('/verify', data)
}

export default api