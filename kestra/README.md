# Kestra Workflows for AI DevOps Commander

This directory contains the Kestra orchestration workflows that power the autonomous DevOps loop.

## 🎯 Black Panther Award Alignment

This workflow fulfills the **Black Panther - Wakanda Data Award ($4,000)** requirements:

✅ Uses Kestra's built-in AI Agent to summarize data from logs and metrics  
✅ Enables the agent to make decisions based on summarized data  
✅ Demonstrates autonomous decision-making (rollback vs continue)

## 🏗️ Architecture

```
Deployment Event
       ↓
[Collect Logs] → Parse & structure log data
       ↓
[Collect Metrics] → Parse performance metrics
       ↓
[AI Summarization] → Kestra AI Agent analyzes health
       ↓
[Make Decision] → Binary: ROLLBACK or CONTINUE
       ↓
[Execute Action] → Automatic action taken
       ↓
[Record Outcome] → Data sent to RL training
       ↓
[Notify Dashboard] → Update Vercel UI
```

## 📁 Files

- **devops-loop.yml** - Main autonomous monitoring workflow
- **docker-compose.yml** - Kestra local deployment setup

## 🚀 Quick Start

### 1. Start Kestra

```bash
cd kestra
docker-compose up -d
```

Wait ~30 seconds for Kestra to start.

### 2. Access Kestra UI

Open: http://localhost:8080

### 3. Import Workflow

```bash
# Copy workflow to Kestra
docker cp workflows/devops-loop.yml kestra-devops-commander:/app/flows/
```

Or use the UI: Flows → Create Flow → Paste content from `devops-loop.yml`

### 4. Test the Workflow

**Trigger via Webhook:**
```bash
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-autonomous-loop/devops-deploy-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "deployment_id": "deploy-001",
    "service_name": "payment-service",
    "version": "v1.2.3"
  }'
```

**Or trigger manually in UI:**
1. Go to Flows → ai.devops.commander → devops-autonomous-loop
2. Click "Execute"
3. Set inputs:
   - deployment_id: `deploy-001`
   - service_name: `payment-service`
   - version: `v1.2.3`

### 5. View Results

Check execution logs in Kestra UI to see:
- Data collection
- AI summarization
- Decision making
- Action execution

## 📊 Demo Scenarios

### Scenario 1: Memory Leak Detection (Unhealthy)
```bash
# Triggers rollback decision
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-autonomous-loop/devops-deploy-webhook \
  -H "Content-Type: application/json" \
  -d '{"deployment_id": "deploy-001", "service_name": "payment-service", "version": "v1.2.3"}'
```

**Expected:** AI detects 35% error rate + 92% memory → ROLLBACK

### Scenario 2: Successful Deployment (Healthy)
```bash
# Triggers continue decision
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-autonomous-loop/devops-deploy-webhook \
  -H "Content-Type: application/json" \
  -d '{"deployment_id": "deploy-002", "service_name": "payment-service", "version": "v1.2.4-hotfix"}'
```

**Expected:** AI sees 0.8% error rate + stable metrics → CONTINUE

### Scenario 3: Database Issues (Unhealthy)
```bash
# Triggers rollback decision
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-autonomous-loop/devops-deploy-webhook \
  -H "Content-Type: application/json" \
  -d '{"deployment_id": "deploy-003", "service_name": "user-service", "version": "v1.3.0"}'
```

**Expected:** AI detects 45% error rate + DB timeouts → ROLLBACK

## 🎓 Key Workflow Tasks

### Task: `ai_summarize`
**The AI Agent core - Prize requirement fulfillment**

This task:
1. Receives structured deployment data
2. Analyzes logs, metrics, and anomalies
3. Produces actionable summary with confidence score
4. Makes binary decision: ROLLBACK or CONTINUE

This directly addresses: *"Use Kestra's built-in AI Agent to summarise data from other systems and make decisions based on the summarised data"*

### Task: `make_decision`
**Decision execution layer**

Switch-based routing:
- If ROLLBACK → Execute rollback action
- If CONTINUE → Continue monitoring

### Task: `record_outcome`
**Learning loop integration**

Records decision and outcome for Oumi RL training:
- What was decided
- Why (confidence, reasoning)
- What happened (success/failure)

## 🔧 Configuration

### Environment Variables

Set in `docker-compose.yml`:
- `TOGETHER_API_KEY` - For AI inference (optional for demo)
- `DASHBOARD_WEBHOOK_URL` - Vercel dashboard URL

### Workflow Variables

Set in `devops-loop.yml`:
- `mock_api_url` - Mock data API endpoint
- `dashboard_webhook_url` - Dashboard notification endpoint

## 📈 Monitoring

View workflow executions:
1. Open Kestra UI: http://localhost:8080
2. Go to Executions
3. Filter by namespace: `ai.devops.commander`

Each execution shows:
- Input parameters
- Task outputs
- AI summaries
- Decision reasoning
- Action results

## 🛑 Troubleshooting

**Kestra won't start:**
```bash
docker-compose down -v
docker-compose up -d
docker-compose logs -f
```

**Workflow not found:**
```bash
# Re-import workflow
docker cp workflows/devops-loop.yml kestra-devops-commander:/app/flows/
docker-compose restart kestra
```

**Execution fails:**
- Check Kestra logs: `docker-compose logs kestra`
- Verify mock data exists: `ls ../mock-data/`
- Ensure all required inputs provided

## 🎯 Judge Evaluation Points

When demonstrating to judges, highlight:

1. **AI Summarization** - Show `ai_summarize` task output with reasoning
2. **Decision Making** - Explain binary decision logic with confidence
3. **Autonomous Action** - Show automatic rollback execution
4. **Data Integration** - Multiple data sources (logs + metrics) combined
5. **Learning Loop** - Outcome recording for future improvement

## 📚 Resources

- [Kestra Documentation](https://kestra.io/docs)
- [Kestra AI Agent Guide](https://kestra.io/docs/ai)
- [Workflow YAML Reference](https://kestra.io/docs/workflow-components)

---

**Status:** Ready for demo ✅  
**Prize Target:** Black Panther - Wakanda Data Award ($4,000)  
**Next Step:** Build Vercel dashboard to visualize decisions
