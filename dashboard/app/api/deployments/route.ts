import { NextRequest, NextResponse } from 'next/server'

const KESTRA_API = process.env.KESTRA_API_URL || 'http://localhost:8080/api/v1'

export async function GET(request: NextRequest) {
  try {
    // Fetch REAL executions from Kestra (local instance, no auth)
    const response = await fetch(`${KESTRA_API}/executions?size=50`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    // If Kestra not responding or no executions yet, return empty array
    if (!response.ok) {
      console.log(`⚠️  Kestra API status: ${response.status}`)
      return NextResponse.json([])
    }
    
    const data = await response.json()
    
    // If no results yet, return empty
    if (!data.results || data.results.length === 0) {
      return NextResponse.json([])
    }
    
    // Transform Kestra executions into deployment format for dashboard
    const deployments = (data.results || [])
      .filter((execution: any) => {
        // Only show our devops-loop executions
        return execution.namespace === 'ai.devops.commander' && 
               execution.flowId === 'devops-loop'
      })
      .map((execution: any) => {
        const inputs = execution.inputs || {}
        const outputs = execution.outputs || {}
        const state = execution.state || {}
        
        // Parse decision data from outputs
        let aiDecision = 'ANALYZING'
        let aiSummary = 'AI analysis in progress...'
        let aiReasoning = 'Waiting for AI decision...'
        let aiConfidence = 0.0
        let healthScore = 50
        let errorRate = '0%'
        let memoryUsage = '0%'
        let responseTime = '0ms'
        
        // Try to extract from outputs
        if (outputs.ai_decision) {
          aiDecision = outputs.ai_decision
        }
        if (outputs.ai_summary) {
          aiSummary = outputs.ai_summary
        }
        if (outputs.ai_reasoning) {
          aiReasoning = outputs.ai_reasoning
        }
        if (outputs.ai_confidence) {
          aiConfidence = parseFloat(outputs.ai_confidence) || 0.85
        }
        if (outputs.health_score) {
          healthScore = parseInt(outputs.health_score) || 50
        }
        if (outputs.error_rate) {
          errorRate = outputs.error_rate
        }
        if (outputs.memory_usage) {
          memoryUsage = outputs.memory_usage
        }
        if (outputs.response_time) {
          responseTime = outputs.response_time
        }
        
        // Determine status from execution state and AI decision
        let status = 'deploying'
        if (state.current === 'SUCCESS') {
          status = aiDecision === 'ROLLBACK' ? 'rolled_back' : 'healthy'
        } else if (state.current === 'FAILED') {
          status = 'rolled_back'
        } else if (state.current === 'RUNNING') {
          status = 'deploying'
        }
        
        return {
          id: inputs.deploymentId || execution.id,
          deployment_id: inputs.deploymentId || execution.id,
          service: inputs.service || 'unknown-service',
          version: inputs.version || '1.0.0',
          environment: inputs.environment || 'production',
          timestamp: state.startDate || new Date().toISOString(),
          status,
          ai_summary: aiSummary,
          ai_decision: aiDecision,
          ai_confidence: aiConfidence,
          ai_reasoning: aiReasoning,
          action_taken: aiDecision === 'ROLLBACK' ? 'Automatic rollback initiated' : 'Continue monitoring',
          outcome: state.current === 'SUCCESS' 
            ? (aiDecision === 'ROLLBACK' ? 'Service restored successfully' : 'Deployment stable and healthy')
            : state.current === 'RUNNING'
            ? 'Analysis in progress...'
            : 'Execution failed',
          health_score: healthScore,
          metrics: {
            error_rate: errorRate,
            memory_usage: memoryUsage,
            response_time: responseTime
          },
          timeline: [
            {
              time: state.startDate || new Date().toISOString(),
              event: 'Deployment triggered',
              description: inputs.description || 'Deployment initiated'
            },
            state.histories && state.histories.length > 0 && {
              time: state.histories[0].date,
              event: 'Logs collected and analyzed',
              description: 'AI analysis running'
            },
            state.current === 'SUCCESS' && {
              time: state.endDate || new Date().toISOString(),
              event: 'AI decision completed',
              description: `Result: ${aiDecision}`
            },
            state.current === 'SUCCESS' && {
              time: new Date(new Date(state.endDate || Date.now()).getTime() + 120000).toISOString(),
              event: 'Action executed',
              description: aiDecision === 'ROLLBACK' ? 'Rollback completed' : 'Monitoring continues'
            }
          ].filter(Boolean),
          commit_message: inputs.description || 'Deployment triggered',
          action_timestamp: state.endDate || state.startDate || new Date().toISOString()
        }
      })
    
    return NextResponse.json(deployments)
  } catch (error) {
    console.error('❌ Failed to fetch from Kestra:', error)
    // Return empty array instead of error to keep UI working
    return NextResponse.json([])
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
