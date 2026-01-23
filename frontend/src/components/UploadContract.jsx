import { useState } from 'react'
import { Upload, FileCode, Loader, AlertCircle } from 'lucide-react'
import { useAudit } from '../hooks/useAudit'
import { SUPPORTED_LANGUAGES, MAX_FILE_SIZE } from '../config/constants'
import SecurityScore from './SecurityScore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const UploadContract = () => {
  const navigate = useNavigate()
  const { startAudit, isLoading, auditResult } = useAudit()
  
  const [formData, setFormData] = useState({
    code: '',
    language: 'solidity',
    name: '',
    version: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 10MB limit')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        code: event.target.result,
        name: prev.name || file.name.replace(/\.[^/.]+$/, ''),
      }))
    }
    reader.readAsText(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.code.trim()) {
      toast.error('Please provide contract code')
      return
    }

    try {
      const result = await startAudit(formData)
      
      // Optionally navigate to report page
      if (result?.data?.auditId) {
        setTimeout(() => {
          navigate(`/report/${result.data.auditId}`)
        }, 1500)
      }
    } catch (error) {
      // Error handled by useAudit hook
    }
  }

  const handlePasteExample = () => {
    const exampleCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableBank {
    mapping(address => uint256) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    // Vulnerable to reentrancy attack
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        balances[msg.sender] -= amount;
    }
    
    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}`

    setFormData((prev) => ({
      ...prev,
      code: exampleCode,
      name: 'VulnerableBank',
      version: '0.8.0',
    }))
    toast.success('Example contract loaded')
  }

  if (auditResult) {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Audit Complete!</h3>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-secondary text-sm"
            >
              New Audit
            </button>
          </div>
          
          <SecurityScore
            score={auditResult.securityScore}
            risk={auditResult.overallRisk}
          />

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Issues</div>
              <div className="text-2xl font-bold text-gray-900">
                {auditResult.summary.totalVulnerabilities}
              </div>
            </div>
            <div className="bg-danger-50 p-4 rounded-lg">
              <div className="text-sm text-danger-600">Critical</div>
              <div className="text-2xl font-bold text-danger-700">
                {auditResult.summary.criticalIssues}
              </div>
            </div>
            <div className="bg-warning-50 p-4 rounded-lg">
              <div className="text-sm text-warning-600">High</div>
              <div className="text-2xl font-bold text-warning-700">
                {auditResult.summary.highIssues}
              </div>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg">
              <div className="text-sm text-primary-600">Medium/Low</div>
              <div className="text-2xl font-bold text-primary-700">
                {auditResult.summary.mediumIssues + auditResult.summary.lowIssues}
              </div>
            </div>
          </div>

          {auditResult.ipfs && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Report stored on IPFS:</div>
              <a
                href={auditResult.ipfs.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-sm break-all"
              >
                {auditResult.ipfs.cid}
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Contract Details */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contract Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contract Name <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., MyToken, LiquidityPool"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Code Input */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="block text-sm font-semibold text-white">
                Smart Contract Code <span className="text-danger-400">*</span>
              </label>
              <p className="text-xs text-gray-400 mt-1">Paste your complete contract code below</p>
            </div>
            <button
              type="button"
              onClick={handlePasteExample}
              className="text-xs font-medium text-primary-300 bg-primary-500/20 px-3 py-1.5 rounded-lg hover:bg-primary-500/30 border border-primary-500/50 transition-all"
            >
              📋 Load Example
            </button>
          </div>
          
          <textarea
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="pragma solidity ^0.8.0;&#10;&#10;contract MyContract {&#10;  // Your code here...&#10;}"
            rows={14}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm placeholder-gray-500 transition-all resize-none"
            required
          />
          
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {formData.code.length > 0 && <span>{formData.code.length} characters</span>}
            </p>
            <p className="text-xs text-gray-500">Max size: 10MB</p>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3">
            Or Upload Contract File
          </label>
          <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-primary-500 hover:bg-primary-500/5 transition-all duration-200 group cursor-pointer">
            <input
              type="file"
              accept=".sol,.vy,.rs"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3 group-hover:text-primary-400 group-hover:scale-110 transition-all" />
              <p className="text-sm text-gray-300 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported: .sol (Solidity), .vy (Vyper), .rs (Rust)
              </p>
            </label>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4 flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary-500/20">
              <span className="text-primary-300 text-xs">ℹ</span>
            </div>
          </div>
          <div className="text-sm text-primary-200">
            <strong>Privacy Protected:</strong> Your contract code is analyzed securely using AI and not permanently stored. Only audit reports are saved to IPFS for your records.
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.code.trim()}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
            isLoading || !formData.code.trim()
              ? 'bg-slate-700 text-gray-400 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-primary-500 to-blue-500 text-white hover:shadow-lg hover:shadow-primary-500/50 hover:scale-105'
          }`}
        >
          {isLoading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Analyzing Your Contract...</span>
            </>
          ) : (
            <>
              <FileCode className="h-5 w-5" />
              <span>Start Security Audit</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default UploadContract