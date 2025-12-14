# Architecture

**How the whole thing actually works - explained like you're another developer.**

---

## The big picture

This system has one job: watch deployments and decide if they should rollback or not. Fast. Automatically.

```
Deployment happens → Metrics collected → AI analyzes → Decision made → Action taken → Learn from it
```

Everything runs in a loop. Each deployment teaches the system to make better decisions next time.

## Why this architecture?

I needed:
- **Fast feedback** - Can't wait 20 minutes to decide on a rollback
- **Real decisions** - Not just alerts, actual actions
- **Learning** - Should get better over time, not stay stupid
- **Visibility** - Engineers need to see what happened and why

So I built it around:
- Kestra for orchestration (runs the whole loop)
- Together AI for smart analysis (real LLM reasoning)
- Oumi for learning (gets smarter with each deployment)
- Cline for automation (generates fixes automatically)
- Next.js for dashboard (see everything in real-time)

## Component breakdown

### 1. Kestra (The Brain)

**What it does:** Runs the entire deployment monitoring workflow.

**Why Kestra:** 
- Built for exactly this - orchestrating complex workflows
- Has webhooks so we can trigger on deployments
- Can run Python/Bash/whatever we need
- Stores all execution history

**The workflow (`devops-loop.yml`):**

```yaml
id: devops-loop
namespace: ai.devops.commander

triggers:
  - id: webhook
    type: io.kestra.core.models.triggers.types.Webhook

tasks:
  1. generate_metrics    # Create random realistic metrics
  2. ai_decision         # AI analyzes and decides
  3. collect_training    # Save data for Oumi
  4. cline_automation    # Trigger fixes if rollback
```

Each deployment triggers this webhook → workflow runs → decision made in ~10 seconds.

### 2. Together AI (The Intelligence)

**What it does:** Makes the actual ROLLBACK/CONTINUE decision.

**Why Together AI:**
- Fast API response (~1-2 seconds)
- Llama 3.1 is good enough for this task
- Cheap compared to GPT-4
- Has fallback if API is down

**The decision logic:**

```python
# In ai_decision task

# Option 1: Use LLM if API key exists
response = openai.chat.completions.create(
    model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    messages=[{
        "role": "system",
        "content": "You are a DevOps AI assistant..."
    }, {
        "role": "user", 
        "content": f"Deployment: {deployment_id}\nMetrics: {metrics}"
    }]
)

# Option 2: Fallback to algorithmic if no API
health_score = 100
health_score -= error_rate * 2
health_score -= (memory - 70) * 0.5
health_score -= (response_time - 500) * 0.01

decision = "ROLLBACK" if health_score < 50 else "CONTINUE"
```

Either way, you get a decision. The LLM adds reasoning though.

### 3. Oumi (The Learner)

**What it does:** Collects training data to make the system smarter over time.

**Why Oumi:**
- Built for RL training data collection
- Each deployment is a training sample
- State → Action → Reward loop

**Training data structure:**

```json
{
  "state": {
    "error_rate": 12.5,
    "memory_usage": 78.2,
    "response_time": 450,
    "deployment_id": "dep-123"
  },
  "action": "CONTINUE",
  "confidence": 0.87,
  "reward": null  // Set later based on actual outcome
}
```

In production, you'd:
1. Deploy → collect state/action
2. Wait 30 minutes → see if decision was right
3. Set reward: +1 if correct, -1 if wrong
4. Train model on all samples
5. Deploy new model → repeat

Right now it just collects data. But the pipeline is ready.

### 4. Cline (The Fixer)

**What it does:** Generates automated fixes when rollbacks happen.

**Why Cline:**
- Perfect for autonomous code generation
- Can analyze error types and write fixes
- Would create PRs in production

**How it works:**

```bash
# In cline_automation task

ERROR_TYPE=$(detect_from_ai_reasoning)

case $ERROR_TYPE in
  "memory leak")
    ./auto-fix-memory-leak.sh
    # Would create PR with:
    # - Add connection pooling
    # - Fix unclosed resources
    # - Add memory profiling
    ;;
  "database timeout")
    ./auto-fix-database-timeout.sh
    # Would create PR with:
    # - Add query indexes
    # - Optimize slow queries
    # - Add connection pooling
    ;;
  "performance")
    ./auto-fix-performance.sh
    # Would create PR with:
    # - Add caching layer
    # - Optimize hot paths
    # - Add CDN for static assets
    ;;
esac
```

Right now it logs what it would do. In production, it would:
1. Generate fix code
2. Create PR
3. Request review
4. Auto-merge if tests pass

### 5. Next.js Dashboard (The Eyes)

**What it does:** Shows everything in real-time.

**Why Next.js:**
- Server-side API calls to Kestra
- Real-time updates every 3 seconds
- Easy to deploy on Vercel
- Looks good with Tailwind

**How it works:**

```typescript
// dashboard/app/api/deployments/route.ts

export async function GET() {
  // Fetch from Kestra API
  const executions = await fetch(
    `${KESTRA_API_URL}/executions?namespace=ai.devops.commander&flowId=devops-loop`
  )
  
  // Parse outputs
  const deployments = executions.map(exec => ({
    id: exec.id,
    decision: exec.outputs.ai_decision,
    reasoning: exec.outputs.ai_reasoning,
    confidence: exec.outputs.ai_confidence,
    metrics: {
      errorRate: exec.outputs.error_rate,
      memory: exec.outputs.memory_usage,
      responseTime: exec.outputs.response_time
    }
  }))
  
  return Response.json(deployments)
}
```

Frontend polls this every 3 seconds → dashboard updates automatically.

## Data flow

Let me walk you through what happens when you trigger a deployment:

### 1. Trigger (t=0s)

```bash
# User clicks "Trigger BAD Deployment" button
POST https://avenger-assemble.vercel.app/api/trigger

# Or direct webhook
POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-loop/webhook
```

### 2. Metrics Generation (t=0.5s)

```bash
# Kestra task: generate_metrics
ERROR_RATE=25.3
MEMORY_USAGE=88.7
RESPONSE_TIME=1850
CPU_USAGE=72.4

# In production, these would come from:
# - Prometheus
# - Datadog
# - CloudWatch
# - Whatever you use
```

### 3. AI Analysis (t=2s)

```python
# Kestra task: ai_decision

# Call Together AI
response = llm.analyze(metrics)

# Response:
{
  "decision": "ROLLBACK",
  "confidence": 0.92,
  "reasoning": "Error rate 25.3% is critical (threshold: 15%). Memory 88.7% indicates leak. Response time degraded.",
  "health_score": 31
}
```

### 4. Training Data Collection (t=3s)

```python
# Kestra task: collect_training_data

training_sample = {
  "timestamp": "2024-12-14T10:30:45Z",
  "state": metrics,
  "action": "ROLLBACK",
  "confidence": 0.92,
  "reward": null  # Set later
}

# Save to oumi/training-data/sample-{timestamp}.json
```

### 5. Automation Trigger (t=4s)

```bash
# Kestra task: cline_automation (only if ROLLBACK)

# Analyze error from AI reasoning
ERROR_TYPE="memory leak"

# Run fix script
./cline-automation/auto-fix-memory-leak.sh

# Logs:
# ✓ Detected memory leak issue
# ✓ Would create PR with fixes:
#   - Add connection pooling
#   - Fix resource cleanup
#   - Add memory monitoring
```

### 6. Dashboard Update (t=5s)

```typescript
// Frontend polls API
const response = await fetch('/api/deployments')

// Shows:
// ⚠️ ROLLBACK DECISION
// Confidence: 92%
// Reasoning: Error rate 25.3% is critical...
// Health: 31/100
// Metrics: [chart showing all metrics]
```

Total time: **~5 seconds** from trigger to decision shown.

## Architecture decisions

### Why not just use one tool?

**Could I do this with just GitHub Actions?**
No. GitHub Actions is for CI/CD, not real-time monitoring. Kestra is built for orchestration.

**Could I do this with just a Python script?**
Sure, but then I'd need to build:
- Webhook server
- Execution history
- Retry logic
- Monitoring
- UI

Kestra gives me all that.

**Could I do this without AI?**
Yeah, the algorithmic fallback works fine. But the LLM adds:
- Better reasoning
- Natural language explanations
- Adaptability to new error types

Worth the 1-2 second latency.

### Why random metrics instead of real ones?

**For the demo:** Easier to show all scenarios (good/bad deployments) without needing real infrastructure.

**For production:** You'd replace the `generate_metrics` task with:

```yaml
- id: fetch_metrics
  type: io.kestra.plugin.scripts.python.Script
  script: |
    import requests
    
    # Prometheus
    error_rate = prometheus_query('rate(http_errors[5m])')
    
    # Datadog
    memory_usage = datadog_query('avg:system.mem.pct_usable')
    
    # Your monitoring
    response_time = your_apm.get_p95_latency()
```

The rest stays the same. That's the beauty of it.

### Why Together AI instead of OpenAI?

**Speed:** Llama 3.1 on Together AI is faster than GPT-4.
**Cost:** Way cheaper for this use case.
**Fallback:** I built algorithmic fallback anyway, so if API is down, still works.

Could swap to OpenAI by changing 3 lines:

```python
# From:
base_url="https://api.together.xyz/v1"
model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"

# To:
base_url="https://api.openai.com/v1"
model="gpt-4"
```

## Deployment architecture

### Local development

```
┌─────────────────┐
│   Docker        │
│  ┌──────────┐   │
│  │ Kestra   │   │  Port 8080
│  └──────────┘   │
│  ┌──────────┐   │
│  │PostgreSQL│   │  Port 5432
│  └──────────┘   │
└─────────────────┘

┌─────────────────┐
│   Node.js       │
│  ┌──────────┐   │
│  │Dashboard │   │  Port 3000
│  └──────────┘   │
└─────────────────┘
```

Both running locally. Dashboard talks to Kestra API.

### Production (Vercel)

```
┌──────────────────────┐
│  Vercel              │
│  ┌────────────────┐  │
│  │  Dashboard     │  │  https://avenger-assemble.vercel.app
│  │  (Next.js)     │  │
│  └────────────────┘  │
└──────────────────────┘
         │
         ↓
    [Kestra API]
         │
         ↓
┌──────────────────────┐
│  Cloud (wherever)    │
│  ┌────────────────┐  │
│  │  Kestra        │  │
│  │  + PostgreSQL  │  │
│  └────────────────┘  │
└──────────────────────┘
```

Dashboard is static Next.js on Vercel. Kestra runs wherever (cloud, on-prem, doesn't matter).

## What I'd change for production

### 1. Real monitoring integration

```yaml
- id: fetch_real_metrics
  type: io.kestra.plugin.scripts.python.Script
  script: |
    from prometheus_api_client import PrometheusConnect
    
    prom = PrometheusConnect(url="https://prometheus.your-company.com")
    
    # Real metrics
    error_rate = prom.custom_query('rate(http_requests_total{status=~"5.."}[5m])')
    memory = prom.custom_query('node_memory_MemAvailable_bytes')
    latency = prom.custom_query('histogram_quantile(0.95, http_request_duration_seconds)')
```

### 2. Actual rollback execution

```yaml
- id: execute_rollback
  type: io.kestra.plugin.scripts.shell.Commands
  commands:
    - kubectl rollout undo deployment/{{ deployment_name }} -n {{ namespace }}
    - kubectl rollout status deployment/{{ deployment_name }} -n {{ namespace }}
```

### 3. GitHub integration for Cline

```python
# In cline automation
from github import Github

g = Github(os.getenv('GITHUB_TOKEN'))
repo = g.get_repo('your-org/your-repo')

# Create PR with fixes
repo.create_pull(
    title="[Auto-fix] Memory leak in auth service",
    body=fix_description,
    head="auto-fix/memory-leak-1234",
    base="main"
)
```

### 4. Oumi model training pipeline

```yaml
- id: train_oumi_model
  type: io.kestra.plugin.scripts.python.Script
  schedule: "0 0 * * *"  # Daily
  script: |
    import oumi
    
    # Load training data
    samples = load_all_training_samples()
    
    # Train model
    model = oumi.train(samples, policy='rollback-decision')
    
    # Deploy new model
    model.deploy(version='v' + str(int(time.time())))
```

### 5. Better alerting

```yaml
- id: send_alerts
  type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
  url: "{{ secret('SLACK_WEBHOOK') }}"
  payload: |
    {
      "text": "🚨 Rollback executed: {{ deployment_id }}",
      "attachments": [{
        "color": "danger",
        "fields": [
          {"title": "Reasoning", "value": "{{ ai_reasoning }}"},
          {"title": "Confidence", "value": "{{ ai_confidence }}%"}
        ]
      }]
    }
```

## Performance characteristics

**Latency breakdown:**
- Webhook trigger: ~50ms
- Metrics generation: ~500ms (real metrics would be 100-200ms)
- AI decision: ~1-2s (Together AI) or ~50ms (algorithmic)
- Training data save: ~100ms
- Cline automation: ~500ms (log only, real PR would be 2-3s)
- **Total: ~3-5 seconds**

**Scalability:**
- Kestra can handle thousands of workflows
- PostgreSQL stores all execution history
- Dashboard is stateless, scales with Vercel
- Together AI has rate limits (check pricing)

**Reliability:**
- If Together AI is down → algorithmic fallback
- If Kestra is down → no deployments monitored (need HA setup)
- If dashboard is down → Kestra still works, just can't see UI

## Security considerations

**API keys:**
- Together AI key in environment variables
- Never commit to git
- Rotate regularly

**Kestra webhooks:**
- Add authentication in production
- Use HMAC signatures
- Rate limit

**Dashboard:**
- Read-only by default
- No deployment triggers in production UI (use internal tools)
- Add auth if needed (Vercel has options)

## Testing strategy

**Unit tests:**
- AI decision logic (test thresholds)
- Metric parsing
- Health score calculation

**Integration tests:**
- Full workflow execution
- API integration (Together AI)
- Database writes (Oumi data)

**E2E tests:**
- Trigger webhook → verify decision
- Bad metrics → verify ROLLBACK
- Good metrics → verify CONTINUE

**Load tests:**
- 100 concurrent deployments
- Verify Kestra doesn't fall over
- Check DB performance

## Monitoring the monitor

**How do you monitor the monitoring system?**

Good question. I'd add:

```yaml
- id: health_check
  type: io.kestra.core.tasks.flows.Dag
  schedule: "*/5 * * * *"  # Every 5 min
  tasks:
    - id: check_kestra
      type: io.kestra.plugin.scripts.shell.Commands
      commands:
        - curl http://localhost:8080/api/v1/health
    
    - id: check_together_ai
      type: io.kestra.plugin.scripts.python.Script
      script: |
        response = openai.chat.completions.create(...)
        assert response.status_code == 200
    
    - id: alert_if_down
      type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
      condition: "{{ task.check_kestra.failed or task.check_together_ai.failed }}"
```

---

## Questions?

This architecture is opinionated but flexible:
- Swap Together AI for OpenAI
- Swap Kestra for Temporal
- Swap Next.js for React
- Add your own monitoring

The core idea stays the same: **automate deployment decisions**.

If you want to discuss architecture choices or improvements, hit me up [@rishixtwt](https://twitter.com/rishixtwt).

---

**Built with real production experience. No enterprise BS.**
