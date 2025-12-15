# 🚀 Kestra Setup Instructions

## 1. Start Kestra

```bash
cd kestra
docker-compose up -d
```

Wait 30 seconds for startup.

## 2. Create Admin Account

1. Open http://localhost:8080
2. You'll see "Create your admin account"
3. Fill in:
   - **Username**: admin
   - **Email**: your@email.com  
   - **Password**: admin123 (or your choice)
4. Click **Create Account**

## 3. Load Workflow

In terminal:
```bash
cd /Users/rishijat/Desktop/ai-devops-commander
curl -X POST "http://localhost:8080/api/v1/flows" \
  -u "admin:admin123" \
  -H "Content-Type: application/x-yaml" \
  --data-binary "@kestra/workflows/ai-devops-workflow.yml"
```

## 4. Update Dashboard Credentials

Edit `dashboard/app/api/deployments/route.ts` line 7:
```typescript
const auth = Buffer.from('admin:admin123').toString('base64')
```

Edit `dashboard/app/api/trigger/route.ts` add auth:
```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Basic ${Buffer.from('admin:admin123').toString('base64')}`,
  'Accept': 'application/json'
}
```

## 5. Restart Dashboard

```bash
cd dashboard  
npm run dev
```

## 6. Test!

1. Open Dashboard: http://localhost:3001
2. Click "Trigger BAD Deployment" or "Trigger GOOD Deployment"
3. Watch real-time AI decisions!

---

**Note**: Kestra latest version REQUIRES authentication. This is more secure for production!
