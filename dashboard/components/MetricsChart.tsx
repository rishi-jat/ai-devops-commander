'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Props {
  deploymentId: string
}

export default function MetricsChart({ deploymentId }: Props) {
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`/api/metrics/${deploymentId}`)
        if (response.ok) {
          const data = await response.json()
          setMetrics(data)
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
      }
    }

    fetchMetrics()
  }, [deploymentId])

  if (!metrics) {
    return (
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Metrics
        </h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Loading metrics...</p>
        </div>
      </div>
    )
  }

  // Generate time series data for visualization
  const timeSeriesData = [
    { time: '0m', errorRate: 0.5, responseTime: 120, memory: 45 },
    { time: '1m', errorRate: 2.1, responseTime: 145, memory: 52 },
    { time: '2m', errorRate: 8.5, responseTime: 320, memory: 68 },
    { time: '3m', errorRate: metrics.metrics?.error_rate_percent || 0, responseTime: metrics.metrics?.response_time_ms?.avg || 0, memory: metrics.metrics?.memory_usage_percent || 0 },
  ]

  return (
    <div className="metric-card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Performance Metrics
      </h3>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricValue
          label="Error Rate"
          value={`${metrics.metrics?.error_rate_percent?.toFixed(1)}%`}
          trend={metrics.metrics?.error_rate_percent > 5 ? 'up' : 'stable'}
        />
        <MetricValue
          label="Avg Response"
          value={`${metrics.metrics?.response_time_ms?.avg}ms`}
          trend={metrics.metrics?.response_time_ms?.avg > 500 ? 'up' : 'stable'}
        />
        <MetricValue
          label="Memory"
          value={`${metrics.metrics?.memory_usage_percent}%`}
          trend={metrics.metrics?.memory_usage_percent > 80 ? 'up' : 'stable'}
        />
        <MetricValue
          label="Health Score"
          value={`${metrics.health_score}/100`}
          trend={metrics.health_score < 70 ? 'down' : 'stable'}
        />
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Error Rate Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Error Rate Over Time
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="errorRate"
                stroke="#ef4444"
                fill="url(#errorGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Response Time & Memory Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Response Time & Memory Usage
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="responseTime"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Response Time (ms)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="memory"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Memory (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Anomalies */}
      {metrics.anomalies && metrics.anomalies.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            Anomalies Detected
          </h4>
          <ul className="space-y-1">
            {metrics.anomalies.map((anomaly: string, index: number) => (
              <li key={index} className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                {anomaly}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function MetricValue({ label, value, trend }: {
  label: string
  value: string
  trend: 'up' | 'down' | 'stable'
}) {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-red-600 dark:text-red-400'
    if (trend === 'down') return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{label}</p>
      <p className={`text-lg font-bold ${getTrendColor()}`}>{value}</p>
    </div>
  )
}
