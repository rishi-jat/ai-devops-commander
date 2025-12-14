import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const metricsPath = path.join(process.cwd(), '..', 'mock-data', 'metrics.json')
    const data = fs.readFileSync(metricsPath, 'utf-8')
    const metricsData = JSON.parse(data)
    
    const deployment = metricsData.deployments.find(
      (d: any) => d.deployment_id === params.id
    )
    
    if (!deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(deployment)
  } catch (error) {
    console.error('Error reading metrics:', error)
    return NextResponse.json(
      { error: 'Failed to load metrics' },
      { status: 500 }
    )
  }
}
