# Vercel Deployment Configuration

This file would be used to deploy the dashboard to Vercel for the Thor Stormbreaker Award.

## Vercel CLI Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from dashboard directory
cd dashboard
vercel

# Follow prompts to configure project
```

## vercel.json Configuration

The following configuration would be added to `dashboard/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sfo1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Environment Variables

Set these in Vercel dashboard:

- `NEXT_PUBLIC_API_URL` - API endpoint (if using external backend)
- `KESTRA_WEBHOOK_URL` - Kestra webhook endpoint (if deployed)

## Deployment Steps

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Configure build settings (auto-detected for Next.js)
4. Deploy

## Production URL

Once deployed, the dashboard will be accessible at:
`https://ai-devops-commander.vercel.app`

This shows production-ready deployment for the **Thor Stormbreaker Award** ($2,000).
