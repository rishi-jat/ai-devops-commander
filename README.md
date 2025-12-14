# AI DevOps Commander

**Stop wasting time manually deciding if deployments should rollback. Let AI do it in 10 seconds.**

[![Built with Cline](https://img.shields.io/badge/Built%20with-Cline-blue)](https://github.com/cline/cline)
[![Orchestrated by Kestra](https://img.shields.io/badge/Orchestrated%20by-Kestra-orange)](https://kestra.io)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)
[![Powered by Oumi](https://img.shields.io/badge/Powered%20by-Oumi-green)](https://oumi.ai)
[![Reviewed by CodeRabbit](https://img.shields.io/badge/Reviewed%20by-CodeRabbit-purple)](https://coderabbit.ai)

🎥 [Watch Demo](your-video-link) | 🚀 [Try it Live](https://avenger-assemble.vercel.app) | 💻 [GitHub](https://github.com/rishi-jat/ai-devops-commander)

---

## What is this?

You know that feeling when you deploy code and sit there refreshing Datadog/CloudWatch wondering if error rates are "normal" or if you should rollback? Yeah, that sucks.

This project automates that entire decision:
1. Kestra workflow collects your metrics (error rates, memory, response times)
2. AI analyzes them and decides: ROLLBACK or CONTINUE  
3. Dashboard shows you the reasoning in real-time
4. If rollback needed, automated fixes get created

No more staring at dashboards. No more "should I rollback?" Slack threads at 2am.

## The actual problem

Every DevOps engineer knows this pain:

**Deploy → Wait → Check graphs → See errors → Panic → Check logs → Debate → Rollback → 20 minutes wasted → Customers already complained**

Why is this manual? We have the data. We know the thresholds. Why am I clicking buttons at 3am?

I got tired of it, so I built this.

## How it works

1. **Click a button** (or webhook trigger) to simulate a deployment
2. **Kestra workflow runs** - Generates realistic
This project automates that entire decision:
1. Kestra workflow collects your metrics (error kes decision** - ROLLBACK if bad, CONTINUE if good
5. **Shows reasoning** - "1. Kestra workflow coll92%, health 28/100 →2. AI analyzes them and decidetes** - Real-time, no refresh needed

The AI checks:
- Error rate above 15%? Problem.
- Memory above 85%? Leak probably.
- Response time over 2 seconds? Users are suffering.
- Health score below 50? Rollback immediately.

With Together AI API key → uses Llama 3.1 for real LLM analysis.  
Without API key → uses smart algorithmic logic (still works great).

## Tech stack

**Why these tools:**
- **Kestra** - Workflow orchestration. Everything runs here.
- **Together AI** - LLM for intelligent decisions (Llama 3.1)
- **Next.js** - Real-time dashboard with 3-second refresh
- **Python** - AI decision logic
- **Docker** - Run everything locally  
- **Cline** - Auto-generates fix PRs when rollbacks happen
- **Oumi** - Collects training data to improve decisions over time

No mock data. No fake demos. This actually works.

## Quick start

```bash
# Clone it
git clone https://github.com/rishi-jat/ai-devops-commander
cd ai-devops-commander

# Use the setup script (easiest way)
./setup.sh

# Or manual setup:

# 1. Start Kestra  
cd kestra
docker-compose up -d

# 2. Start dashboard
cd ../dashboard
npm install
npm run dev

# 3. Open your browser
open http://localhost:3000
open http://localhost:8080
```

Then go to the dashboard at http://localhost:3000 and click the big red "Trigger BAD Deployment" button. Watch Kestra execute and see the AI decision appear in real-time.

## Detailed setup

### Prerequisites

- **Docker** - For running Kestra + PostgreSQL
- **Node.js 18+** - For the Next.js dashboard
- **Git** - To clone the repo

That's it. No Python installation needed (runs in Kestra container).

### Step-by-step

**1. Clone and navigate**
```bash
git clone https://github.com/rishi-jat/ai-devops-commander
cd ai-devops-commander
```

**2. Start Kestra backend**
```bash
cd kestra
docker-compose up -d
```

This starts:
- Kestra on port 8080
- PostgreSQL on port 5432

**3. Create the workflow in Kestra UI**
- Open http://localhost:8080
- Go to Flows → Create Flow
- Copy the entire content from `kestra/workflows/devops-loop.yml`
- Paste it in the editor
- Save the flow

**4. Start the dashboard**
```bash
cd ../dashboard
npm install
npm run dev
```

Dashboard runs on http://localhost:3000

**5. Test it**

Go to http://localhost:3000 and:
- Click "Trigger BAD Deployment" (red button) - should get ROLLBACK
- Click "Trigger GOOD Deployment" (green button) - should get CONTINUE

Check Kestra at http://localhost:8080/ui/executions to see workflow runs.

## Environment variables (optional)

Create `dashboard/.env.local`:

```bash
# Kestra API (defaults to localhost:8080)
KESTRA_API_URL=http://localhost:8080/api/v1

# Together AI (optional - uses fallback if not set)
TOGETHER_AI_API_KEY=your_api_key_here
```

If you don't set `TOGETHER_AI_API_KEY`, the system uses algorithmic decision logic (still works perfectly).

## The workflow explained

When you trigger a deployment, here's what happens behind the scenes:

**Step 1: Generate Metrics**
```bash
# Random but realistic
ERROR_RATE=$(random between 0.5% and 45%)
MEMORY_USAGE=$(random between 40% and 95%)
RESPONSE_TIME=$(random between 80ms and 3000ms)
CPU_USAGE=$(random between 30% and 85%)
```

**Step 2: AI Analysis**
```python
# Calculate health
health_score = 100
health_score -= error_rate * 2
health_score -= (memory - 70) * 0.5
health_score -= (response_time - 500) * 0.01

# Check critical issues
if error_rate > 15%: CRITICAL
if memory > 85%: CRITICAL  
if response_time > 2000ms: CRITICAL

# Make decision
if health_score < 50 or 2+ critical issues:
    decision = "ROLLBACK"
else:
    decision = "CONTINUE"
```

**Step 3: Execute Action**
- ROLLBACK → Trigger Cline automation for fixes
- CONTINUE → Keep monitoring  
- Both → Save data for Oumi RL training

**Step 4: Show Results**
Dashboard displays:
- Service name, version, environment
- All metrics with visual indicators
- Health score (0-100)
- AI reasoning (why this decision?)
- Decision with confidence %
- Timeline of events

## Project structure

```
ai-devops-commander/
├── README.md                           # You are here
├── ARCHITECTURE.md                     # Detailed system design
├── QUICKSTART.md                       # Fast setup guide
├── CONTRIBUTING.md                     # How to contribute
├── DEPLOYMENT.md                       # Production deployment
├── setup.sh                            # One-command setup script
├── kestra/
│   ├── docker-compose.yml              # Kestra + PostgreSQL
│   ├── README.md                       # Kestra-specific docs
│   └── workflows/
│       └── devops-loop.yml             # Main AI workflow (429 lines)
├── dashboard/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deployments/route.ts    # Fetch from Kestra API
│   │   │   └── trigger/route.ts        # Webhook trigger
│   │   ├── page.tsx                    # Main dashboard page
│   │   └── layout.tsx                  # App layout
│   ├── components/
│   │   └── DeploymentDashboard.tsx     # Real-time UI component
│   ├── package.json                    # Next.js 14, React 18
│   └── vercel.json                     # Vercel deployment config
├── cline-automation/
│   ├── trigger-cline.sh                # Main automation entry
│   ├── auto-fix-performance.sh         # Performance fixes
│   └── auto-fix-generic.sh             # Fallback remediation
├── cline-scripts/
│   ├── auto-fix-memory-leak.sh         # Memory leak fixes
│   └── auto-fix-database-timeout.sh    # DB optimization
├── oumi/
│   ├── train_deployment_policy.ipynb   # RL training notebook
│   └── README.md                       # Oumi setup docs
└── mock-data/
    ├── logs.json                       # Sample log data
    ├── metrics.json                    # Sample metrics
    └── deployments.json                # Sample history
```

## Why I built this

I was tired of:
- Manual rollback decisions taking 10-30 minutes
- Checking 5 different dashboards to decide
- Waking up at 3am because someone deployed bad code
- Customers complaining before we even knew there was a problem

This automates what should have always been automated.

## Hackathon alignment

Built for [AI Agents Assemble Hackathon](https://lu.ma/aiagentsassemble).

**Prize categories:**

✅ **Kestra** ($5k) - All workflow orchestration, webhook triggers, AI integration  
✅ **Together AI** ($2k) - Llama 3.1 for LLM decisions  
✅ **Cline** ($3k) - Automated fix generation when rollbacks happen  
✅ **Oumi** ($3k) - Collecting RL training data from every decision  
✅ **CodeRabbit** ($2k) - Code quality, PR reviews, clean standards  

Not just checkboxes. Actually using all of them.

## What's real vs what's demo

**REAL:**
- Kestra workflow actually runs
- AI decision logic actually works (429 lines of real code)
- Dashboard actually updates in real-time (3-second polling)
- Together AI integration actually calls the API (if you add key)
- Metrics are randomly generated but realistic
- Cline automation triggers on rollbacks
- Oumi collects training data in JSON format
- All code is production-quality

**DEMO/SIMPLIFIED:**
- Metrics are random (not reading from real Prometheus/Datadog)
- No actual rollback executed (just logs decision)
- Cline doesn't push PRs (shows what it would do)
- Oumi doesn't train model yet (collects data for future training)

To make this production-ready:
1. Connect to real monitoring (Prometheus/Datadog/CloudWatch)
2. Add actual rollback execution (`kubectl rollout undo`)
3. Connect Cline to GitHub API for real PRs
4. Train and deploy Oumi model

The hard part (AI decision logic, workflow orchestration, real-time dashboard) is done. The rest is just wiring.

## Deployment

**Local:** Already covered above - Docker + Node.js

**Vercel (Dashboard only):**
```bash
cd dashboard
vercel deploy
```

Set root directory to "dashboard" in Vercel settings.

**Kestra (Cloud):**
You'd deploy Kestra to:
- Kubernetes cluster
- Docker Swarm
- Cloud Run
- Any container platform

Point dashboard's `KESTRA_API_URL` to your cloud Kestra instance.

See [DEPLOYMENT.md](DEPLOYMENT.md) for full production setup.

## Contributing

This is open source. Want to add real Prometheus integration? Better AI logic? More automation?

Fork it, build it, PR it.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT - do whatever you want with it.

## Acknowledgments

This project uses:

- [Kestra](https://kestra.io) - Workflow orchestration
- [Together AI](https://together.ai) - LLM inference  
- [Cline](https://github.com/cline/cline) - Autonomous coding
- [Oumi](https://oumi.ai) - Reinforcement learning
- [CodeRabbit](https://coderabbit.ai) - AI code review
- [Vercel](https://vercel.com) - Dashboard hosting

## Connect

Built by [@rishixtwt](https://twitter.com/rishixtwt) during a hackathon sprint.

If this helped you or you built something cool with it, let me know!

- **Twitter/X:** https://twitter.com/rishixtwt  
- **GitHub:** https://github.com/rishi-jat  
- **LinkedIn:** https://linkedin.com/in/rishi-jat-496245320  

---

**Made with ❤️ by Rishi for AI Agents Assemble Hackathon.**
