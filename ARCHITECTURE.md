# AI DevOps Commander - Project Structure

```
ai-devops-commander/
├── README.md                          # Main project documentation
├── QUICKSTART.md                      # 5-minute setup guide
├── CONTRIBUTING.md                    # Contribution guidelines
├── LICENSE                            # MIT License
├── .gitignore                         # Git ignore rules
│
├── mock-data/                         # Realistic mock deployment data
│   ├── logs.json                      # Deployment logs with errors
│   ├── metrics.json                   # Performance metrics
│   └── deployments.json               # Deployment history & outcomes
│
├── kestra/                            # Workflow orchestration (Prize: Black Panther)
│   ├── README.md                      # Kestra setup & usage docs
│   ├── docker-compose.yml             # Kestra local deployment
│   └── workflows/
│       └── devops-loop.yml            # Main autonomous workflow
│
├── dashboard/                         # UI for visibility (Prize: Thor)
│   ├── package.json                   # Dependencies
│   ├── next.config.js                 # Next.js configuration
│   ├── tailwind.config.js             # Tailwind CSS config
│   ├── tsconfig.json                  # TypeScript config
│   ├── app/
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Main page
│   │   ├── globals.css                # Global styles
│   │   └── api/
│   │       ├── deployments/route.ts   # Deployments API
│   │       └── metrics/[id]/route.ts  # Metrics API
│   └── components/
│       ├── DeploymentDashboard.tsx    # Main dashboard component
│       ├── DeploymentTimeline.tsx     # Timeline view
│       └── MetricsChart.tsx           # Metrics visualization
│
├── cline-scripts/                     # Autonomous code fixes (Prize: Infinity)
│   ├── README.md                      # Cline automation docs
│   ├── auto-fix-memory-leak.sh        # Memory leak fix generator
│   └── auto-fix-database-timeout.sh   # DB timeout fix generator
│
├── oumi/                              # RL training (Prize: Iron Man)
│   └── train_deployment_policy.ipynb  # RL policy training notebook
│
└── demo/                              # Demo materials
    └── DEMO_SCRIPT.md                 # Complete demo walkthrough
```

## Component Responsibilities

### Mock Data (`mock-data/`)
- Provides realistic deployment scenarios
- Tells coherent stories (failures + successes)
- Used by all components for consistency

### Kestra (`kestra/`)
**Prize Target:** Black Panther - Wakanda Data Award ($4,000)

**Responsibilities:**
- Orchestrate deployment workflow
- Use built-in AI Agent for log/metric summarization
- Make autonomous decisions (CONTINUE vs ROLLBACK)
- Execute actions
- Record outcomes for learning

**Key File:** `workflows/devops-loop.yml`

### Dashboard (`dashboard/`)
**Prize Target:** Thor - Stormbreaker Deployment Award ($2,000)

**Responsibilities:**
- Production-ready Next.js deployment
- Real-time deployment monitoring
- AI decision visualization
- Metrics charting
- Timeline view

**Tech Stack:** Next.js 14, React, TypeScript, Tailwind, Recharts

### Cline Scripts (`cline-scripts/`)
**Prize Target:** Infinity Gauntlet - Infinity Build Award ($5,000)

**Responsibilities:**
- Analyze error logs
- Generate code fixes autonomously
- Create pull requests
- Demonstrate Cline CLI workflows

**Key Files:** 
- `auto-fix-memory-leak.sh` - Memory leak detection & fix
- `auto-fix-database-timeout.sh` - DB config optimization

### Oumi (`oumi/`)
**Prize Target:** Iron Man Helmet - Iron Intelligence Award ($3,000)

**Responsibilities:**
- Train RL policy for deployment decisions
- Learn from deployment outcomes
- Improve decision accuracy over time
- Contribute to open-source ML practices

**Key File:** `train_deployment_policy.ipynb` - Complete training pipeline

### Demo (`demo/`)
**Purpose:** Judge presentation materials

**Contents:**
- Complete demo script
- Q&A preparation
- Video recording guide
- Troubleshooting tips

## Data Flow

```
Deployment Event
       ↓
Kestra Workflow Triggered
       ↓
Collect Logs (mock-data/logs.json)
       ↓
Collect Metrics (mock-data/metrics.json)
       ↓
AI Summarization (Kestra AI Agent)
       ↓
Decision Making (with Oumi RL model)
       ↓
Action Execution (CONTINUE or ROLLBACK)
       ↓
Record Outcome (mock-data/deployments.json)
       ↓
Update Dashboard (Vercel UI)
       ↓
Optional: Trigger Cline Fix (if rollback)
       ↓
New Deployment with Fix
```

## Prize Alignment Summary

| Component | Prize | Amount | Status |
|-----------|-------|--------|--------|
| Kestra Workflow | Black Panther | $4,000 | ✅ Complete |
| Vercel Dashboard | Thor | $2,000 | ✅ Complete |
| Cline Automation | Infinity Gauntlet | $5,000 | ✅ Complete |
| Oumi RL Training | Iron Man | $3,000 | ✅ Complete |
| Clean OSS Practices | Captain Code | $1,000 | ✅ Complete |
| **Total Potential** | | **$15,000** | |

## Technology Stack

- **Orchestration:** Kestra
- **Frontend:** Next.js, React, TypeScript, Tailwind
- **ML/RL:** Oumi, Python, NumPy, Pandas
- **Code Automation:** Cline CLI
- **Code Review:** CodeRabbit
- **Inference:** Together AI
- **Deployment:** Vercel
- **Containerization:** Docker

## Quick Commands

```bash
# Start everything
docker-compose -f kestra/docker-compose.yml up -d
cd dashboard && npm run dev

# Run demo
see demo/DEMO_SCRIPT.md

# Train RL model
cd oumi && jupyter notebook

# Generate fix
cd cline-scripts && ./auto-fix-memory-leak.sh deploy-001 payment-service
```

## Development Guidelines

1. **Follow the plan** - See root README for build order
2. **Keep it simple** - Clarity > complexity
3. **Mock is fine** - Focus on demo, not production scale
4. **Document everything** - Judges read READMEs
5. **Test the demo** - Practice the full flow

## Judge Evaluation Points

When showing this to judges, emphasize:

1. **Clear Problem** - DevOps toil is real
2. **Complete Solution** - All 5 sponsor tools integrated
3. **Autonomous Loop** - Observe → Decide → Act → Learn
4. **Visible Decisions** - Dashboard shows AI reasoning
5. **Learning System** - RL model improves over time

---

**Built for AI Agents Assemble Hackathon 2025**  
**Status:** Production-ready demo ✅
