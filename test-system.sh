#!/bin/bash

echo "🧪 Testing AI DevOps Commander - End to End"
echo "============================================"
echo ""

# Check services
echo "1️⃣ Checking services..."
if docker ps | grep -q "kestra-devops-commander"; then
    echo "✅ Kestra running"
else
    echo "❌ Kestra not running - start with: cd kestra && docker-compose up -d"
    exit 1
fi

if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Dashboard running"
else
    echo "⚠️  Dashboard not running - start with: cd dashboard && npm run dev"
fi

echo ""
echo "2️⃣ Testing Kestra API access..."
curl -s -u techwithrishijat@gmail.com:Rishijat2026 http://localhost:8080/api/v1/flows > /tmp/kestra-flows.json 2>&1

if grep -q "results" /tmp/kestra-flows.json 2>/dev/null; then
    FLOW_COUNT=$(cat /tmp/kestra-flows.json | python3 -c "import sys,json; print(len(json.load(sys.stdin).get('results',[])))" 2>/dev/null || echo "0")
    echo "✅ Kestra API accessible - Found $FLOW_COUNT flows"
    
    if [ "$FLOW_COUNT" -eq "0" ]; then
        echo "⚠️  No flows found! Please create the workflow in Kestra UI:"
        echo "   1. Open http://localhost:8080"
        echo "   2. Login with: techwithrishijat@gmail.com / Rishijat2026"
        echo "   3. Go to Flows → Create Flow"
        echo "   4. Copy content from kestra/workflows/devops-loop.yml"
        echo "   5. Save it"
    else
        echo "✅ Workflow exists! Ready to test"
    fi
else
    echo "⚠️  Kestra API not accessible - check credentials in Kestra UI"
fi

echo ""
echo "3️⃣ Ready to test deployment trigger"
echo "Run this command to trigger a BAD deployment:"
echo ""
echo "curl -X POST -u techwithrishijat@gmail.com:Rishijat2026 \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"deploymentId\":\"test-bad-001\",\"service\":\"payment-service\",\"environment\":\"production\",\"version\":\"v1.0.0\",\"description\":\"Test BAD deployment\"}' \\"
echo "  http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-loop/deployment-webhook"
echo ""
echo "Or click the 'Trigger BAD Deployment' button at http://localhost:3000"
echo ""
echo "📊 Check results:"
echo "  - Kestra UI: http://localhost:8080/ui/executions"
echo "  - Dashboard: http://localhost:3000"
echo ""
