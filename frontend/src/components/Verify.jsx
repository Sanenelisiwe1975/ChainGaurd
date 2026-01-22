import { useState } from 'react'
import { CheckCircle, XCircle, Search, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

const Verify = () => {
  const [cid, setCid] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)

  const handleVerify = async (e) => {
    e.preventDefault()
    
    if (!cid.trim()) {
      toast.error('Please enter an IPFS CID')
      return
    }

    setIsVerifying(true)
    setVerificationResult(null)

    try {
      // Simulate verification - in production, call actual API
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // Mock result
      const result = {
        verified: true,
        auditId: 'audit_1234567890abcdef',
        timestamp: '2026-01-15T10:30:00Z',
        contractHash: '0x123456789abcdef',
        contractName: 'DeFi Protocol',
        securityScore: 85,
        overallRisk: 'MEDIUM',
      }
      
      setVerificationResult(result)
      toast.success('Report verified successfully!')
    } catch (error) {
      toast.error('Verification failed')
      setVerificationResult({ verified: false })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Verify Audit Report
          </h1>
          <p className="text-lg text-gray-600">
            Verify the authenticity of an audit report using its IPFS CID
          </p>
        </div>

        {/* Verification Form */}
        <div className="card mb-8">
          <form onSubmit={handleVerify}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IPFS CID
              </label>
              <input
                type="text"
                value={cid}
                onChange={(e) => setCid(e.target.value)}
                placeholder="QmX1234567890abcdef..."
                className="input"
                disabled={isVerifying}
              />
              <p className="mt-2 text-sm text-gray-500">
                Enter the IPFS Content Identifier (CID) of the audit report you want to verify
              </p>
            </div>

            <button
              type="submit"
              disabled={isVerifying || !cid.trim()}
              className="w-full btn btn-primary flex items-center justify-center space-x-2"
            >
              {isVerifying ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Verify Report</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div className="card">
            {verificationResult.verified ? (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <CheckCircle className="h-10 w-10 text-success-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Verified</h2>
                    <p className="text-gray-600">This audit report is authentic</p>
                  </div>
                </div>

                <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-success-800">
                    ✓ Report signature verified
                    <br />
                    ✓ Content integrity confirmed
                    <br />
                    ✓ Stored on IPFS
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Audit ID:</span>
                    <span className="text-gray-900 font-mono text-sm">
                      {verificationResult.auditId}
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Contract:</span>
                    <span className="text-gray-900">
                      {verificationResult.contractName}
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Security Score:</span>
                    <span className="text-gray-900 font-semibold">
                      {verificationResult.securityScore}/100
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Overall Risk:</span>
                    <span
                      className={`badge ${
                        verificationResult.overallRisk === 'LOW'
                          ? 'badge-success'
                          : verificationResult.overallRisk === 'MEDIUM'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                    >
                      {verificationResult.overallRisk}
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Timestamp:</span>
                    <span className="text-gray-900">
                      {new Date(verificationResult.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between py-3">
                    <span className="font-medium text-gray-700">Contract Hash:</span>
                    <span className="text-gray-900 font-mono text-sm">
                      {verificationResult.contractHash.slice(0, 10)}...
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <a
                    href={`/report/${verificationResult.auditId}`}
                    className="btn btn-primary flex-1"
                  >
                    View Full Report
                  </a>
                  <a
                    href={`https://ipfs.io/ipfs/${cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary flex-1"
                  >
                    View on IPFS
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <XCircle className="h-10 w-10 text-danger-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Not Verified</h2>
                    <p className="text-gray-600">Unable to verify this report</p>
                  </div>
                </div>

                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                  <p className="text-sm text-danger-800">
                    This report could not be verified. Possible reasons:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-danger-700">
                    <li>• Invalid IPFS CID</li>
                    <li>• Report not found on IPFS</li>
                    <li>• Report signature mismatch</li>
                    <li>• Report was not generated by ChainGuard</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-primary-50 border border-primary-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-3">
            About Verification
          </h3>
          <p className="text-sm text-primary-800">
            ChainGuard audit reports are cryptographically signed and stored on IPFS for 
            permanent, tamper-proof record keeping. When you verify a report using its CID, 
            we check the cryptographic signature to ensure the report is authentic and hasn't 
            been modified since creation.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Verify