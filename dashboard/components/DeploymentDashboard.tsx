'use client'

import { useEffect, useState } from 'react'
import { Activity, CheckCircle, XCircle, AlertTriangle, TrendingUp, Clock, Cpu, Database } from 'lucide-react'
import { formatDistance } from 'date-fns'
import MetricsChart from './MetricsChart'
import DeploymentTimeline from './DeploymentTimeline'

interface Deployment {
  deployment_id: string
  timestamp: string
  service: string
  version: string
  status: string
  ai_summary: string
  ai_decision: string
  ai_confidence: number
  ai_reasoning: string
  action_taken: string
  outcome: string
  labels: string[]
}

interface DeploymentData {
  deployment_history: Deployment[]
  summary_stats: {
    total_deployments: number
    successful_deployments: number
    failed_deployments: number
    rollback_rate_percent: number
    ai_accuracy_rate: number
    mttr_seconds: number
  }
}

export default function DeploymentDashboard() {
  const [data, setData] = useState<DeploymentData | null>(null)
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/deployments')
        const result = await response.json()
        setData(result)
        if (result.deployment_history.length > 0) {
          setSelectedDeployment(result.deployment_history[0])
        }
      } catch (error) {
        console.error('Failed to fetch deployments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600">Failed to load deployment data</div>
      </div>
    )
  }

  const { deployment_history, summary_stats } = data

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI DevOps Commander
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Autonomous deployment monitoring with AI-powered decision making
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Deployments"
          value={summary_stats.total_deployments}
          icon={<Database className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Success Rate"
          value={`${((summary_stats.successful_deployments / summary_stats.total_deployments) * 100).toFixed(0)}%`}
          icon={<CheckCircle className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="AI Accuracy"
          value={`${(summary_stats.ai_accuracy_rate * 100).toFixed(0)}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          title="MTTR"
          value={`${Math.floor(summary_stats.mttr_seconds / 60)}m`}
          icon={<Clock className="w-5 h-5" />}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deployment Timeline */}
        <div className="lg:col-span-1">
          <DeploymentTimeline
            deployments={deployment_history}
            selectedId={selectedDeployment?.deployment_id}
            onSelect={setSelectedDeployment}
          />
        </div>

        {/* Deployment Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDeployment && (
            <>
              {/* AI Decision Card */}
              <div className="metric-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {selectedDeployment.service}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedDeployment.version} • {formatDistance(new Date(selectedDeployment.timestamp), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                  <StatusBadge status={selectedDeployment.status} />
                </div>

                <div className="space-y-4">
                  {/* AI Summary */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                        AI Analysis
                      </h3>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {selectedDeployment.ai_summary}
                    </p>
                  </div>

                  {/* AI Decision */}
                  <div className={`rounded-lg p-4 ${
                    selectedDeployment.ai_decision === 'ROLLBACK'
                      ? 'bg-red-50 dark:bg-red-900/20'
                      : 'bg-green-50 dark:bg-green-900/20'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {selectedDeployment.ai_decision === 'ROLLBACK' ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                        <h3 className={`font-semibold ${
                          selectedDeployment.ai_decision === 'ROLLBACK'
                            ? 'text-red-900 dark:text-red-100'
                            : 'text-green-900 dark:text-green-100'
                        }`}>
                          Decision: {selectedDeployment.ai_decision}
                        </h3>
                      </div>
                      <span className={`text-sm font-medium ${
                        selectedDeployment.ai_decision === 'ROLLBACK'
                          ? 'text-red-700 dark:text-red-300'
                          : 'text-green-700 dark:text-green-300'
                      }`}>
                        {selectedDeployment.ai_confidence}% confident
                      </span>
                    </div>
                    <p className={`text-sm ${
                      selectedDeployment.ai_decision === 'ROLLBACK'
                        ? 'text-red-800 dark:text-red-200'
                        : 'text-green-800 dark:text-green-200'
                    }`}>
                      {selectedDeployment.ai_reasoning}
                    </p>
                  </div>

                  {/* Action & Outcome */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Action Taken
                      </h4>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedDeployment.action_taken}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Outcome
                      </h4>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedDeployment.outcome}
                      </p>
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="flex flex-wrap gap-2">
                    {selectedDeployment.labels.map((label) => (
                      <span
                        key={label}
                        className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metrics Chart */}
              <MetricsChart deploymentId={selectedDeployment.deployment_id} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }: {
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    green: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
    orange: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
  }

  return (
    <div className="metric-card">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const getStatusStyle = () => {
    if (status === 'healthy') {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    }
    if (status === 'rolled_back') {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    }
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle()}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  )
}
