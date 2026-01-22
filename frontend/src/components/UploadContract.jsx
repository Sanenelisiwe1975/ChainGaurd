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
    <div className="card">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contract Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contract Name (Optional)
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="MyContract"
              className="input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="input"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Code Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Contract Code *
            </label>
            <button
              type="button"
              onClick={handlePasteExample}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Load Example
            </button>
          </div>
          
          <textarea
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="Paste your smart contract code here..."
            rows={12}
            className="input font-mono text-sm"
            required
          />
          
          <div className="mt-2 text-sm text-gray-500">
            {formData.code.length} characters
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or Upload File
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
            <input
              type="file"
              accept=".sol,.vy,.rs"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                .sol, .vy, .rs files (Max 10MB)
              </p>
            </label>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-primary-800">
            <strong>Note:</strong> Your contract code is analyzed securely and not stored permanently. 
            Only the audit report is saved to IPFS.
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.code.trim()}
          className="w-full btn btn-primary flex items-center justify-center space-x-2 text-lg py-3"
        >
          {isLoading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Analyzing Contract...</span>
            </>
          ) : (
            <>
              <FileCode className="h-5 w-5" />
              <span>Start Audit</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default UploadContract