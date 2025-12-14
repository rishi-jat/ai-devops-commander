#!/bin/bash

# AI DevOps Commander - Complete Setup Script
# Runs the entire system locally

set -e

echo "🤖 AI DevOps Commander - Automated Setup"
echo "=========================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.10+ first."
    exit 1
fi

echo "✅ All prerequisites found"
echo ""

# Start Kestra
echo "🚀 Starting Kestra..."
cd kestra
docker-compose up -d

echo "⏳ Waiting for Kestra to start (30 seconds)..."
sleep 30

# Check Kestra health
if curl -s http://localhost:8080/health | grep -q "UP"; then
    echo "✅ Kestra is running"
else
    echo "⚠️  Kestra may not be ready yet. Check docker-compose logs if issues occur."
fi

cd ..
echo ""

# Install dashboard dependencies
echo "📦 Installing dashboard dependencies..."
cd dashboard

if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo ""
echo "1. Start the dashboard:"
echo "   cd dashboard"
echo "   npm run dev"
echo ""
echo "2. Open browser tabs:"
echo "   - Dashboard: http://localhost:3000"
echo "   - Kestra:    http://localhost:8080"
echo ""
echo "3. Trigger a test deployment:"
echo "   curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-autonomous-loop/devops-deploy-webhook \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"deployment_id\": \"deploy-001\", \"service_name\": \"payment-service\", \"version\": \"v1.2.3\"}'"
echo ""
echo "4. Watch the autonomous loop in action!"
echo ""
echo "📚 For full demo guide, see: demo/DEMO_SCRIPT.md"
echo ""
echo "🏆 Good luck with the hackathon!"
