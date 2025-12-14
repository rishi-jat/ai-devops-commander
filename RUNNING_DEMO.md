# 🚀 AI DevOps Commander - LIVE DEMO

## ✅ Services Running

1. **Kestra Orchestration Platform**
   - URL: http://localhost:8080
   - Status: ✅ RUNNING
   - Container: `kestra-devops-commander`

2. **Dashboard UI**
   - URL: http://localhost:3000
   - Status: ✅ RUNNING
   - Framework: Next.js 14

3. **PostgreSQL Database**
   - Internal Port: 5432
   - Status: ✅ RUNNING (healthy)
   - Container: `kestra-postgres`

## 📋 Next Steps to Demo

### 1. Upload Workflow to Kestra
```bash
# The workflow file is at: kestra/workflows/devops-loop.yml
# Upload via Kestra UI:
# 1. Open http://localhost:8080
# 2. Go to "Flows" section
# 3. Click "Create"
# 4. Copy contents from kestra/workflows/devops-loop.yml
# 5. Save the flow
```

### 2. View Dashboard
```bash
# Open browser to:
open http://localhost:3000  
```

### 3. Trigger Test Deployments

**Test Scenario 1: Memory Leak Detection (deploy-001)**
```bash
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-loop/deployment-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "deploymentId": "deploy-001",
    "service": "payment-service",
    "environment": "production",
    "timestamp": "2024-12-14T10:30:00Z"
  }'
```
**Expected**: AI detects memory leak → Decides **ROLLBACK**

**Test Scenario 2: Healthy Deployment (deploy-002)**
```bash
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-loop/deployment-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "deploymentId": "deploy-002",
    "service": "auth-service",
    "environment": "production",
    "timestamp": "2024-12-14T10:35:00Z"
  }'
```
**Expected**: AI detects no issues → Decides **CONTINUE**

**Test Scenario 3: Database Timeout (deploy-003)**
```bash
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-loop/deployment-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "deploymentId": "deploy-003",
    "service": "user-service",
    "environment": "production",
    "timestamp": "2024-12-14T10:40:00Z"
  }'
```
**Expected**: AI detects DB timeout → Decides **ROLLBACK**

### 4. Watch AI in Action

**In Kestra (http://localhost:8080):**
- Navigate to "Executions"
- Watch real-time workflow execution
- See AI Agent summarization task
- View binary decision (ROLLBACK/CONTINUE)

**In Dashboard (http://localhost:3000):**
- Real-time deployment history
- Error rate charts
- Decision timeline
- Health metrics

### 5. Demo Autonomous Fix (Cline)
```bash
cd /Users/rishijat/Desktop/ai-devops-commander
./cline-scripts/auto-fix-memory-leak.sh deploy-001 payment-service
```
Shows autonomous code fix generation for detected issues.
