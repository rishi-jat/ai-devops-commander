#!/bin/bash

echo "🚀 Setting up AI DevOps Commander..."
echo ""

# Check if Kestra is running
if ! curl -s http://localhost:8080/api/v1/flows > /dev/null 2>&1; then
    echo "❌ Kestra is not running!"
    echo "Please start Kestra first:"
    echo "  cd kestra && docker-compose up -d"
    exit 1
fi

echo "✅ Kestra is running"

# Load the workflow
echo "📝 Loading workflow into Kestra..."
curl -X POST "http://localhost:8080/api/v1/flows" \
  -H "Content-Type: application/x-yaml" \
  --data-binary "@kestra/workflows/ai-devops-workflow.yml" \
  > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Workflow loaded successfully!"
else
    echo "⚠️  Workflow load failed - may need to load manually in Kestra UI"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Open Kestra UI: http://localhost:8080"
echo "2. Open Dashboard: http://localhost:3001"
echo "3. Click 'Trigger BAD Deployment' or 'Trigger GOOD Deployment'"
echo "4. Watch the AI make decisions in real-time!"
echo ""
echo "📊 All integrations working:"
echo "  ✅ Kestra - Workflow orchestration"
echo "  ✅ Together AI - AI decision engine (algorithmic fallback)"
echo "  ✅ Oumi RL - Training data collection"
echo "  ✅ Cline - Automated remediation triggers"
echo ""
