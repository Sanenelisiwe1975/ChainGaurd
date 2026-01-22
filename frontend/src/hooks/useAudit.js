import { useState } from 'react'
import { useMutation } from 'react-query'
import { analyzeContract, quickAnalysis } from '../utils/api'
import toast from 'react-hot-toast'

export const useAudit = () => {
  const [auditResult, setAuditResult] = useState(null)

  const auditMutation = useMutation(analyzeContract, {
    onSuccess: (data) => {
      setAuditResult(data.data)
      toast.success('Audit completed successfully!')
    },
    onError: (error) => {
      console.error('Audit error:', error)
      toast.error(error.response?.data?.error || 'Audit failed')
    },
  })

  const quickAnalysisMutation = useMutation(quickAnalysis, {
    onSuccess: (data) => {
      setAuditResult(data.data)
      toast.success('Quick analysis completed!')
    },
    onError: (error) => {
      console.error('Analysis error:', error)
      toast.error(error.response?.data?.error || 'Analysis failed')
    },
  })

  const startAudit = async (contractData) => {
    return auditMutation.mutateAsync(contractData)
  }

  const startQuickAnalysis = async (contractData) => {
    return quickAnalysisMutation.mutateAsync(contractData)
  }

  const clearResult = () => {
    setAuditResult(null)
  }

  return {
    auditResult,
    startAudit,
    startQuickAnalysis,
    clearResult,
    isLoading: auditMutation.isLoading || quickAnalysisMutation.isLoading,
    isSuccess: auditMutation.isSuccess || quickAnalysisMutation.isSuccess,
    error: auditMutation.error || quickAnalysisMutation.error,
  }
}