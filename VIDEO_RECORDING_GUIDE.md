# 🎥 Video Recording Guide for YouTube

## ✅ System Status - READY TO RECORD!

### Running Services:
1. ✅ **Kestra**: http://localhost:8080 (Workflow orchestration)
2. ✅ **Dashboard**: http://localhost:3000 (Real-time UI)
3. ✅ **PostgreSQL**: Running (Database)

---

## 🎬 7-Minute Demo Script

### **Intro (0:00 - 0:45)**
**Screen**: Show README.md or slides
- "Hi! I'm presenting AI DevOps Commander for the AI Agents Assemble Hackathon"
- "The problem: DevOps teams are overwhelmed with deployment failures"
- "Our solution: A fully autonomous AI system that observes, decides, acts, and learns"
- "Built with: Kestra AI Agent, Cline, Oumi, CodeRabbit, Together AI"

### **Architecture Overview (0:45 - 1:30)**
**Screen**: Show ARCHITECTURE.md or draw.io diagram
- "5 pillars: Observe → Decide → Act → Learn → Improve"
- "Kestra orchestrates workflows with AI Agent for summarization"
- "Cline autonomously fixes code issues"
- "Oumi trains deployment policies with reinforcement learning"
- "CodeRabbit ensures code quality"

### **Live Demo Part 1: Dashboard (1:30 - 2:15)**
**Screen**: http://localhost:3000
- Open browser to dashboard
- "Here's our real-time deployment dashboard"
- "Shows deployment history, error rates, and AI decisions"
- "Clean UI built with Next.js and Tailwind CSS"

### **Live Demo Part 2: Kestra Workflow (2:15 - 3:00)**
**Screen**: http://localhost:8080
- Open Kestra UI
- Navigate to Flows
- Click "Create" and upload workflow:
  ```bash
  # Copy from: kestra/workflows/devops-loop.yml
  ```
- "This is our autonomous DevOps workflow"
- "It has AI Agent summarization and binary decision logic"

### **Live Demo Part 3: Trigger Deployment (3:00 - 4:30)**
**Screen**: Split screen - Terminal + Kestra + Dashboard

**Terminal command:**
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

- "Triggering a deployment with a memory leak issue"
- **Switch to Kestra**: "Watch the workflow execute"
- Show execution log, highlight AI summarization task
- **Point out**: "AI detected the memory leak!"
- **Show decision**: "System decided to ROLLBACK"
- **Switch to Dashboard**: "See the real-time update with error rate spike"

### **Live Demo Part 4: Healthy Deployment (4:30 - 5:15)**
**Screen**: Same split screen

**Terminal command:**
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

- "Now triggering a healthy deployment"
- **Kestra**: "No issues detected"
- **Show decision**: "System decided to CONTINUE"
- **Dashboard**: "Metrics look healthy, green status"

### **Autonomous Fix Demo (5:15 - 5:45)**
**Screen**: Terminal + VS Code

```bash
cd /Users/rishijat/Desktop/ai-devops-commander
./cline-scripts/auto-fix-memory-leak.sh deploy-001 payment-service
```

- "This is Cline in action - autonomous code fix generation"
- Show script analyzing logs
- Show generated fix suggestion
- "Cline can automatically create PRs with fixes"

### **ML Training (5:45 - 6:15)**
**Screen**: Open Jupyter notebook

```bash
# Show: oumi/train_deployment_policy.ipynb
```

- "Here's our reinforcement learning training"
- Scroll through notebook
- Show training progress chart
- "Oumi trained a Q-learning policy with 100 episodes"
- "It learned optimal deployment decisions from historical data"

### **Prize Category Alignment (6:15 - 6:45)**
**Screen**: ARCHITECTURE.md or slides

- "Best Kestra Integration: AI Agent workflow orchestration"
- "Best Use of Cline: Autonomous code fixes"
- "Best Use of Oumi: RL-based deployment policy"
- "Best Use of Together AI: LLM-powered log analysis"
- "CodeRabbit Excellence: OSS best practices"

### **Closing (6:45 - 7:00)**
**Screen**: README.md with GitHub link

- "Everything is open source on GitHub"
- "Live demo: Dashboard can be deployed on Vercel in 1 click"
- "Repository: github.com/rishi-jat/ai-devops-commander"
- "Thank you! Built in 24 hours for AI Agents Assemble"

---

## 🎥 Recording Tips

### Before Recording:
1. ✅ Close unnecessary browser tabs
2. ✅ Clear terminal history: `clear`
3. ✅ Set terminal font size to 16-18pt for visibility
4. ✅ Use full screen for demos
5. ✅ Test audio - speak clearly and enthusiastically
6. ✅ Have all curl commands ready to copy-paste

### Screen Recording Tools (macOS):
- **QuickTime** (Built-in): File → New Screen Recording
- **OBS Studio** (Free): More features, better quality
- **Loom** (Free tier): Easy upload to web

### Recording Settings:
- Resolution: 1920x1080 (Full HD)
- Frame Rate: 30fps minimum
- Audio: Clear microphone (test first!)
- Length: 6-8 minutes (edit to 7 minutes)

### During Recording:
1. Speak clearly and at moderate pace
2. Pause between sections (easier to edit)
3. Point cursor to highlight important parts
4. Don't rush - clarity over speed
5. Smile! Energy shows in your voice

### After Recording:
1. Trim intro/outro if needed
2. Add captions (YouTube auto-generates)
3. Add chapter markers:
   - 0:00 Intro
   - 0:45 Architecture
   - 1:30 Dashboard
   - 2:15 Kestra
   - 3:00 Demo: Memory Leak
   - 4:30 Demo: Healthy Deploy
   - 5:15 Cline Auto-Fix
   - 5:45 ML Training
   - 6:15 Prize Categories

---

## 📤 Upload to YouTube

### Video Details:
**Title**: "AI DevOps Commander - Autonomous DevOps System | AI Agents Assemble Hackathon"

**Description**:
```
AI DevOps Commander: A fully autonomous DevOps system that observes deployments, makes AI-powered decisions, autonomously fixes issues, and learns from every deployment.

🚀 Built for AI Agents Assemble Hackathon
⏱️ Developed in 24 hours
🏆 Targeting 5 prize categories

Tech Stack:
- Kestra AI Agent: Workflow orchestration
- Cline: Autonomous code fixes
- Oumi: Reinforcement learning
- CodeRabbit: Code quality
- Together AI: LLM analysis
- Next.js + Tailwind: Dashboard

🔗 GitHub: https://github.com/rishi-jat/ai-devops-commander
🔗 Live Demo: [Your Vercel URL]

Timestamps:
0:00 Introduction
0:45 Architecture Overview
1:30 Dashboard Demo
2:15 Kestra Workflow
3:00 Memory Leak Detection
4:30 Healthy Deployment
5:15 Autonomous Fixes (Cline)
5:45 ML Training (Oumi)
6:15 Prize Categories

#AIAgentsAssemble #Hackathon #DevOps #AI #MachineLearning #Kestra #Cline #Oumi
```

**Tags**:
```
AI, DevOps, Machine Learning, Automation, Hackathon, Kestra, Cline, Oumi, CodeRabbit, Together AI, Next.js, Reinforcement Learning, Autonomous Systems
```

**Thumbnail Ideas**:
- Screenshot of dashboard with "AI DevOps Commander" text
- Split screen: Terminal + Dashboard + Kestra
- Architecture diagram with tool logos

### Upload Settings:
- ✅ Visibility: Public (or Unlisted if required by hackathon)
- ✅ Category: Science & Technology
- ✅ Comments: Enabled
- ✅ Add to playlist: "Hackathon Projects"

---

## ✅ Pre-Flight Checklist

- [ ] Both services running (Kestra + Dashboard)
- [ ] Workflow uploaded to Kestra
- [ ] Test all 3 curl commands before recording
- [ ] Terminal font size readable
- [ ] Browser bookmarks/tabs cleaned up
- [ ] Microphone tested
- [ ] Screen recording software ready
- [ ] Script printed or on second screen
- [ ] 7-minute timer set
- [ ] Energy drink ready ☕

---

## 🚀 Quick Test Commands

**Test Dashboard:**
```bash
open http://localhost:3000
```

**Test Kestra:**
```bash
open http://localhost:8080
```

**Test Memory Leak Scenario:**
```bash
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-loop/deployment-webhook \
  -H "Content-Type: application/json" \
  -d '{"deploymentId": "deploy-001", "service": "payment-service", "environment": "production", "timestamp": "2024-12-14T10:30:00Z"}'
```

**Test Healthy Scenario:**
```bash
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-loop/deployment-webhook \
  -H "Content-Type: application/json" \
  -d '{"deploymentId": "deploy-002", "service": "auth-service", "environment": "production", "timestamp": "2024-12-14T10:35:00Z"}'
```

**Test Cline Script:**
```bash
./cline-scripts/auto-fix-memory-leak.sh deploy-001 payment-service
```

---

## 🎯 You Got This!

Everything is ready. Your system is working. Now just:
1. **Record** the 7-minute demo
2. **Upload** to YouTube
3. **Submit** to hackathon with links
4. **Win** $15k in prizes! 🏆

Good luck! 🚀
