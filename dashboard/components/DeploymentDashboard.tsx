'use client'

import { useEffect, useState } from 'react'

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
  commit_message: string
  action_timestamp: string
}

interface DeploymentData {
  deployment_history: Deployment[]
}

export default function DeploymentDashboard() {
  const [data, setData] = useState<Deployment[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [triggering, setTriggering] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/deployments')
        const result = await response.json()
        setData(Array.isArray(result) ? result : result.deployment_history || [])
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch deployments:', error)
        setLoading(false)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 3000) // 3 second refresh for real-time demo
    return () => clearInterval(interval)
  }, [])

  const triggerDeployment = async (scenario: 'bad' | 'good') => {
    setTriggering(true)
    try {
      const deployments = {
        bad: {
          deploymentId: `deploy-${Date.now()}-bad`,
          service: 'payment-service',
          environment: 'production',
          version: 'v1.2.3',
          description: 'Deployment with memory leak (SHOULD ROLLBACK)'
        },
        good: {
          deploymentId: `deploy-${Date.now()}-good`,
          service: 'payment-service',
          environment: 'production',
          version: 'v1.2.4-hotfix',
          description: 'Healthy deployment (SHOULD CONTINUE)'
        }
      }

      const payload = deployments[scenario]
      
      const response = await fetch(
        'http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-loop/deployment-webhook',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      )

      if (response.ok) {
        alert(`✅ ${scenario.toUpperCase()} deployment triggered!\n\nCheck Kestra executions and this dashboard will update in ~3 seconds.`)
      } else {
        alert(`❌ Failed to trigger deployment: ${response.status}`)
      }
    } catch (error) {
      alert(`❌ Error: ${error}`)
    } finally {
      setTriggering(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Connecting to Kestra...</div>
      </div>
    )
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e14] via-[#0f1419] to-[#0a0e14] text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-3xl px-6">
            <div className="text-6xl mb-6">🤖</div>
            <h1 className="text-3xl font-bold mb-4">AI DevOps Commander</h1>
            <p className="text-gray-400 text-lg mb-8">
              Waiting for deployments to monitor...
            </p>
            
            {/* TRIGGER BUTTONS */}
            <div className="mb-8 flex gap-4 justify-center">
              <button
                onClick={() => triggerDeployment('bad')}
                disabled={triggering}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg font-semibold shadow-lg shadow-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {triggering ? '⏳ Triggering...' : '🔴 Trigger BAD Deployment'}
              </button>
              <button
                onClick={() => triggerDeployment('good')}
                disabled={triggering}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-lg font-semibold shadow-lg shadow-green-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {triggering ? '⏳ Triggering...' : '🟢 Trigger GOOD Deployment'}
              </button>
            </div>

            <div className="bg-[#1a1f2e]/50 border border-gray-800 rounded-lg p-6 text-left">
              <p className="text-gray-300 mb-3 font-semibold">What happens when you click:</p>
              <ul className="text-gray-400 text-sm space-y-2 mb-4">
                <li>• <span className="text-red-400 font-semibold">BAD</span> → AI detects issues → Decides <span className="text-red-400">ROLLBACK</span></li>
                <li>• <span className="text-green-400 font-semibold">GOOD</span> → AI sees healthy metrics → Decides <span className="text-green-400">CONTINUE</span></li>
                <li>• Dashboard updates automatically in ~3 seconds</li>
                <li>• Check Kestra executions: <a href="http://localhost:8080/ui/executions" target="_blank" className="text-blue-400 hover:underline">localhost:8080/ui/executions</a></li>
              </ul>
              
              <details className="mt-4">
                <summary className="text-gray-500 text-xs cursor-pointer hover:text-gray-400">Or use curl command...</summary>
                <pre className="bg-black/30 p-4 rounded text-xs text-green-400 overflow-x-auto mt-2">
{`curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-loop/deployment-webhook \\
  -H "Content-Type: application/json" \\
  -d '{
    "deploymentId": "deploy-001",
    "service": "payment-service",
    "environment": "production",
    "version": "v1.0.0"
  }'`}
                </pre>
              </details>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const current = data[selectedIndex]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e14] via-[#0f1419] to-[#0a0e14] text-white">
      {/* Top Bar */}
      <div className="bg-[#1a1f2e]/80 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold">AI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI DevOps Commander</h1>
                <p className="text-xs text-gray-400">Intelligent deployment monitoring & automated response</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => triggerDeployment('bad')}
                disabled={triggering}
                className="px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                🔴 Trigger BAD
              </button>
              <button
                onClick={() => triggerDeployment('good')}
                disabled={triggering}
                className="px-4 py-2 bg-green-600/80 hover:bg-green-600 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                🟢 Trigger GOOD
              </button>
              <div className="flex items-center gap-3 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <span className="text-xs font-medium text-green-400">Live Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Sidebar */}
          <div className="col-span-3">
            <div className="bg-[#1a1f2e]/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-5 shadow-2xl">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Deployments</h3>
              </div>
              <div className="space-y-2">
                {data.map((dep, index) => (
                  <button
                    key={dep.deployment_id || dep.id}
                    onClick={() => setSelectedIndex(index)}
                    className={`w-full text-left px-4 py-3.5 rounded-lg transition-all duration-200 group ${
                      index === selectedIndex
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 shadow-lg shadow-blue-500/10'
                        : 'hover:bg-gray-800/40 border border-transparent hover:border-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <StatusDot status={dep.status} />
                      <span className={`text-sm font-semibold truncate transition-colors ${
                        index === selectedIndex ? 'text-white' : 'text-gray-300 group-hover:text-white'
                      }`}>{dep.service}</span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono ml-4">{dep.version}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9 space-y-6">
            
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 rounded-xl border border-blue-500/30 p-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse"></div>
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      <h2 className="text-3xl font-bold text-white tracking-tight">{current.service}</h2>
                      <StatusBadge status={current.status} />
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-2 bg-gray-900/40 px-3 py-1.5 rounded-lg border border-gray-700/50">
                        <span className="text-gray-400">Version:</span>
                        <span className="font-mono font-semibold text-blue-400">{current.version}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        <span>{new Date(current.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="bg-[#1a1f2e]/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-7 shadow-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">AI Analysis</h3>
              </div>
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-5 mb-6">
                <p className="text-gray-200 leading-relaxed text-base">
                  {current.ai_summary}
                </p>
              </div>
              
              <div className="border-t border-gray-800/50 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">AI Decision</span>
                  <DecisionBadge decision={current.ai_decision} />
                </div>
                <div className="bg-gray-900/40 border border-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {current.ai_reasoning}
                  </p>
                </div>
              </div>
            </div>

            {/* Action & Outcome */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#1a1f2e]/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6 shadow-xl hover:shadow-2xl hover:border-gray-700/50 transition-all duration-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Action Taken</h3>
                </div>
                <p className="text-white text-base leading-relaxed">
                  {current.action_taken}
                </p>
              </div>
              
              <div className="bg-[#1a1f2e]/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6 shadow-xl hover:shadow-2xl hover:border-gray-700/50 transition-all duration-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Outcome</h3>
                </div>
                <p className="text-white text-base leading-relaxed">
                  {current.outcome}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-[#1a1f2e]/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-7 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Event Timeline</h3>
              </div>
              <div className="space-y-5 relative before:absolute before:left-4 before:top-8 before:bottom-8 before:w-px before:bg-gradient-to-b before:from-blue-500/20 before:via-purple-500/20 before:to-transparent">
                <TimelineEvent 
                  time={new Date(current.timestamp).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                  label="Deployment triggered"
                  detail={current.commit_message}
                />
                <TimelineEvent 
                  time={addSeconds(current.timestamp, 45)}
                  label="Logs collected and analyzed"
                />
                <TimelineEvent 
                  time={addSeconds(current.timestamp, 90)}
                  label="AI decision completed"
                  detail={`Result: ${current.ai_decision}`}
                />
                <TimelineEvent 
                  time={new Date(current.action_timestamp).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                  label="Action executed"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'healthy') {
    return (
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/40 shadow-lg shadow-green-500/10">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
        Healthy
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border border-red-500/40 shadow-lg shadow-red-500/10">
      <span className="w-2 h-2 bg-red-400 rounded-full shadow-lg shadow-red-400/50"></span>
      Rolled Back
    </span>
  )
}

function DecisionBadge({ decision }: { decision: string }) {
  if (decision === 'ROLLBACK') {
    return (
      <span className="inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-black bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30 uppercase tracking-wider">
        ⚠ ROLLBACK
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-black bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30 uppercase tracking-wider">
      ✓ CONTINUE
    </span>
  )
}

function StatusDot({ status }: { status: string }) {
  if (status === 'healthy') {
    return <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
  }
  return <div className="w-2 h-2 bg-red-400 rounded-full shadow-lg shadow-red-400/50"></div>
}

function TimelineEvent({ time, label, detail }: { 
  time: string; 
  label: string; 
  detail?: string;
}) {
  return (
    <div className="flex items-start gap-4 relative">
      <div className="flex-shrink-0 relative z-10">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 ring-4 ring-[#1a1f2e]">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>
      <div className="flex-1 pt-1">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-base font-semibold text-white">{label}</span>
          <span className="text-xs text-gray-500 font-mono bg-gray-900/40 px-2 py-0.5 rounded border border-gray-700/50">{time}</span>
        </div>
        {detail && (
          <div className="text-sm text-gray-400 mt-2 bg-gray-900/20 px-3 py-2 rounded-lg border border-gray-800/50">
            {detail}
          </div>
        )}
      </div>
    </div>
  )
}

function addSeconds(timestamp: string, seconds: number): string {
  const date = new Date(timestamp)
  date.setSeconds(date.getSeconds() + seconds)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
}
