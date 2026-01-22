// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Contract Addresses (update after deployment)
export const CONTRACT_ADDRESSES = {
  AUDIT_REGISTRY: import.meta.env.VITE_AUDIT_REGISTRY_ADDRESS || '0x...',
  AUDIT_VERIFIER: import.meta.env.VITE_AUDIT_VERIFIER_ADDRESS || '0x...',
  BOUNTY_MANAGER: import.meta.env.VITE_BOUNTY_MANAGER_ADDRESS || '0x...',
}

// Network Configuration
export const SUPPORTED_CHAINS = {
  SEPOLIA: {
    chainId: '0xaa36a7', // 11155111
    chainName: 'Sepolia',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://rpc.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
  BASE_SEPOLIA: {
    chainId: '0x14a34', // 84532
    chainName: 'Base Sepolia',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://sepolia.base.org'],
    blockExplorerUrls: ['https://sepolia.basescan.org'],
  },
  BASE: {
    chainId: '0x2105', // 8453
    chainName: 'Base',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org'],
  },
}

// Default chain for the app
export const DEFAULT_CHAIN = SUPPORTED_CHAINS.SEPOLIA

// Risk Level Colors
export const RISK_COLORS = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'danger',
  CRITICAL: 'danger',
  UNKNOWN: 'info',
}

// Severity Colors
export const SEVERITY_COLORS = {
  LOW: 'text-success-600 bg-success-50',
  MEDIUM: 'text-warning-600 bg-warning-50',
  HIGH: 'text-danger-600 bg-danger-50',
  CRITICAL: 'text-danger-800 bg-danger-100',
}

// Supported Languages
export const SUPPORTED_LANGUAGES = [
  { value: 'solidity', label: 'Solidity' },
  { value: 'rust', label: 'Rust' },
  { value: 'vyper', label: 'Vyper' },
]

// IPFS Gateway
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/'

// Max file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024