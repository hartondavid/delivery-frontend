# CORS Solution

## The Problem
After fixing the API URL, we now have a CORS (Cross-Origin Resource Sharing) error:

```
Access to fetch at 'https://delivery-backend-jade.vercel.app/api/users/login' 
from origin 'https://delivery.davidharton.online' has been blocked by CORS policy
```

## Solution: Vercel Proxy Configuration

I've configured a proxy in `vercel.json` that routes API calls through your frontend domain, avoiding CORS issues.

### Updated Configuration

**vercel.json** now includes:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://delivery-backend-jade.vercel.app/api/:path*"
    }
  ]
}
```

### Environment Variable Update

Update your `REACT_APP_API_URL` in Vercel to:
```
REACT_APP_API_URL=https://delivery.davidharton.online
```

### How It Works

1. Frontend makes request to: `https://delivery.davidharton.online/api/users/login`
2. Vercel proxy forwards it to: `https://delivery-backend-jade.vercel.app/api/users/login`
3. Response comes back through the same proxy
4. No CORS issues because the request appears to come from the same origin

## Steps to Deploy

1. **Update the environment variable** in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Set `REACT_APP_API_URL` to `https://delivery.davidharton.online`

2. **Redeploy the frontend** - the new `vercel.json` configuration will be applied

3. **Test the login** - it should now work without CORS errors

## Alternative Solution (Backend CORS Configuration)

If you prefer to fix this on the backend side, the backend needs to include these headers:

```
Access-Control-Allow-Origin: https://delivery.davidharton.online
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

But the proxy solution is simpler and doesn't require backend changes. 