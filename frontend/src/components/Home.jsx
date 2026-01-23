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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 rounded-full blur-2xl opacity-30"></div>
              <Shield className="h-20 w-20 text-primary-400 relative" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            AI-Powered Smart Contract
            <span className="block bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">Security Auditor</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Secure your smart contracts with advanced AI analysis, decentralized storage, 
            and blockchain verification. Get instant security audits with actionable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#upload" className="btn btn-primary text-lg px-10 py-4 rounded-xl font-semibold shadow-lg shadow-primary-500/50 hover:shadow-xl hover:shadow-primary-500/75 transition-all">
              Start Free Audit →
            </a>
            <Link to="/dashboard" className="btn bg-white/10 backdrop-blur-md text-white border border-white/20 text-lg px-10 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all">
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-8 border border-white/20">
            <div className="text-5xl font-bold bg-gradient-to-r from-primary-300 to-blue-300 bg-clip-text text-transparent">10+</div>
            <div className="text-gray-200 mt-3 font-medium">Vulnerability Types Detected</div>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-8 border border-white/20">
            <div className="text-5xl font-bold bg-gradient-to-r from-primary-300 to-blue-300 bg-clip-text text-transparent">100%</div>
            <div className="text-gray-200 mt-3 font-medium">Decentralized Storage</div>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-8 border border-white/20">
            <div className="text-5xl font-bold bg-gradient-to-r from-primary-300 to-blue-300 bg-clip-text text-transparent">&lt;5min</div>
            <div className="text-gray-200 mt-3 font-medium">Average Audit Time</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose ChainGuard?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Industry-leading security analysis powered by cutting-edge AI and blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
                <div className="relative bg-slate-800 border border-slate-700 group-hover:border-primary-500 rounded-2xl p-8 transition-all duration-300">
                  <div className="text-primary-400 mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-300">
              Get your smart contract audited in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-blue-500 text-white flex items-center justify-center text-2xl font-bold mb-6 group-hover:shadow-lg group-hover:shadow-primary-500/50 transition-all duration-300 transform group-hover:scale-110">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-8 -right-5 h-6 w-6 text-primary-600/50 group-hover:text-primary-500 transition-colors" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div id="upload" className="bg-gradient-to-b from-slate-900 to-slate-800 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Start Your Free Audit
            </h2>
            <p className="text-lg text-gray-300">
              Upload your smart contract and get instant security analysis
            </p>
          </div>

          <UploadContract />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Shield className="absolute w-96 h-96 -top-48 -right-48 text-white" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Secure Your Smart Contracts?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join developers using ChainGuard to build safer dApps
          </p>
          <a href="#upload" className="btn bg-white text-primary-600 hover:bg-gray-100 font-semibold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all inline-block">
            Get Started Now →
          </a>
        </div>
      </div>
    </div>
  )
}

export default Home