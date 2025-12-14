# 🚀 Deployment Guide

## Deploy Dashboard to Vercel

### Prerequisites
```bash
npm install -g vercel
```

### Quick Deploy
```bash
cd dashboard
vercel --prod
```

### Configuration

Add environment variables in Vercel dashboard:
- `KESTRA_API_URL`: Your Kestra instance URL (e.g., https://kestra.yourcompany.com/api/v1)

### Local Testing Before Deploy
```bash
cd dashboard
npm run build
npm start
```

## Deploy Kestra (Production)

### Option 1: Docker Compose (Recommended)
```bash
cd kestra
docker-compose up -d
```

### Option 2: Kubernetes
See `kestra/k8s/` for Kubernetes manifests

### Option 3: Cloud Managed
- AWS ECS
- Azure Container Apps
- Google Cloud Run

## Post-Deployment Checklist

- [ ] Dashboard accessible at Vercel URL
- [ ] Kestra workflow uploaded
- [ ] Webhook endpoint working
- [ ] Together AI API key configured (if using real AI)
- [ ] Test trigger buttons work
- [ ] Dashboard updates in real-time

## Troubleshooting

**Dashboard not updating?**
- Check KESTRA_API_URL environment variable
- Verify Kestra is accessible from Vercel
- Check browser console for CORS errors

**Webhook not working?**
- Verify workflow is saved in Kestra
- Check webhook key matches: `deployment-webhook`
- Test with curl command first

**AI not working?**
- Set TOGETHER_API_KEY in Kestra secrets
- Falls back to algorithmic decision if no API key
- Check logs in Kestra execution view
