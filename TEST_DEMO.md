# 🎬 Live Testing for YouTube Demo

## What You'll Show:

1. **Dashboard is running** - Show empty/current state
2. **Trigger deployment** - Use curl to send webhook
3. **Kestra executes workflow** - Show workflow running in Kestra UI
4. **Dashboard updates** - Show new deployment appearing with AI decision

---

## Step-by-Step Demo Script

### 1. Start All Services (Before Recording)

```bash
# Terminal 1: Start Kestra
cd /Users/rishijat/Desktop/ai-devops-commander/kestra
docker compose up -d

# Terminal 2: Start Dashboard  
cd /Users/rishijat/Desktop/ai-devops-commander/dashboard
npm run dev

# Verify both are running:
# - Kestra: http://localhost:8080
# - Dashboard: http://localhost:3000
```

### 2. Open Browser Tabs

- Tab 1: Dashboard → http://localhost:3000
- Tab 2: Kestra UI → http://localhost:8080

### 3. Upload Workflow to Kestra (One-time setup)

1. Open http://localhost:18080
2. Click "Flows" in left sidebar
3. Click "Create" button
4. Copy-paste contents from `kestra/workflows/devops-loop.yml`
5. Click "Save"

You should now see "devops-loop" workflow in the list.

---

## Live Testing (During Video)

### **Test Case 1: Memory Leak Detection (ROLLBACK)**

**Show in video:**
1. Point to dashboard showing current deployments
2. Say: "Let's deploy a version with a memory leak"
3. Run this command:

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

4. **Switch to Kestra tab** - Show workflow executing:
   - Point to "Executions" tab
   - Show real-time logs
   - Highlight "AI Agent summarization" task
   - Show decision output: "ROLLBACK"

5. **Switch back to Dashboard** - Should auto-refresh and show:
   - New deployment: payment-service v1.2.3
   - Status: Rolled Back
   - AI Analysis showing memory leak detection
   - Decision: ROLLBACK badge
   - Action Taken: "Automatic rollback to v1.2.2"

### **Test Case 2: Healthy Deployment (CONTINUE)**

**Show in video:**
1. Say: "Now let's deploy the fixed version"
2. Run:

```bash
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-loop/deployment-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "deploymentId": "deploy-002",
    "service": "payment-service",
    "environment": "production",
    "timestamp": "2024-12-14T11:00:00Z"
  }'
```

3. **Show in Kestra** - Workflow runs, AI decides "CONTINUE"
4. **Show in Dashboard** - New deployment appears:
   - Status: Healthy (green)
   - Decision: CONTINUE
   - All metrics normal

### **Test Case 3: Database Timeout (ROLLBACK)**

```bash
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-loop/deployment-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "deploymentId": "deploy-003",
    "service": "user-service",
    "environment": "production",
    "timestamp": "2024-12-14T12:00:00Z"
  }'
```

---

## What Each Component Does (Explain in Video)

### **Kestra Workflow:**
- Receives deployment webhook
- Collects logs from mock data
- Calls AI Agent to summarize
- Makes binary decision (ROLLBACK/CONTINUE)
- Executes action

### **Dashboard:**
- Auto-refreshes every 5 seconds
- Shows real-time deployment status
- Displays AI reasoning
- Timeline of events

### **Mock Data:**
- Simulates real production scenarios
- 3 scenarios: memory leak, hotfix, DB timeout
- AI analyzes realistic log patterns

---

## Video Flow (7 Minutes)

**0:00-1:00** - Introduction
- "Hi, I built AI DevOps Commander for the hackathon"
- Show architecture diagram
- Explain the problem

**1:00-2:00** - Dashboard Overview
- Show UI running
- Walk through sections
- Point out "Live Monitoring" badge

**2:00-3:30** - Test 1: Memory Leak
- Run curl command
- Show Kestra workflow executing
- Show dashboard update with ROLLBACK decision

**3:30-4:30** - Test 2: Healthy Deploy
- Run curl command
- Show CONTINUE decision
- Highlight AI reasoning

**4:30-5:30** - Show Cline Auto-Fix
```bash
cd /Users/rishijat/Desktop/ai-devops-commander
./cline-scripts/auto-fix-memory-leak.sh deploy-001 payment-service
```

**5:30-6:30** - Show Oumi RL Training
- Open Jupyter notebook
- Show training charts
- Explain Q-learning policy

**6:30-7:00** - Closing
- Recap: "Fully autonomous DevOps with AI"
- Show GitHub repo
- Call to action

---

## Pro Tips for Recording

1. **Split Screen:**
   - Left: Dashboard
   - Right: Kestra or Terminal
   - Shows cause & effect in real-time

2. **Terminal Setup:**
   - Large font (18pt+)
   - Clear background
   - Pre-written commands in a text file to copy-paste

3. **Browser Setup:**
   - Hide bookmarks bar
   - Full screen demo (⌘ Shift F)
   - Disable notifications

4. **Narration:**
   - "Watch as the AI detects the memory leak..."
   - "The system automatically decided to rollback..."
   - "Within 3 minutes, service is restored..."

5. **Pause Points:**
   - After each curl command (let viewers see it)
   - When showing AI decision (highlight the reasoning)
   - Timeline section (walk through each step)

---

## Backup Plan

If webhook doesn't work or Kestra has issues:

1. **Show Mock Data Directly:**
   - Open `mock-data/deployments.json`
   - Explain the scenarios
   - Show how AI would analyze each

2. **Click Through Deployments:**
   - Use sidebar to switch between deployments
   - Show different scenarios
   - Explain AI decisions for each

3. **Show Workflow File:**
   - Open `kestra/workflows/devops-loop.yml`
   - Walk through the YAML
   - Explain AI Agent task

---

## Test Commands Quick Reference

```bash
# Test 1: Memory Leak (ROLLBACK)
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-loop/deployment-webhook -H "Content-Type: application/json" -d '{"deploymentId":"deploy-001","service":"payment-service","environment":"production","timestamp":"2024-12-14T10:30:00Z"}'

# Test 2: Hotfix (CONTINUE)
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-loop/deployment-webhook -H "Content-Type: application/json" -d '{"deploymentId":"deploy-002","service":"payment-service","environment":"production","timestamp":"2024-12-14T11:00:00Z"}'

# Test 3: DB Timeout (ROLLBACK)
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-loop/deployment-webhook -H "Content-Type: application/json" -d '{"deploymentId":"deploy-003","service":"user-service","environment":"production","timestamp":"2024-12-14T12:00:00Z"}'

# Cline Auto-Fix Demo
./cline-scripts/auto-fix-memory-leak.sh deploy-001 payment-service
```

---

## What Makes This Impressive

✅ **Real Workflow:** Kestra executes actual AI workflow
✅ **Live Updates:** Dashboard refreshes automatically
✅ **Multiple Tools:** Kestra + Cline + Oumi + CodeRabbit
✅ **Real AI:** LLM-powered decision making
✅ **Production-Ready:** Professional UI, proper architecture
✅ **Open Source:** All code on GitHub

---

## After Demo

1. **Push Final Code:**
```bash
git add .
git commit -m "feat: production-ready UI with live monitoring"
git push
```

2. **Deploy Dashboard:**
- Push to Vercel
- Add live demo link to README

3. **Submit to Hackathon:**
- GitHub repo link
- YouTube video link
- Vercel deployment link

---

You're ready to win! 🏆
