'use client'

import { useState, useEffect, useCallback } from 'react'

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
  const [filter, setFilter] = useState<'all' | 'continue' | 'rollback'>('all')
  const [showClearModal, setShowClearModal] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)

  const fetchDeployments = useCallback(async () => {
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
  }, [selected])

  useEffect(() => {
    fetchDeployments()
    if (autoRefresh) {
      const interval = setInterval(fetchDeployments, 5000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, fetchDeployments])

  const trigger = async (type: 'good' | 'bad') => {
    await fetch('/api/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario: type })
    })
    setTimeout(fetchDeployments, 2000)
  }

  const clearHistory = () => {
    setDeployments([])
    setSelected(null)
    setShowClearModal(false)
  }

  const deleteDeployment = (id: string) => {
    setDeployments(prev => prev.filter(d => d.id !== id))
    if (selected?.id === id) {
      setSelected(deployments.find(d => d.id !== id) || null)
    }
  }

  const formatTime = (ts: string) => {
    try {
      const date = new Date(ts)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      if (diff < 60000) return 'now'
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } catch {
      return ''
    }
  }

  const filteredDeployments = deployments.filter(d => {
    if (filter === 'continue') return d.ai_decision === 'CONTINUE'
    if (filter === 'rollback') return d.ai_decision === 'ROLLBACK'
    return true
  })

  const stats = {
    total: deployments.length,
    healthy: deployments.filter(d => d.ai_decision === 'CONTINUE').length,
    rollback: deployments.filter(d => d.ai_decision === 'ROLLBACK').length
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="h-14 border-b border-gray-200 px-3 sm:px-4 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile menu button */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden p-1.5 -ml-1 rounded-md hover:bg-gray-200"
            title="Toggle menu"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 9h6v6H9z" />
            <path d="M9 3v6M15 3v6M9 15v6M15 15v6M3 9h6M3 15h6M15 9h6M15 15h6" />
          </svg>
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">AI DevOps Commander</span>
            <span className="text-gray-400 hidden sm:inline">/</span>
            <span className="text-gray-600 text-xs sm:text-sm hidden sm:inline">ai-devops-workflow</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-1.5 sm:p-2 rounded-md border text-sm ${autoRefresh ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
            title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => trigger('good')}
            className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
          >
            <span className="hidden sm:inline">+ </span>Healthy
          </button>
          <button
            onClick={() => trigger('bad')}
            className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
          >
            <span className="hidden sm:inline">+ </span>Faulty
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-56px)] relative">
        {/* Mobile overlay */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black/30 z-20 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`
          fixed lg:relative inset-y-0 left-0 z-30 lg:z-0
          w-72 sm:w-80 border-r border-gray-200 flex flex-col bg-white lg:bg-gray-50/50
          transform transition-transform duration-200 ease-in-out
          ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          top-14 lg:top-0 h-[calc(100vh-56px)] lg:h-full
        `}>
          {/* Stats */}
          <div className="p-3 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="text-gray-500">Total: <span className="font-medium text-gray-900">{stats.total}</span></span>
                <span className="text-gray-500">OK: <span className="font-medium text-green-600">{stats.healthy}</span></span>
                <span className="text-gray-500">Fail: <span className="font-medium text-red-600">{stats.rollback}</span></span>
              </div>
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="p-2 border-b border-gray-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {(['all', 'continue', 'rollback'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2 py-1 text-xs rounded-md ${filter === f ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {f === 'all' ? 'All' : f === 'continue' ? 'Continue' : 'Rollback'}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowClearModal(true)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
              title="Clear history"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Deployment List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
            ) : filteredDeployments.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                {filter !== 'all' ? 'No matching deployments' : 'No deployments yet'}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredDeployments.map((d) => (
                  <div
                    key={d.id}
                    className={`group relative ${selected?.id === d.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <button
                      onClick={() => { setSelected(d); setShowSidebar(false) }}
                      className="w-full text-left px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${
                            d.ai_decision === 'CONTINUE' ? 'bg-green-500' : 
                            d.ai_decision === 'ROLLBACK' ? 'bg-red-500' : 'bg-yellow-500'
                          }`} />
                          <span className="text-sm font-medium text-gray-900 truncate">{d.deployment_id}</span>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0 ml-2">{formatTime(d.timestamp)}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 ml-4">
                        <span>{d.service}</span>
                        <span className="text-gray-300">·</span>
                        <span>{d.version}</span>
                        <span className="text-gray-300">·</span>
                        <span className={`font-medium ${
                          d.ai_decision === 'CONTINUE' ? 'text-green-600' : 'text-red-600'
                        }`}>{d.ai_decision}</span>
                      </div>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteDeployment(d.id) }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 rounded"
                      title="Remove"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="text-xs text-gray-400">
              Powered by Kestra · Together AI · Oumi
            </div>
          </div>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 overflow-y-auto bg-white lg:ml-0">
          {selected ? (
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4 sm:mb-6 gap-3">
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{selected.deployment_id}</h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {selected.service} · {selected.version} · {selected.environment}
                  </p>
                </div>
                <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium shrink-0 ${
                  selected.ai_decision === 'CONTINUE' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selected.ai_decision}
                </div>
              </div>

              {/* Decision Card */}
              <div className={`rounded-lg border p-3 sm:p-4 mb-4 sm:mb-6 ${
                selected.ai_decision === 'CONTINUE' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700 mb-1">AI Decision</div>
                    <p className="text-sm text-gray-600">{selected.ai_summary}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{(selected.ai_confidence * 100).toFixed(0)}%</div>
                    <div className="text-xs text-gray-500">confidence</div>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Health Score</div>
                  <div className={`text-lg sm:text-xl font-semibold ${
                    selected.health_score >= 70 ? 'text-green-600' :
                    selected.health_score >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>{selected.health_score}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Error Rate</div>
                  <div className={`text-lg sm:text-xl font-semibold ${
                    parseFloat(selected.metrics.error_rate) < 10 ? 'text-green-600' :
                    parseFloat(selected.metrics.error_rate) < 20 ? 'text-yellow-600' : 'text-red-600'
                  }`}>{selected.metrics.error_rate}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Memory</div>
                  <div className={`text-lg sm:text-xl font-semibold ${
                    parseFloat(selected.metrics.memory_usage) < 70 ? 'text-green-600' :
                    parseFloat(selected.metrics.memory_usage) < 85 ? 'text-yellow-600' : 'text-red-600'
                  }`}>{selected.metrics.memory_usage}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Response</div>
                  <div className={`text-lg sm:text-xl font-semibold ${
                    parseFloat(selected.metrics.response_time) < 500 ? 'text-green-600' :
                    parseFloat(selected.metrics.response_time) < 1500 ? 'text-yellow-600' : 'text-red-600'
                  }`}>{selected.metrics.response_time}</div>
                </div>
              </div>

              {/* Details */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 sm:mb-6">
                <div className="bg-gray-50 px-3 sm:px-4 py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Details</span>
                </div>
                <div className="p-3 sm:p-4">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div>
                      <dt className="text-gray-500">Execution ID</dt>
                      <dd className="font-mono text-gray-900 mt-0.5 text-xs break-all">{selected.id}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Timestamp</dt>
                      <dd className="text-gray-900 mt-0.5 text-xs sm:text-sm">{new Date(selected.timestamp).toLocaleString()}</dd>
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

              {/* AI Reasoning */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 sm:mb-6">
                <div className="bg-gray-50 px-3 sm:px-4 py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-700">AI Reasoning</span>
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{selected.ai_reasoning}</p>
                </div>
              </div>

              {/* Logs */}
              {selected.logs && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Logs</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(selected.logs || '')}
                      className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="p-3 sm:p-4 text-xs font-mono bg-gray-900 text-gray-300 overflow-x-auto max-h-48 sm:max-h-64">{selected.logs}</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">No deployment selected</h3>
                <p className="text-xs text-gray-500 mb-3">Select from the list or trigger a new deployment</p>
                <button
                  onClick={() => setShowSidebar(true)}
                  className="lg:hidden px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  View Deployments
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Clear History Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear History?</h3>
            <p className="text-sm text-gray-500 mb-4">This will remove all deployments from the view. This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={clearHistory}
                className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
