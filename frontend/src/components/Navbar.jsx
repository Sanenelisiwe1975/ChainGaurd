import { Link, useLocation } from 'react-router-dom'
import { Shield, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useWeb3 } from '../hooks/useWeb3'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { account, connectWallet, disconnect, isConnecting, getShortAddress } = useWeb3()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/verify', label: 'Verify' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 rounded-lg blur opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              <Shield className="h-8 w-8 text-primary-400 relative transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors">ChainGuard</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-200 relative group ${
                  isActive(link.path)
                    ? 'text-primary-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-500 to-blue-500 transition-all duration-200 ${
                  isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Wallet Connection */}
          <div className="hidden md:block">
            {account ? (
              <div className="flex items-center space-x-3">
                <div className="px-4 py-2 bg-primary-500/20 border border-primary-500/50 text-primary-300 rounded-lg text-sm font-medium backdrop-blur-sm hover:bg-primary-500/30 transition-colors">
                  {getShortAddress(account)}
                </div>
                <button
                  onClick={disconnect}
                  className="btn bg-slate-700 text-gray-200 hover:bg-slate-600 text-sm font-medium transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="btn btn-primary font-medium"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-700 bg-slate-800 backdrop-blur-md">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/50'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!account && (
              <button
                onClick={() => { connectWallet(); setIsMenuOpen(false); }}
                disabled={isConnecting}
                className="w-full btn btn-primary text-sm font-medium"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar