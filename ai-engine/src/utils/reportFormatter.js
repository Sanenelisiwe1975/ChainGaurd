/**
 * Report Formatting Utilities
 * Formats analysis results into structured reports
 */

export const formatAnalysisResults = (staticResults, aiResults) => {
  // Combine static analysis and AI results
  const allVulnerabilities = [
    ...extractStaticVulnerabilities(staticResults),
    ...(aiResults.vulnerabilities || []),
  ]

  // Deduplicate vulnerabilities
  const uniqueVulnerabilities = deduplicateVulnerabilities(allVulnerabilities)

  // Sort by severity
  const sortedVulnerabilities = sortBySeverity(uniqueVulnerabilities)

  return {
    vulnerabilities: sortedVulnerabilities,
    severityCounts: countBySeverity(sortedVulnerabilities),
    categoryCounts: countByCategory(sortedVulnerabilities),
  }
}

const extractStaticVulnerabilities = (staticResults) => {
  const vulnerabilities = []

  staticResults.forEach((result) => {
    if (result.vulnerabilities && Array.isArray(result.vulnerabilities)) {
      result.vulnerabilities.forEach((vuln) => {
        vulnerabilities.push({
          ...vuln,
          source: 'static',
          analyzer: result.analyzer,
        })
      })
    }
  })

  return vulnerabilities
}

const deduplicateVulnerabilities = (vulnerabilities) => {
  const seen = new Set()
  const unique = []

  vulnerabilities.forEach((vuln) => {
    const key = `${vuln.type}-${vuln.line || 'general'}-${vuln.description}`
    
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(vuln)
    }
  })

  return unique
}

const sortBySeverity = (vulnerabilities) => {
  const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }

  return [...vulnerabilities].sort((a, b) => {
    return (severityOrder[a.severity] || 999) - (severityOrder[b.severity] || 999)
  })
}

const countBySeverity = (vulnerabilities) => {
  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }

  vulnerabilities.forEach((vuln) => {
    if (counts.hasOwnProperty(vuln.severity)) {
      counts[vuln.severity]++
    }
  })

  return counts
}

const countByCategory = (vulnerabilities) => {
  const counts = {}

  vulnerabilities.forEach((vuln) => {
    const category = vuln.type || 'Unknown'
    counts[category] = (counts[category] || 0) + 1
  })

  return counts
}

export const generateMarkdownReport = (analysis) => {
  let md = `# Security Audit Report\n\n`

  // Summary
  md += `## Summary\n\n`
  md += `**Security Score:** ${analysis.securityScore}/100\n`
  md += `**Overall Risk:** ${analysis.overallRisk}\n`
  md += `**Total Vulnerabilities:** ${analysis.vulnerabilities.length}\n\n`

  // Severity breakdown
  const counts = countBySeverity(analysis.vulnerabilities)
  md += `### Severity Breakdown\n\n`
  md += `- Critical: ${counts.CRITICAL}\n`
  md += `- High: ${counts.HIGH}\n`
  md += `- Medium: ${counts.MEDIUM}\n`
  md += `- Low: ${counts.LOW}\n\n`

  // Vulnerabilities
  if (analysis.vulnerabilities.length > 0) {
    md += `## Vulnerabilities\n\n`

    analysis.vulnerabilities.forEach((vuln, index) => {
      md += `### ${index + 1}. ${vuln.type} (${vuln.severity})\n\n`
      md += `**Description:** ${vuln.description}\n\n`
      
      if (vuln.location) {
        md += `**Location:** ${vuln.location}\n\n`
      }
      
      if (vuln.code) {
        md += `**Code:**\n\`\`\`solidity\n${vuln.code}\n\`\`\`\n\n`
      }
      
      md += `**Recommendation:** ${vuln.recommendation}\n\n`
      md += `---\n\n`
    })
  }

  return md
}

export const generateHTMLReport = (analysis) => {
  const severityColors = {
    CRITICAL: '#dc2626',
    HIGH: '#ea580c',
    MEDIUM: '#f59e0b',
    LOW: '#3b82f6',
  }

  let html = `
<!DOCTYPE html>
<html>
<head>
  <title>Security Audit Report</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 1000px; margin: 40px auto; padding: 20px; }
    h1 { color: #1f2937; }
    .summary { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .vulnerability { border-left: 4px solid #e5e7eb; padding: 15px; margin: 15px 0; }
    .severity { display: inline-block; padding: 4px 12px; border-radius: 4px; color: white; font-weight: bold; }
    .code { background: #1f2937; color: #f3f4f6; padding: 15px; border-radius: 4px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>Security Audit Report</h1>
  
  <div class="summary">
    <h2>Summary</h2>
    <p><strong>Security Score:</strong> ${analysis.securityScore}/100</p>
    <p><strong>Overall Risk:</strong> ${analysis.overallRisk}</p>
    <p><strong>Total Vulnerabilities:</strong> ${analysis.vulnerabilities.length}</p>
  </div>

  <h2>Vulnerabilities</h2>
`

  analysis.vulnerabilities.forEach((vuln, index) => {
    const color = severityColors[vuln.severity] || '#6b7280'
    
    html += `
  <div class="vulnerability">
    <h3>${index + 1}. ${vuln.type} <span class="severity" style="background: ${color}">${vuln.severity}</span></h3>
    <p><strong>Description:</strong> ${vuln.description}</p>
    ${vuln.location ? `<p><strong>Location:</strong> ${vuln.location}</p>` : ''}
    ${vuln.code ? `<div class="code"><pre>${vuln.code}</pre></div>` : ''}
    <p><strong>Recommendation:</strong> ${vuln.recommendation}</p>
  </div>
`
  })

  html += `
</body>
</html>
`

  return html
}

export default {
  formatAnalysisResults,
  generateMarkdownReport,
  generateHTMLReport,
  sortBySeverity,
  countBySeverity,
  countByCategory,
}