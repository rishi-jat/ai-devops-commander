import { NextRequest, NextResponse } from 'next/server'

const KESTRA_API = process.env.KESTRA_API_URL || 'http://localhost:8080/api/v1'
const KESTRA_USER = process.env.KESTRA_USER || 'admin@example.com'
const KESTRA_PASS = process.env.KESTRA_PASS || 'Admin123!'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scenario, inputs } = body
    
    const auth = Buffer.from(`${KESTRA_USER}:${KESTRA_PASS}`).toString('base64')
    
    // Determine inputs based on scenario
    let executionInputs
    if (scenario === 'custom' && inputs) {
      executionInputs = inputs
    } else if (scenario === 'bad') {
      executionInputs = {
        deploymentId: `deploy-${Date.now()}-bad`,
        service: 'payment-service',
        environment: 'production',
        version: 'v1.2.3-buggy'
      }
    } else {
      executionInputs = {
        deploymentId: `deploy-${Date.now()}-good`,
        service: 'payment-service',
        environment: 'production',
        version: 'v1.2.4-stable'
      }
    }
    
    // Kestra requires multipart/form-data for executions
    const formData = new FormData()
    formData.append('deploymentId', executionInputs.deploymentId)
    formData.append('service', executionInputs.service)
    formData.append('environment', executionInputs.environment)
    formData.append('version', executionInputs.version)
    
    const response = await fetch(
      `${KESTRA_API}/executions/ai.devops.commander/ai-devops-workflow`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`
          // Don't set Content-Type - let fetch set it for multipart/form-data
        },
        body: formData
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Kestra execution failed:', error)
      return NextResponse.json({ 
        success: false, 
        error: `Kestra API returned ${response.status}. Make sure workflow is loaded.` 
      }, { status: 500 })
    }

    const execution = await response.json()
    
    return NextResponse.json({ 
      success: true, 
      executionId: execution.id,
      message: `Triggered ${scenario.toUpperCase()} deployment scenario`
    })

  } catch (error: any) {
    console.error('Trigger error:', error)
    // Return error when Kestra is not available
    return NextResponse.json({ 
      success: false, 
      error: 'Kestra is not running. Start Kestra with: cd kestra && docker-compose up -d'
    }, { status: 503 })
  }
}
