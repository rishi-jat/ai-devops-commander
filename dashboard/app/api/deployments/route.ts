import { NextRequest, NextResponse } from 'next/server'

const KESTRA_API = process.env.KESTRA_API_URL || 'http://localhost:8080/api/v1'
const KESTRA_USER = process.env.KESTRA_USER || 'admin@example.com'
const KESTRA_PASS = process.env.KESTRA_PASS || 'Admin123!'

// Demo data for when Kestra is not available (e.g., Vercel deployment)
const DEMO_DATA = [
  {
    id: 'demo-exec-001',
    deployment_id: 'prod-api-v2.1.0',
    service: 'api-gateway',
    version: 'v2.1.0',
    environment: 'production',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    status: 'healthy',
    ai_summary: 'Deployment healthy. All metrics within acceptable ranges.',
    ai_decision: 'CONTINUE',
    ai_confidence: 0.94,
    ai_reasoning: 'Error rate 2.3% is below threshold. Memory usage 54% is optimal. Response time 145ms meets SLA.',
    health_score: 87,
    metrics: { error_rate: '2.3%', memory_usage: '54%', response_time: '145ms' },
    logs: 'INFO: Deployment started\nINFO: Health check passed\nINFO: Metrics collected\nINFO: AI Decision: CONTINUE'
  },
  {
    id: 'demo-exec-002',
    deployment_id: 'prod-payment-v1.8.3',
    service: 'payment-service',
    version: 'v1.8.3',
    environment: 'production',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    status: 'rolled_back',
    ai_summary: 'Critical: High error rate detected. Automatic rollback initiated.',
    ai_decision: 'ROLLBACK',
    ai_confidence: 0.91,
    ai_reasoning: 'Error rate 23.5% exceeds 15% threshold. Memory usage 89% is critical. Immediate rollback required.',
    health_score: 32,
    metrics: { error_rate: '23.5%', memory_usage: '89%', response_time: '3200ms' },
    logs: 'INFO: Deployment started\nWARN: High error rate detected\nERROR: Memory threshold exceeded\nINFO: AI Decision: ROLLBACK\nINFO: Rollback completed'
  },
  {
    id: 'demo-exec-003',
    deployment_id: 'prod-auth-v3.0.1',
    service: 'auth-service',
    version: 'v3.0.1',
    environment: 'production',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    status: 'healthy',
    ai_summary: 'Deployment stable. Performance metrics excellent.',
    ai_decision: 'CONTINUE',
    ai_confidence: 0.97,
    ai_reasoning: 'All metrics nominal. Error rate 0.8%, Memory 42%, Response time 98ms. Excellent deployment.',
    health_score: 95,
    metrics: { error_rate: '0.8%', memory_usage: '42%', response_time: '98ms' },
    logs: 'INFO: Deployment started\nINFO: All checks passed\nINFO: AI Decision: CONTINUE'
  }
]

export async function GET(request: NextRequest) {
  try {
    const auth = Buffer.from(`${KESTRA_USER}:${KESTRA_PASS}`).toString('base64')
    
    // Fetch REAL executions from Kestra
    const response = await fetch(`${KESTRA_API}/executions?namespace=ai.devops.commander&flowId=ai-devops-workflow&size=50`, {
      cache: 'no-store',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      console.log(`Kestra API status: ${response.status}`)
      return NextResponse.json([])
    }
    
    const data = await response.json()
    
    if (!data.results || data.results.length === 0) {
      return NextResponse.json([])
    }
    
    // Process each execution - fetch logs separately (Kestra stores logs in separate endpoint)
    const deployments = await Promise.all(
      data.results.map(async (execution: any) => {
        const inputs = execution.inputs || {}
        const state = execution.state || {}
        
        // Fetch logs for this execution from /api/v1/logs/{executionId}
        let logs = ''
        let result: any = {}
        
        try {
          const logsResponse = await fetch(`${KESTRA_API}/logs/${execution.id}`, {
            cache: 'no-store',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Accept': 'application/json'
            }
          })
          
          if (logsResponse.ok) {
            const logsData = await logsResponse.json()
            
            // Extract all log messages
            const logMessages = logsData
              .filter((l: any) => l.level === 'INFO')
              .map((l: any) => l.message)
            
            logs = logMessages.join('\n')
            
            // Parse the key fields directly from log lines
            for (const line of logMessages) {
              if (line.includes('"ai_decision":')) {
                const match = line.match(/"ai_decision":\s*"([^"]+)"/)
                if (match) result.ai_decision = match[1]
              }
              if (line.includes('"ai_confidence":')) {
                const match = line.match(/"ai_confidence":\s*([\d.]+)/)
                if (match) result.ai_confidence = parseFloat(match[1])
              }
              if (line.includes('"ai_summary":')) {
                const match = line.match(/"ai_summary":\s*"([^"]+)"/)
                if (match) result.ai_summary = match[1]
              }
              if (line.includes('"ai_reasoning":')) {
                const match = line.match(/"ai_reasoning":\s*"([^"]+)"/)
                if (match) result.ai_reasoning = match[1]
              }
              if (line.includes('"health_score":') && !line.includes('state')) {
                const match = line.match(/"health_score":\s*(\d+)/)
                if (match) result.health_score = parseInt(match[1])
              }
              if (line.includes('"error_rate":') && line.includes('%')) {
                const match = line.match(/"error_rate":\s*"([^"]+)"/)
                if (match) result.error_rate = match[1]
              }
              if (line.includes('"memory_usage":') && line.includes('%')) {
                const match = line.match(/"memory_usage":\s*"([^"]+)"/)
                if (match) result.memory_usage = match[1]
              }
              if (line.includes('"response_time":') && line.includes('ms')) {
                const match = line.match(/"response_time":\s*"([^"]+)"/)
                if (match) result.response_time = match[1]
              }
            }
          }
        } catch (e) {
          console.log('Failed to fetch logs:', e)
        }
        
        const aiDecision = result.ai_decision || 'ANALYZING'
        const aiSummary = result.ai_summary || 'AI analysis in progress...'
        const aiReasoning = result.ai_reasoning || 'Waiting for AI decision...'
        const aiConfidence = result.ai_confidence || 0
        const healthScore = result.health_score || 50
        const errorRate = result.error_rate || '0%'
        const memoryUsage = result.memory_usage || '0%'
        const responseTime = result.response_time || '0ms'
        
        let status = 'deploying'
        if (state.current === 'SUCCESS') {
          status = aiDecision === 'ROLLBACK' ? 'rolled_back' : 'healthy'
        } else if (state.current === 'FAILED') {
          status = 'rolled_back'
        } else if (state.current === 'RUNNING') {
          status = 'deploying'
        }
        
        return {
          id: execution.id,
          deployment_id: inputs.deploymentId || execution.id.substring(0, 12),
          service: inputs.service || 'unknown-service',
          version: inputs.version || '1.0.0',
          environment: inputs.environment || 'production',
          timestamp: state.startDate || new Date().toISOString(),
          status,
          ai_summary: aiSummary,
          ai_decision: aiDecision,
          ai_confidence: aiConfidence,
          ai_reasoning: aiReasoning,
          health_score: healthScore,
          metrics: {
            error_rate: errorRate,
            memory_usage: memoryUsage,
            response_time: responseTime
          },
          logs: logs || undefined
        }
      })
    )
    
    return NextResponse.json(deployments)
  } catch (error) {
    console.error('Failed to fetch from Kestra:', error)
    // Return demo data when Kestra is not available
    return NextResponse.json(DEMO_DATA)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Deployment update received:', body)
    
    // In production, this would update the database
    // For demo, we just acknowledge receipt
    
    return NextResponse.json({
      success: true,
      message: 'Deployment status updated',
      data: body
    })
  } catch (error) {
    console.error('Error updating deployment:', error)
    return NextResponse.json(
      { error: 'Failed to update deployment' },
      { status: 500 }
    )
  }
}
