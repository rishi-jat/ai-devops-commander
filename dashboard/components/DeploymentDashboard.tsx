'use client'

import { useState, useEffect } from 'react'

interface Deployment {
  id: string
  deployment_id: string
  service: string
  version: string
  environment: string
  timestamp: string
  status: string
  ai_summary: string
  ai_decision: string
  ai_confidence: number
  ai_reasoning: string
  health_score: number
  metrics: {
    error_rate: string
    memory_usage: string
    response_time: string
  }
  logs?: string
}

export default function DeploymentDashboard() {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [selected, setSelected] = useState<Deployment | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'summary' | 'metrics' | 'logs'>('summary')

  const fetchDeployments = async () => {
    try {
      const res = await fetch('/api/deployments')
      if (res.ok) {
        const data = await res.json()
        setDeployments(data)
        if (!selected && data.length > 0) setSelected(data[0])
      }
    } catch (e) {
      console.error('Fetch failed:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeployments()
    const interval = setInterval(fetchDeployments, 5000)
    return () => clearInterval(interval)
  }, [])

  const trigger = async (type: 'good' | 'bad') => {
    await fetch('/api/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario: type })
    })
    setTimeout(fetchDeployments, 2000)
  }

  const formatTime = (ts: string) => {
    try {
      return new Date(ts).toLocaleString()
    } catch {
      return ts
    }
  }

  const stats = {
    total: deployments.length,
    healthy: deployments.filter(d => d.ai_decision === 'CONTINUE').length,
    rollback: deployments.filter(d => d.ai_decision === 'ROLLBACK').length
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">AI DevOps Commander</h1>
            <p className="text-xs text-gray-500">ai.devops.commander / ai-devops-workflow</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => trigger('good')}
            className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Simulate Healthy
          </button>
          <button
            onClick={() => trigger('bad')}
            className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Simulate Unhealthy
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-6 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">Executions:</span>
          <span className="font-medium text-gray-900">{stats.total}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-gray-500">Continue:</span>
          <span className="font-medium text-green-700">{stats.healthy}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          <span className="text-gray-500">Rollback:</span>
          <span className="font-medium text-red-700">{stats.rollback}</span>
        </div>
        <button onClick={fetchDeployments} className="ml-auto text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
          ) : deployments.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No executions yet</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {deployments.map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => setSelected(d)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${
                      selected?.id === d.id ? 'bg-indigo-50 border-l-2 border-indigo-600' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-medium text-gray-900 truncate">
                        {d.deployment_id}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        d.ai_decision === 'CONTINUE' 
                          ? 'bg-green-100 text-green-700' 
                          : d.ai_decision === 'ROLLBACK'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {d.ai_decision}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{d.service}</span>
                      <span>{d.version}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Detail Panel */}
        <main className="flex-1 overflow-y-auto">
          {selected ? (
            <div>
              {/* Detail Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selected.deployment_id}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {selected.service} · {selected.version} · {selected.environment}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      selected.ai_decision === 'CONTINUE' ? 'text-green-600' : 
                      selected.ai_decision === 'ROLLBACK' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {selected.ai_decision}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {(selected.ai_confidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white border-b border-gray-200">
                <nav className="flex px-6">
                  {(['summary', 'metrics', 'logs'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px ${
                        tab === t
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {tab === 'summary' && (
                  <div className="space-y-6">
                    {/* Health Score */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-900">Health Score</h3>
                        <span className={`text-3xl font-bold ${
                          selected.health_score >= 70 ? 'text-green-600' :
                          selected.health_score >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {selected.health_score}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selected.health_score >= 70 ? 'bg-green-500' :
                            selected.health_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${selected.health_score}%` }}
                        />
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">AI Analysis</h3>
                      <p className="text-sm text-gray-600 mb-3">{selected.ai_summary}</p>
                      <p className="text-sm text-gray-500">{selected.ai_reasoning}</p>
                    </div>

                    {/* Execution Info */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Execution Details</h3>
                      <dl className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <dt className="text-gray-500">Execution ID</dt>
                          <dd className="font-mono text-gray-900 mt-0.5">{selected.id}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Timestamp</dt>
                          <dd className="text-gray-900 mt-0.5">{formatTime(selected.timestamp)}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Status</dt>
                          <dd className="text-gray-900 mt-0.5 capitalize">{selected.status.replace('_', ' ')}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Environment</dt>
                          <dd className="text-gray-900 mt-0.5">{selected.environment}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                )}

                {tab === 'metrics' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">Error Rate</div>
                        <div className={`text-2xl font-bold ${
                          parseFloat(selected.metrics.error_rate) < 10 ? 'text-green-600' :
                          parseFloat(selected.metrics.error_rate) < 20 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {selected.metrics.error_rate}
                        </div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">Memory Usage</div>
                        <div className={`text-2xl font-bold ${
                          parseFloat(selected.metrics.memory_usage) < 70 ? 'text-green-600' :
                          parseFloat(selected.metrics.memory_usage) < 85 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {selected.metrics.memory_usage}
                        </div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">Response Time</div>
                        <div className={`text-2xl font-bold ${
                          parseFloat(selected.metrics.response_time) < 1000 ? 'text-green-600' :
                          parseFloat(selected.metrics.response_time) < 2000 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {selected.metrics.response_time}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Threshold</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-2 font-medium text-gray-900">Error Rate</td>
                            <td className="px-4 py-2 text-gray-600">{selected.metrics.error_rate}</td>
                            <td className="px-4 py-2 text-gray-500">&lt; 15%</td>
                            <td className="px-4 py-2">
                              {parseFloat(selected.metrics.error_rate) < 15 
                                ? <span className="text-green-600">OK</span>
                                : <span className="text-red-600">CRITICAL</span>
                              }
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-medium text-gray-900">Memory Usage</td>
                            <td className="px-4 py-2 text-gray-600">{selected.metrics.memory_usage}</td>
                            <td className="px-4 py-2 text-gray-500">&lt; 85%</td>
                            <td className="px-4 py-2">
                              {parseFloat(selected.metrics.memory_usage) < 85
                                ? <span className="text-green-600">OK</span>
                                : <span className="text-red-600">WARNING</span>
                              }
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-medium text-gray-900">Response Time</td>
                            <td className="px-4 py-2 text-gray-600">{selected.metrics.response_time}</td>
                            <td className="px-4 py-2 text-gray-500">&lt; 2000ms</td>
                            <td className="px-4 py-2">
                              {parseFloat(selected.metrics.response_time) < 2000
                                ? <span className="text-green-600">OK</span>
                                : <span className="text-red-600">SLA BREACH</span>
                              }
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {tab === 'logs' && (
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                    {selected.logs ? (
                      <pre className="text-gray-300 whitespace-pre-wrap">{selected.logs}</pre>
                    ) : (
                      <p className="text-gray-500">No logs available</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              Select an execution to view details
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
