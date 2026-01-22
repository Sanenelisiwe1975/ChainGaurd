import { useParams } from 'react-router-dom'
import { Download, ExternalLink, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import SecurityScore from './SecurityScore'
import { SEVERITY_COLORS } from '../config/constants'

const AuditReport = () => {
  const { auditId } = useParams()

  // Mock data - in production, fetch from API using auditId
  const report = {
    auditId: 'audit_1234567890abcdef',
    timestamp: '2026-01-15T10:30:00Z',
    contract: {
      name: 'DeFi Protocol',
      language: 'solidity',
      hash: '0x123...',
      version: '0.8.20',
    },
    analysis: {
      overallRisk: 'MEDIUM',
      securityScore: 85,
      summary: 'The contract demonstrates good security practices overall. However, there are a few areas that require attention to prevent potential vulnerabilities.',
    },
    findings: {
      vulnerabilities: [
        {
          type: 'Reentrancy',
          severity: 'HIGH',
          description: 'The withdraw function is vulnerable to reentrancy attacks due to state changes occurring after external calls.',
          location: 'withdraw() function, line 45',
          recommendation: 'Use the Checks-Effects-Interactions pattern. Update state variables before making external calls.',
        },
        {
          type: 'Access Control',
          severity: 'MEDIUM',
          description: 'Missing access control on administrative functions could allow unauthorized users to modify critical parameters.',
          location: 'setFee() function, line 78',
          recommendation: 'Implement OpenZeppelin\'s Ownable or AccessControl contracts to restrict function access.',
        },
        {
          type: 'Integer Overflow',
          severity: 'LOW',
          description: 'While using Solidity 0.8+, explicit overflow checks are recommended for critical calculations.',
          location: 'calculateReward() function, line 102',
          recommendation: 'Add require statements to validate calculation bounds.',
        },
      ],
      bestPractices: [
        { category: 'Code Quality', status: 'PASS', description: 'Clear naming conventions' },
        { category: 'Documentation', status: 'PASS', description: 'Functions are well documented' },
        { category: 'Gas Optimization', status: 'WARNING', description: 'Some loops could be optimized' },
      ],
      gasOptimization: [
        {
          location: 'processUsers() function',
          suggestion: 'Cache array length in loop',
          estimatedSavings: '~2000 gas per iteration',
        },
      ],
    },
    recommendations: [
      'Implement reentrancy guards on all state-changing functions',
      'Add comprehensive access control mechanisms',
      'Consider using SafeMath library for critical calculations',
      'Add events for all state changes for better transparency',
    ],
    ipfs: {
      cid: 'QmX1234567890abcdef',
      url: 'https://ipfs.io/ipfs/QmX1234567890abcdef',
    },
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return <AlertTriangle className="h-5 w-5" />
      case 'MEDIUM':
        return <Info className="h-5 w-5" />
      case 'LOW':
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {report.contract.name} - Audit Report
              </h1>
              <p className="text-gray-600">
                Audit ID: {report.auditId}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={report.ipfs.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View on IPFS</span>
              </a>
              <button className="btn btn-primary flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Language:</span> {report.contract.language}
            </div>
            <div>
              <span className="font-medium">Version:</span> {report.contract.version}
            </div>
            <div>
              <span className="font-medium">Analyzed:</span>{' '}
              {new Date(report.timestamp).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Security Score */}
        <div className="mb-8">
          <SecurityScore
            score={report.analysis.securityScore}
            risk={report.analysis.overallRisk}
          />
        </div>

        {/* Summary */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary</h2>
          <p className="text-gray-700">{report.analysis.summary}</p>
        </div>

        {/* Vulnerabilities */}
        {report.findings.vulnerabilities.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Vulnerabilities Found ({report.findings.vulnerabilities.length})
            </h2>
            
            <div className="space-y-6">
              {report.findings.vulnerabilities.map((vuln, index) => (
                <div
                  key={index}
                  className="border-l-4 border-gray-200 pl-4 py-2"
                  style={{
                    borderLeftColor:
                      vuln.severity === 'CRITICAL' || vuln.severity === 'HIGH'
                        ? '#ef4444'
                        : vuln.severity === 'MEDIUM'
                        ? '#f59e0b'
                        : '#22c55e',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={SEVERITY_COLORS[vuln.severity]}>
                        {getSeverityIcon(vuln.severity)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vuln.type}
                        </h3>
                        <span className={`badge ${SEVERITY_COLORS[vuln.severity]} mt-1`}>
                          {vuln.severity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 ml-8">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                      <p className="text-sm text-gray-600">{vuln.description}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Location:</p>
                      <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {vuln.location}
                      </code>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Recommendation:
                      </p>
                      <p className="text-sm text-gray-600">{vuln.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best Practices */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Best Practices</h2>
          <div className="space-y-3">
            {report.findings.bestPractices.map((practice, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <span
                    className={`badge ${
                      practice.status === 'PASS'
                        ? 'badge-success'
                        : practice.status === 'FAIL'
                        ? 'badge-danger'
                        : 'badge-warning'
                    }`}
                  >
                    {practice.status}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {practice.category}
                  </span>
                </div>
                <span className="text-sm text-gray-600">{practice.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
          <ul className="space-y-2">
            {report.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2 text-gray-700">
                <span className="text-primary-600 mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Generated by ChainGuard AI Security Analyzer</p>
          <p className="mt-1">Report stored immutably on IPFS</p>
        </div>
      </div>
    </div>
  )
}

export default AuditReport