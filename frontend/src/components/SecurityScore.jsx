import { Shield, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'
import { RISK_COLORS } from '../config/constants'

const SecurityScore = ({ score, risk }) => {
  const getScoreColor = () => {
    if (score >= 90) return 'success'
    if (score >= 75) return 'success'
    if (score >= 60) return 'warning'
    if (score >= 40) return 'warning'
    return 'danger'
  }

  const getScoreLabel = () => {
    if (score >= 90) return 'Excellent'
    if (score >= 75) return 'Good'
    if (score >= 60) return 'Fair'
    if (score >= 40) return 'Poor'
    return 'Critical'
  }

  const getRiskIcon = () => {
    switch (risk) {
      case 'LOW':
        return <CheckCircle className="h-8 w-8" />
      case 'MEDIUM':
        return <AlertCircle className="h-8 w-8" />
      case 'HIGH':
      case 'CRITICAL':
        return <AlertTriangle className="h-8 w-8" />
      default:
        return <Shield className="h-8 w-8" />
    }
  }

  const getRiskColor = () => {
    return RISK_COLORS[risk] || 'info'
  }

  const colorClasses = {
    success: {
      bg: 'bg-success-50',
      text: 'text-success-700',
      border: 'border-success-300',
      icon: 'text-success-600',
    },
    warning: {
      bg: 'bg-warning-50',
      text: 'text-warning-700',
      border: 'border-warning-300',
      icon: 'text-warning-600',
    },
    danger: {
      bg: 'bg-danger-50',
      text: 'text-danger-700',
      border: 'border-danger-300',
      icon: 'text-danger-600',
    },
    info: {
      bg: 'bg-primary-50',
      text: 'text-primary-700',
      border: 'border-primary-300',
      icon: 'text-primary-600',
    },
  }

  const scoreColor = getScoreColor()
  const riskColor = getRiskColor()
  const classes = colorClasses[scoreColor]
  const riskClasses = colorClasses[riskColor]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Security Score */}
      <div className={`${classes.bg} ${classes.border} border-2 rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${classes.text}`}>Security Score</h3>
          <Shield className={`h-6 w-6 ${classes.icon}`} />
        </div>
        
        <div className="flex items-end space-x-2 mb-2">
          <div className={`text-5xl font-bold ${classes.text}`}>{score}</div>
          <div className={`text-2xl ${classes.text} pb-2`}>/100</div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${classes.text}`}>{getScoreLabel()}</span>
          <div className="flex-1 mx-4">
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div
                className={`h-full ${scoreColor === 'success' ? 'bg-success-500' : scoreColor === 'warning' ? 'bg-warning-500' : 'bg-danger-500'}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Risk Level */}
      <div className={`${riskClasses.bg} ${riskClasses.border} border-2 rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${riskClasses.text}`}>Overall Risk</h3>
          <div className={riskClasses.icon}>{getRiskIcon()}</div>
        </div>
        
        <div className={`text-4xl font-bold ${riskClasses.text} mb-2`}>
          {risk}
        </div>
        
        <p className={`text-sm ${riskClasses.text}`}>
          {risk === 'LOW' && 'Your contract has minimal security concerns'}
          {risk === 'MEDIUM' && 'Some security improvements recommended'}
          {risk === 'HIGH' && 'Significant security issues detected'}
          {risk === 'CRITICAL' && 'Critical vulnerabilities require immediate attention'}
        </p>
      </div>
    </div>
  )
}

export default SecurityScore