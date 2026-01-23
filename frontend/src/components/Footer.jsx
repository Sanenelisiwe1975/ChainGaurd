import { Shield, Github, Twitter, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-700 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500 rounded-lg blur opacity-0 group-hover:opacity-70 transition-opacity"></div>
                <Shield className="h-8 w-8 text-primary-400 relative" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">ChainGuard</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              AI-powered smart contract security auditor. Secure your blockchain applications 
              with advanced vulnerability detection and decentralized verification.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-primary-400 transition-colors font-medium">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/verify" className="text-gray-400 hover:text-primary-400 transition-colors font-medium">
                  Verify
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors font-medium">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors font-medium">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors font-medium">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-8 mt-8">
          {/* Social Links */}
          <div className="flex justify-between items-center flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 hover:scale-110 transition-all">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 hover:scale-110 transition-all">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 hover:scale-110 transition-all">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-gray-500 text-center md:text-right">
              &copy; {currentYear} ChainGuard. All rights reserved. | <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer