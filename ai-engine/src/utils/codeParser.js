/**
 * Smart Contract Code Parser
 * Utilities for parsing and analyzing contract code structure
 */

export const parseContract = (code, language = 'solidity') => {
  const parsers = {
    solidity: parseSolidityContract,
    rust: parseRustContract,
    vyper: parseVyperContract,
  }

  const parser = parsers[language.toLowerCase()] || parseSolidityContract
  return parser(code)
}

const parseSolidityContract = (code) => {
  const result = {
    language: 'solidity',
    version: extractSolidityVersion(code),
    contracts: extractContracts(code),
    functions: extractFunctions(code),
    modifiers: extractModifiers(code),
    events: extractEvents(code),
    imports: extractImports(code),
    pragmas: extractPragmas(code),
    inheritances: extractInheritances(code),
  }

  return result
}

const parseRustContract = (code) => {
  // Basic Rust parsing
  return {
    language: 'rust',
    modules: extractRustModules(code),
    functions: extractRustFunctions(code),
    structs: extractRustStructs(code),
  }
}

const parseVyperContract = (code) => {
  // Basic Vyper parsing
  return {
    language: 'vyper',
    version: extractVyperVersion(code),
    functions: extractVyperFunctions(code),
    events: extractVyperEvents(code),
  }
}

// Solidity-specific extractors
const extractSolidityVersion = (code) => {
  const match = code.match(/pragma solidity\s+[\^]?([\d.]+)/)
  return match ? match[1] : 'unknown'
}

const extractContracts = (code) => {
  const contracts = []
  const regex = /contract\s+(\w+)(?:\s+is\s+([\w,\s]+))?\s*{/g
  let match

  while ((match = regex.exec(code)) !== null) {
    contracts.push({
      name: match[1],
      inherits: match[2] ? match[2].split(',').map(s => s.trim()) : [],
      position: match.index,
    })
  }

  return contracts
}

const extractFunctions = (code) => {
  const functions = []
  const regex = /function\s+(\w+)\s*\((.*?)\)\s*(public|private|internal|external)?\s*(view|pure|payable)?\s*(returns\s*\((.*?)\))?\s*{/g
  let match

  while ((match = regex.exec(code)) !== null) {
    functions.push({
      name: match[1],
      parameters: match[2],
      visibility: match[3] || 'public',
      stateMutability: match[4] || '',
      returns: match[6] || '',
      position: match.index,
    })
  }

  return functions
}

const extractModifiers = (code) => {
  const modifiers = []
  const regex = /modifier\s+(\w+)(?:\s*\((.*?)\))?\s*{/g
  let match

  while ((match = regex.exec(code)) !== null) {
    modifiers.push({
      name: match[1],
      parameters: match[2] || '',
      position: match.index,
    })
  }

  return modifiers
}

const extractEvents = (code) => {
  const events = []
  const regex = /event\s+(\w+)\s*\((.*?)\);/g
  let match

  while ((match = regex.exec(code)) !== null) {
    events.push({
      name: match[1],
      parameters: match[2],
      position: match.index,
    })
  }

  return events
}

const extractImports = (code) => {
  const imports = []
  const regex = /import\s+(?:"([^"]+)"|'([^']+)'|{([^}]+)}\s+from\s+(?:"([^"]+)"|'([^']+)'))/g
  let match

  while ((match = regex.exec(code)) !== null) {
    imports.push({
      path: match[1] || match[2] || match[4] || match[5],
      items: match[3] ? match[3].split(',').map(s => s.trim()) : null,
    })
  }

  return imports
}

const extractPragmas = (code) => {
  const pragmas = []
  const regex = /pragma\s+(\w+)\s+(.*?);/g
  let match

  while ((match = regex.exec(code)) !== null) {
    pragmas.push({
      type: match[1],
      value: match[2],
    })
  }

  return pragmas
}

const extractInheritances = (code) => {
  const inheritances = new Map()
  const regex = /contract\s+(\w+)(?:\s+is\s+([\w,\s]+))?\s*{/g
  let match

  while ((match = regex.exec(code)) !== null) {
    if (match[2]) {
      inheritances.set(match[1], match[2].split(',').map(s => s.trim()))
    }
  }

  return Object.fromEntries(inheritances)
}

// Rust-specific extractors
const extractRustModules = (code) => {
  const modules = []
  const regex = /mod\s+(\w+)/g
  let match

  while ((match = regex.exec(code)) !== null) {
    modules.push(match[1])
  }

  return modules
}

const extractRustFunctions = (code) => {
  const functions = []
  const regex = /(?:pub\s+)?fn\s+(\w+)\s*\(/g
  let match

  while ((match = regex.exec(code)) !== null) {
    functions.push({
      name: match[1],
      position: match.index,
    })
  }

  return functions
}

const extractRustStructs = (code) => {
  const structs = []
  const regex = /(?:pub\s+)?struct\s+(\w+)/g
  let match

  while ((match = regex.exec(code)) !== null) {
    structs.push(match[1])
  }

  return structs
}

// Vyper-specific extractors
const extractVyperVersion = (code) => {
  const match = code.match(/#\s*@version\s+([\d.]+)/)
  return match ? match[1] : 'unknown'
}

const extractVyperFunctions = (code) => {
  const functions = []
  const regex = /@(?:external|internal|public|private)\s+def\s+(\w+)\s*\(/g
  let match

  while ((match = regex.exec(code)) !== null) {
    functions.push({
      name: match[1],
      position: match.index,
    })
  }

  return functions
}

const extractVyperEvents = (code) => {
  const events = []
  const regex = /event\s+(\w+):/g
  let match

  while ((match = regex.exec(code)) !== null) {
    events.push({
      name: match[1],
      position: match.index,
    })
  }

  return events
}

export default {
  parseContract,
  parseSolidityContract,
  parseRustContract,
  parseVyperContract,
}