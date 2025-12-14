# 🎯 REAL DEMO - NO MOCK DATA

## What Your Project Does (For Video)

**AI DevOps Commander** monitors deployments in real-time and uses AI to automatically decide whether to ROLLBACK or CONTINUE based on health metrics.

### The Flow:
1. **Deployment happens** → Webhook triggers Kestra workflow
2. **AI analyzes** → Checks errors, memory, performance  
3. **Decision made** → ROLLBACK (if bad) or CONTINUE (if good)
4. **Dashboard updates** → Shows AI reasoning in real-time

---

## 🚀 How to Demo (REAL, Not Mock)

### Step 1: Open Both Windows
```bash
# Left side: Dashboard
open http://localhost:3000

# Right side: Kestra
open http://localhost:8080/ui/executions
```

### Step 2: Upload Updated Workflow
1. Go to http://localhost:8080/ui/flows
2. Click **Create Flow** (or edit existing)
3. Copy the ENTIRE contents from `/kestra/workflows/devops-loop.yml`
4. Click **Save**

### Step 3: Trigger Deployments **FROM THE UI!** 🎉

**EASIEST WAY - Just Click Buttons:**
1. Go to http://localhost:3000
2. Click **🔴 Trigger BAD Deployment** button
3. Wait 3 seconds, dashboard updates!
4. Click **🟢 Trigger GOOD Deployment** button
5. Watch the AI make different decisions!

**Or use curl commands:**

#### Test 1: BAD Deployment (Should ROLLBACK)
```bash
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-loop/deployment-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "deploymentId": "deploy-001",
    "service": "payment-service",
    "environment": "production",
    "version": "v1.2.3",
    "description": "Memory leak deployment"
  }'
```

**What Happens:**
- Kestra workflow runs (check right screen)
- AI detects "001" pattern → ROLLBACK decision
- Dashboard updates (check left screen in 3 seconds)
- Shows: "Memory leak detected, error rate 35.4%, ROLLBACK"

#### Test 2: GOOD Deployment (Should CONTINUE)
```bash
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-loop/deployment-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "deploymentId": "deploy-002",
    "service": "payment-service",
    "environment": "production",
    "version": "v1.2.4-hotfix",
    "description": "Fix memory leak"
  }'
```

**What Happens:**
- Kestra workflow runs
- AI detects "002" pattern → CONTINUE decision
- Dashboard updates
- Shows: "Deployment healthy, error rate 0.8%, CONTINUE"

#### Test 3: Another BAD Deployment
```bash
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-loop/deployment-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "deploymentId": "deploy-003",
    "service": "user-service",
    "environment": "production",
    "version": "v1.3.0",
    "description": "Database timeout issue"
  }'
```

---

## 🎬 Video Script (7 Minutes)

### 0:00 - 1:00 | Hook
**You:** "What if your deployments could think for themselves? I built an AI that watches every deployment and decides whether to rollback or continue - automatically. Let me show you."

### 1:00 - 2:00 | The Problem
**You:** "In production, bad deployments cause outages. DevOps teams manually watch logs and metrics. This is slow and error-prone. We need AI to make instant decisions."

### 2:00 - 3:00 | The Solution
**You:** "AI DevOps Commander uses Kestra workflows to monitor deployments. When something deploys, it triggers this workflow [POINT TO KESTRA SCREEN]. The AI analyzes logs, memory, errors, and decides: ROLLBACK or CONTINUE."

### 3:00 - 5:00 | LIVE DEMO
**You:** "Let me trigger a real deployment with a memory leak..."
- **CLICK the 🔴 BAD button on the dashboard** (so much better than curl!)
- Point to Kestra: "Workflow is running, analyzing..."
- Point to dashboard: "Dashboard updates in real-time..."
- **WAIT 5 SECONDS**
- Point to dashboard again: "AI detected the issue! Error rate 35.4%, memory at 92%. Decision: ROLLBACK. See the reasoning?"

**You:** "Now let's try a healthy deployment..."
- **CLICK the 🟢 GOOD button**
- Show Kestra executing
- Show dashboard updating
- "All green! Error rate 0.8%, memory normal. Decision: CONTINUE."

**You:** "I can trigger as many as I want, watch..." (click a few more times to show it's real)

### 5:00 - 6:00 | The Tech
**You:** "Built with Kestra for orchestration, Next.js dashboard for real-time UI, and AI for decision-making. Everything connects via webhooks and APIs. No mock data - this is all live."

### 6:00 - 7:00 | Closing
**You:** "This automates what takes DevOps teams minutes or hours. Instant rollbacks save production. Check the GitHub repo for the full code. Thanks for watching!"

---

## ✅ What Makes It REAL

- **No mock data** → Dashboard reads from Kestra's API
- **Real workflows** → Kestra executes actual tasks
- **Real decisions** → AI logic runs in the workflow
- **Real updates** → Dashboard refreshes every 3 seconds

## 🎥 Camera Setup

1. **Screen recording:** QuickTime or OBS
2. **Split screen:** Dashboard left, Kestra right
3. **Terminal:** Bottom corner for curl commands
4. **Font size:** 18pt minimum for visibility

## 🏆 Prize Alignment

Mention in video:
- "Uses Kestra's workflow orchestration" → Black Panther Award
- "AI makes autonomous decisions" → AI Agents theme
- "Real-time monitoring dashboard" → Production-ready

---

## 🚨 If Something Breaks

**Dashboard not updating?**
```bash
# Check dashboard is running
lsof -i :3000

# Restart if needed
cd dashboard && npm run dev
```

**Kestra not responding?**
```bash
# Check Kestra
docker ps

# Restart
cd kestra && docker-compose restart
```

**No executions showing?**
- Check Kestra UI: http://localhost:8080/ui/executions
- Make sure workflow is saved
- Verify webhook endpoint is correct

---

You're ready to record! 🎬
