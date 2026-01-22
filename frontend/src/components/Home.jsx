import { Link } from 'react-router-dom'
import { Shield, Zap, Lock, Database, ArrowRight, CheckCircle } from 'lucide-react'
import UploadContract from './UploadContract'

const Home = () => {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI analyzes your smart contracts for vulnerabilities using Claude API',
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: 'Decentralized Storage',
      description: 'Audit reports stored on IPFS for permanent, tamper-proof record keeping',
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'On-Chain Verification',
      description: 'Cryptographically verified audits registered on blockchain',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Comprehensive Reports',
      description: 'Detailed security scores, vulnerability analysis, and remediation steps',
    },
  ]

  const steps = [
    { number: '1', title: 'Upload Contract', description: 'Paste or upload your smart contract code' },
    { number: '2', title: 'AI Analysis', description: 'Our AI engine analyzes for vulnerabilities' },
    { number: '3', title: 'Get Report', description: 'Receive detailed audit report with security score' },
    { number: '4', title: 'On-Chain Registry', description: 'Optionally register audit on blockchain' },
  ]

  return (
    <div className="bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-primary-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Smart Contract
            <span className="block text-primary-600">Security Auditor</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Secure your smart contracts with advanced AI analysis, decentralized storage, 
            and blockchain verification. Get instant security audits with actionable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#upload" className="btn btn-primary text-lg px-8 py-3">
              Start Free Audit
            </a>
            <Link to="/dashboard" className="btn btn-secondary text-lg px-8 py-3">
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600">10+</div>
            <div className="text-gray-600 mt-2">Vulnerability Types Detected</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600">100%</div>
            <div className="text-gray-600 mt-2">Decentralized Storage</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600">&lt;5min</div>
            <div className="text-gray-600 mt-2">Average Audit Time</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ChainGuard?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Industry-leading security analysis powered by cutting-edge AI and blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get your smart contract audited in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-6 -right-4 h-6 w-6 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div id="upload" className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Start Your Free Audit
            </h2>
            <p className="text-lg text-gray-600">
              Upload your smart contract and get instant security analysis
            </p>
          </div>

          <UploadContract />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Secure Your Smart Contracts?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join developers using ChainGuard to build safer dApps
          </p>
          <a href="#upload" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
            Get Started Now
          </a>
        </div>
      </div>
    </div>
  )
}

export default Home