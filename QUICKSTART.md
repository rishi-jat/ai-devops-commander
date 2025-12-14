# Quick Start Guide

Get AI DevOps Commander running in under 5 minutes.

## Prerequisites

- Docker & Docker Compose
- Node.js 18+
- Python 3.10+
- Git

## Installation

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd ai-devops-commander
```

### 2. Start Kestra (Workflow Engine)

```bash
cd kestra
docker-compose up -d
```

Wait ~30 seconds, then verify:
```bash
curl http://localhost:8080/health
```

You should see: `{"status":"UP"}`

Access Kestra UI: http://localhost:8080

### 3. Start Dashboard (UI)

```bash
cd ../dashboard
npm install
npm run dev
```

Access Dashboard: http://localhost:3000

### 4. Test the System

Trigger a deployment workflow:

```bash
# Unhealthy deployment (will trigger rollback)
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-autonomous-loop/devops-deploy-webhook \
  -H "Content-Type: application/json" \
  -d '{"deployment_id": "deploy-001", "service_name": "payment-service", "version": "v1.2.3"}'
```

Watch the magic:
1. Open Kestra UI → Executions
2. Open Dashboard → See AI decision
3. Observe automatic rollback

## What Just Happened?

1. ✅ Kestra collected deployment logs & metrics
2. ✅ AI analyzed the data and detected issues
3. ✅ System decided to ROLLBACK (94% confidence)
4. ✅ Action executed automatically
5. ✅ Dashboard shows the full story

## Try More Scenarios

### Healthy Deployment
```bash
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-autonomous-loop/devops-deploy-webhook \
  -H "Content-Type: application/json" \
  -d '{"deployment_id": "deploy-002", "service_name": "payment-service", "version": "v1.2.4-hotfix"}'
```

Expected: AI says "CONTINUE" ✅

### Database Timeout
```bash
curl -X POST http://localhost:8080/api/v1/executions/webhook/ai.devops.commander/devops-autonomous-loop/devops-deploy-webhook \
  -H "Content-Type: application/json" \
  -d '{"deployment_id": "deploy-003", "service_name": "user-service", "version": "v1.3.0"}'
```

Expected: AI says "ROLLBACK" ❌

## Run Training Notebook

```bash
cd oumi
pip install jupyter numpy pandas matplotlib
jupyter notebook train_deployment_policy.ipynb
```

Run all cells to train the RL model.

## Test Cline Auto-Fix

```bash
cd cline-scripts
chmod +x *.sh
./auto-fix-memory-leak.sh deploy-001 payment-service
```

See autonomous code fix generation!

## Next Steps

- Read [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) for full demo walkthrough
- Explore [README.md](../README.md) for architecture details
- Check [kestra/README.md](../kestra/README.md) for workflow docs

## Troubleshooting

**Kestra won't start:**
```bash
docker-compose down -v
docker-compose up -d --build
```

**Dashboard API errors:**
- Ensure you're in the `dashboard/` directory
- Check `../mock-data/` files exist

**Jupyter kernel issues:**
```bash
pip install --upgrade jupyter ipykernel
python -m ipykernel install --user
```

## Support

Questions? Check:
- [Full README](../README.md)
- [Demo Script](./DEMO_SCRIPT.md)
- [Kestra Docs](https://kestra.io/docs)

---

**You're ready to demo! 🚀**
