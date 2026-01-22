# ChainGuard

> AI-Powered Smart Contract Security Auditor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)

ChainGuard is a comprehensive security auditing platform that combines advanced AI analysis, decentralized storage, and blockchain verification to provide trustworthy smart contract audits.

Built for **W3Node Hackathon 2026** | Track: **Identity and Security** (+ Decentralized AI and Storage)

---

## 🎯 Problem Statement

Smart contract vulnerabilities cost billions in losses annually. Traditional audits are:
- **Expensive**: $50k-$200k+ per audit
- **Slow**: Weeks to months turnaround
- **Inaccessible**: Only for well-funded projects
- **Unverifiable**: No standardized proof of authenticity

## 💡 Solution

ChainGuard democratizes smart contract security through:
- **AI-Powered Analysis**: Instant vulnerability detection using Claude API
- **Decentralized Storage**: Immutable reports stored on IPFS
- **Blockchain Verification**: On-chain audit registry with cryptographic proofs
- **Affordable & Fast**: Sub-5-minute audits at minimal cost

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  - Upload Contract  - Dashboard  - Report Viewer  - Verify  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (Node.js)                     │
│  - Contract Parser  - AI Service  - IPFS Integration        │
└─────────┬───────────────────────┬───────────────────────────┘
          │                       │
          ▼                       ▼
┌──────────────────┐    ┌──────────────────────────────────┐
│  AI Engine       │    │  Smart Contracts (Solidity)      │
│  (Claude API)    │    │  - AuditRegistry                 │
│  - Vulnerability │    │  - AuditVerifier                 │
│    Detection     │    │  - BountyManager                 │
└──────────────────┘    └──────────────────────────────────┘
          │                       │
          ▼                       ▼
┌──────────────────────────────────────────────────────────┐
│              Decentralized Storage (IPFS)                 │
│  - Audit Reports  - Metadata  - Verification Proofs      │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- IPFS daemon (optional for local testing)
- MetaMask wallet
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chainguard.git
cd chainguard

# Install all dependencies
npm run install:all

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp contracts/.env.example contracts/.env

# Edit environment files with your credentials
nano backend/.env  # Add ANTHROPIC_API_KEY
nano contracts/.env  # Add PRIVATE_KEY for deployment
```

### Development

```bash
# Start IPFS daemon (in separate terminal)
ipfs daemon

# Start all services
npm run dev

# Or start individually:
npm run dev:backend   # Backend on http://localhost:3000
npm run dev:frontend  # Frontend on http://localhost:5173
npm run dev:contracts # Local blockchain on http://localhost:8545
```

### Deployment

```bash
# Deploy smart contracts to Sepolia testnet
npm run deploy:contracts

# Copy contract addresses to frontend/.env
# VITE_AUDIT_REGISTRY_ADDRESS=0x...
# VITE_AUDIT_VERIFIER_ADDRESS=0x...

# Build frontend for production
npm run build:frontend
```

---

## 📦 Project Structure

```
chainguard/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Helper functions
│   │   └── config/        # Configuration
│   └── package.json
│
├── backend/               # Node.js + Express API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   │   ├── claudeService.js
│   │   │   ├── ipfsService.js
│   │   │   └── reportService.js
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utilities
│   └── package.json
│
├── contracts/             # Hardhat + Solidity
│   ├── contracts/
│   │   ├── AuditRegistry.sol
│   │   ├── AuditVerifier.sol
│   │   └── BountyManager.sol
│   ├── scripts/           # Deployment scripts
│   ├── test/              # Contract tests
│   └── package.json
│
├── ai-engine/             # AI Analysis Engine
│   ├── src/
│   │   ├── analyzers/     # Vulnerability analyzers
│   │   └── prompts/       # AI prompts
│   └── package.json
│
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEPLOYMENT.md
│
├── scripts/               # Utility scripts
│   ├── setup.sh
│   └── deploy-all.sh
│
├── docker-compose.yml     # Docker configuration
├── package.json           # Root workspace config
└── README.md
```

---

## 🔑 Key Features

### 1. AI-Powered Analysis
- **8+ Vulnerability Types**: Reentrancy, access control, overflows, etc.
- **Claude API Integration**: Advanced pattern recognition
- **Structured Reports**: JSON + Markdown formats
- **Security Scoring**: 0-100 with risk levels

### 2. Decentralized Storage
- **IPFS Integration**: Permanent, tamper-proof storage
- **Content Addressing**: Verifiable through CIDs
- **Metadata On-Chain**: Lightweight blockchain footprint

### 3. Blockchain Verification
- **Smart Contract Registry**: Immutable audit records
- **Cryptographic Signatures**: ECDSA verification
- **Multi-Chain Support**: Sepolia, Base, Base Sepolia

### 4. User Experience
- **Sub-5-Minute Audits**: Instant results
- **Beautiful UI**: Modern React interface
- **Web3 Wallet**: MetaMask integration
- **Mobile Responsive**: Works on all devices

---

## 🛠️ Technology Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Ethers.js v6
- React Query

**Backend:**
- Node.js 20+
- Express.js
- Anthropic Claude API
- IPFS (js-ipfs-http-client)

**Blockchain:**
- Solidity 0.8.20+
- Hardhat
- OpenZeppelin Contracts
- Ethers.js

**DevOps:**
- Docker
- GitHub Actions
- Vercel/Netlify

---

## 📊 API Endpoints

### Audit Endpoints
```bash
POST /api/audit/analyze      # Full audit with IPFS storage
POST /api/audit/quick        # Quick AI analysis
GET  /api/audit/:auditId     # Get audit by ID
```

### IPFS Endpoints
```bash
GET  /api/ipfs/:cid          # Retrieve report from IPFS
```

### Verification Endpoints
```bash
POST /api/verify             # Verify report signature
```

See [API Documentation](docs/API.md) for details.

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Test backend
npm run test:backend

# Test smart contracts
npm run test:contracts

# Coverage report
cd contracts && npx hardhat coverage
```

---

## 🎯 Hackathon Submission

### Track Alignment

**Primary: Identity and Security**
- Cryptographic verification of audit reports
- On-chain identity for auditors
- Tamper-proof audit registry
- Security analysis for smart contracts

**Secondary: Decentralized AI and Storage**
- AI-powered vulnerability detection
- IPFS for decentralized report storage
- Distributed verification system

### Innovation

1. **First AI + Blockchain Audit Platform**: Combines Claude AI with on-chain verification
2. **Decentralized Proof System**: Cryptographic signatures + IPFS + blockchain
3. **Democratized Security**: Makes audits accessible to all developers
4. **Open Architecture**: Extensible for custom analyzers and rules

### Impact

- **Developers**: Instant, affordable security audits
- **Users**: Trust in audited smart contracts
- **Ecosystem**: Reduced vulnerability exploits
- **Security Researchers**: Bounty opportunities

---

## 🎬 Demo

### Live Demo
- **Frontend**: [https://chainguard-demo.vercel.app](https://chainguard-demo.vercel.app)
- **Video**: [YouTube Demo](https://youtube.com/...)

### Demo Flow
1. Upload vulnerable contract
2. AI analyzes and generates report
3. View security score and vulnerabilities
4. Report stored on IPFS
5. Verify report authenticity
6. (Optional) Register on blockchain

---

## 📈 Future Roadmap

- [ ] **Multi-Language Support**: Rust, Move, Cairo
- [ ] **Real-Time Monitoring**: Continuous contract surveillance
- [ ] **Bug Bounty Platform**: Incentivize security research
- [ ] **AI Model Fine-Tuning**: Custom vulnerability patterns
- [ ] **Governance DAO**: Community-driven audit standards
- [ ] **Mobile App**: iOS/Android native apps
- [ ] **IDE Plugins**: VS Code, IntelliJ integration

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Fork the repository
# Create feature branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m 'Add amazing feature'

# Push to branch
git push origin feature/amazing-feature

# Open Pull Request
```

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

---

## 🏆 Team

Built with ❤️ for W3Node Hackathon 2026

- **Developer**: [Your Name]
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)

---

## 📞 Support

- **Documentation**: [docs.chainguard.io](https://docs.chainguard.io)
- **Discord**: [Join Community](https://discord.gg/chainguard)
- **Email**: support@chainguard.io
- **Issues**: [GitHub Issues](https://github.com/yourusername/chainguard/issues)

---

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com) - Claude API
- [IPFS](https://ipfs.io) - Decentralized storage
- [OpenZeppelin](https://openzeppelin.com) - Smart contract security
- [W3Node](https://w3node.com) - Hackathon organizers

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made for W3Node Hackathon 2026 🚀

</div>