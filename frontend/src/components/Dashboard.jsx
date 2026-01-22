import { useState } from 'react'
import { Search, Filter, ExternalLink, Clock, Shield } from 'lucide-react'
import { RISK_COLORS } from '../config/constants'

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRisk, setFilterRisk] = useState('all')

  // Mock data - in production, fetch from API
  const mockAudits = [
    {
      auditId: 'audit_1234567890abcdef',
      contractName: 'DeFi Protocol',
      securityScore: 85,
      overallRisk: 'MEDIUM',
      timestamp: '2026-01-15T10:30:00Z',
      vulnerabilities: 3,
      ipfsCID: 'QmX1234...',
    },
    {
      auditId: 'audit_abcdef1234567890',
      contractName: 'NFT Marketplace',
      securityScore: 92,
      overallRisk: 'LOW',
      timestamp: '2026-01-14T15:45:00Z',
      vulnerabilities: 1,
      ipfsCID: 'QmY5678...',
    },
    {
      auditId: 'audit_fedcba0987654321',
      contractName: 'Token Contract',
      securityScore: 65,
      overallRisk: 'HIGH',
      timestamp: '2026-01-13T09:20:00Z',
      vulnerabilities: 7,
      ipfsCID: 'QmZ9012...',
    },
  ]

  const filteredAudits = mockAudits.filter((audit) => {
    const matchesSearch = audit.contractName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterRisk === 'all' || audit.overallRisk === filterRisk
    return matchesSearch && matchesFilter
  })

  const getRiskBadgeClass = (risk) => {
    const colorMap = {
      LOW: 'badge-success',
      MEDIUM: 'badge-warning',
      HIGH: 'badge-danger',
      CRITICAL: 'badge-danger',
    }
    return colorMap[risk] || 'badge-info'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Dashboard</h1>
          <p className="text-gray-600">View and manage your security audits</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Audits</p>
                <p className="text-3xl font-bold text-gray-900">{mockAudits.length}</p>
              </div>
              <Shield className="h-12 w-12 text-primary-600" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round(mockAudits.reduce((sum, a) => sum + a.securityScore, 0) / mockAudits.length)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-success-100 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Issues</p>
                <p className="text-3xl font-bold text-gray-900">
                  {mockAudits.reduce((sum, a) => sum + a.vulnerabilities, 0)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning-100 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search audits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="input w-40"
              >
                <option value="all">All Risks</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audits List */}
        <div className="space-y-4">
          {filteredAudits.length === 0 ? (
            <div className="card text-center py-12">
              <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No audits found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredAudits.map((audit) => (
              <div key={audit.auditId} className="card hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {audit.contractName}
                      </h3>
                      <span className={`badge ${getRiskBadgeClass(audit.overallRisk)}`}>
                        {audit.overallRisk}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(audit.timestamp)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Score:</span> {audit.securityScore}/100
                      </div>
                      <div>
                        <span className="font-medium">Issues:</span> {audit.vulnerabilities}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <a
                      href={`/report/${audit.auditId}`}
                      className="btn btn-primary text-sm"
                    >
                      View Report
                    </a>
                    <a
                      href={`https://ipfs.io/ipfs/${audit.ipfsCID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary text-sm flex items-center space-x-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>IPFS</span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard