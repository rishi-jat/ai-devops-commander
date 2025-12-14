import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const deploymentsPath = path.join(process.cwd(), '..', 'mock-data', 'deployments.json')
    const data = fs.readFileSync(deploymentsPath, 'utf-8')
    const deployments = JSON.parse(data)
    
    return NextResponse.json(deployments)
  } catch (error) {
    console.error('Error reading deployments:', error)
    return NextResponse.json(
      { error: 'Failed to load deployments' },
      { status: 500 }
    )
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
