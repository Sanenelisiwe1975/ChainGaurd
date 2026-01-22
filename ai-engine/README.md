# ChainGuard AI Engine

Modular AI-powered vulnerability detection engine for smart contracts.

## Overview

The AI Engine combines static analysis with AI-powered semantic analysis to detect vulnerabilities in smart contracts. It features:

- **8+ Specialized Analyzers** - Each focuses on specific vulnerability types
- **Multi-Language Support** - Solidity, Rust, Vyper
- **Optimized Prompts** - Fine-tuned for security analysis
- **Structured Output** - Consistent JSON format

## Architecture

```
ai-engine/
├── src/
│   ├── analyzers/           # Vulnerability-specific analyzers
│   │   ├── index.js         # Exports all analyzers
│   │   ├── reentrancyAnalyzer.js
│   │   ├── accessControlAnalyzer.js
│   │   ├── overflowAnalyzer.js
│   │   ├── gasAnalyzer.js
│   │   ├── uncheckedCallAnalyzer.js
│   │   ├── timestampDependenceAnalyzer.js
│   │   ├── txOriginAnalyzer.js
│   │   └── selfDestructAnalyzer.js
│   ├── prompts/             # AI prompts for different languages
│   │   ├── solidityPrompt.js
│   │   └── basePrompt.js
│   ├── utils/               # Helper utilities
│   │   ├── codeParser.js
│   │   └── reportFormatter.js
│   └── index.js             # Main entry point
└── package.json
```

## Analyzers

### 1. Reentrancy Analyzer
**Detects:** External calls before state changes  
**Severity:** HIGH  
**Checks:**
- Call-state-change order
- Missing reentrancy guards
- Vulnerable patterns

### 2. Access Control Analyzer
**Detects:** Missing authorization checks  
**Severity:** MEDIUM-HIGH  
**Checks:**
- Admin function protection
- Modifier usage
- tx.origin authentication

### 3. Integer Overflow Analyzer
**Detects:** Arithmetic vulnerabilities  
**Severity:** MEDIUM-HIGH  
**Checks:**
- Solidity version
- SafeMath usage
- Unchecked blocks

### 4. Gas Analyzer
**Detects:** Gas inefficiencies  
**Severity:** LOW-MEDIUM  
**Checks:**
- Unbounded loops
- Storage reads in loops
- Type inefficiencies
- Optimization opportunities

### 5. Unchecked Call Analyzer
**Detects:** Unchecked return values  
**Severity:** HIGH-CRITICAL  
**Checks:**
- .call() without checks
- .send() without checks
- .delegatecall() without checks

### 6. Timestamp Dependence Analyzer
**Detects:** Reliance on block.timestamp  
**Severity:** LOW-HIGH  
**Checks:**
- Timestamp in conditions
- Randomness generation
- Time-sensitive logic

### 7. tx.origin Analyzer
**Detects:** Dangerous tx.origin usage  
**Severity:** HIGH  
**Checks:**
- Authentication with tx.origin
- Phishing vulnerability

### 8. Self-Destruct Analyzer
**Detects:** Unprotected destruction  
**Severity:** CRITICAL  
**Checks:**
- Access control
- Deprecated suicide()
- Fund handling

## Usage

### Basic Analysis

```javascript
import { runStaticAnalysis, calculateSecurityScore } from './src/index.js'

const code = `
pragma solidity ^0.8.0;
contract Example {
  // contract code
}
`

// Run static analysis
const results = runStaticAnalysis(code, 'solidity')

// Calculate security score
const score = calculateSecurityScore(results.flatMap(r => r.vulnerabilities || []))

console.log('Security Score:', score)
console.log('Vulnerabilities:', results)
```

### With AI Analysis

```javascript
import { generatePrompt } from './src/index.js'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Generate optimized prompt
const prompt = generatePrompt(code, 'solidity')

// Call Claude API
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 4096,
  messages: [{ role: 'user', content: prompt }]
})

const analysis = JSON.parse(message.content[0].text)
```

### Custom Analyzer

```javascript
// Create custom analyzer
const myAnalyzer = {
  name: 'Custom Analyzer',
  check: (code) => {
    const vulnerabilities = []
    
    // Your analysis logic here
    if (code.includes('unsafe_pattern')) {
      vulnerabilities.push({
        type: 'Custom Vulnerability',
        severity: 'MEDIUM',
        description: 'Unsafe pattern detected',
        recommendation: 'Use safe alternative'
      })
    }
    
    return {
      vulnerable: vulnerabilities.length > 0,
      vulnerabilities,
      severity: 'MEDIUM'
    }
  }
}

// Use it
const results = myAnalyzer.check(code)
```

## API Reference

### runStaticAnalysis(code, language)
Runs all static analyzers on the code.

**Parameters:**
- `code` (string) - Contract source code
- `language` (string) - 'solidity' | 'rust' | 'vyper'

**Returns:** Array of analyzer results

### calculateSecurityScore(vulnerabilities)
Calculates security score based on vulnerabilities.

**Parameters:**
- `vulnerabilities` (array) - Array of vulnerability objects

**Returns:** Number (0-100)

### determineRiskLevel(vulnerabilities)
Determines overall risk level.

**Parameters:**
- `vulnerabilities` (array) - Array of vulnerability objects

**Returns:** String ('LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')

### generatePrompt(code, language)
Generates optimized AI prompt for analysis.

**Parameters:**
- `code` (string) - Contract source code
- `language` (string) - Programming language

**Returns:** String (formatted prompt)

## Analyzer Output Format

```javascript
{
  name: 'Analyzer Name',
  vulnerable: true,
  vulnerabilities: [
    {
      type: 'Vulnerability Type',
      severity: 'HIGH',
      line: 42,
      description: 'What the issue is',
      code: 'vulnerable code snippet',
      recommendation: 'How to fix it',
      estimatedSavings: 'gas savings (optional)'
    }
  ],
  severity: 'HIGH'
}
```

## Adding New Analyzers

1. Create analyzer file in `src/analyzers/`
2. Implement the analyzer pattern:

```javascript
export const myAnalyzer = {
  name: 'My Analyzer',
  check: (code) => {
    // Analysis logic
    return {
      vulnerable: boolean,
      vulnerabilities: array,
      severity: string
    }
  }
}
```

3. Export from `src/analyzers/index.js`
4. Add to the analyzers array

## Testing

```bash
npm test
```

## Performance

- **Static Analysis:** <100ms per contract
- **AI Analysis:** 2-5 seconds per contract
- **Combined:** ~5 seconds total

## Limitations

- Static analysis catches known patterns only
- AI analysis quality depends on prompt engineering
- No formal verification
- False positives possible

## Future Enhancements

- [ ] Machine learning for pattern detection
- [ ] Formal verification integration
- [ ] Custom rule engine
- [ ] Multi-file analysis
- [ ] Dependency scanning
- [ ] Real-time analysis

## Contributing

Contributions welcome! Please:
1. Add tests for new analyzers
2. Follow existing code style
3. Document new patterns
4. Update this README

## License

MIT