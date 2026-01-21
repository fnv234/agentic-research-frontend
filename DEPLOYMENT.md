# Deployment Guide

Complete guide for deploying the Agentic Research Frontend to production.

## Pre-Deployment Checklist

- [ ] Backend API is running and accessible
- [ ] Environment variables are configured
- [ ] Code is tested locally
- [ ] Build completes without errors
- [ ] All dependencies are up to date
- [ ] No console errors in development

## Building for Production

### Step 1: Update Environment

Create `.env.production` or update `.env`:

```env
# Replace with your production backend URL
VITE_API_URL=https://your-backend-domain.com
```

### Step 2: Build

```bash
npm run build
```

This creates optimized files in the `dist/` directory:
- `dist/index.html` - Main HTML file
- `dist/assets/*.js` - JavaScript bundles
- `dist/assets/*.css` - CSS files

### Step 3: Verify Build

```bash
npm run preview
```

This starts a local server to test the production build at `http://localhost:4173`

## Deployment Options

### Option 1: Netlify (Recommended for Quick Setup)

**Advantages:**
- Free tier available
- Automatic deployments from Git
- Built-in SSL certificates
- Easy environment variables
- CDN included

**Steps:**

1. **Push to Git:**
```bash
git add .
git commit -m "Frontend ready for deployment"
git push origin main
```

2. **Connect to Netlify:**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Set Environment Variables:**
   - Go to Site settings → Build & deploy → Environment
   - Add `VITE_API_URL=https://your-backend-url.com`

4. **Deploy:**
   - Netlify automatically builds on every push to main

### Option 2: Vercel

**Advantages:**
- Optimized for React/Vite
- Serverless functions
- Preview deployments
- Easy rollbacks

**Steps:**

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Configure:**
   - Follow interactive prompts
   - Connect to Git repository
   - Set environment variables:
     - `VITE_API_URL=https://your-backend-url.com`

### Option 3: Docker Container

**Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Build
RUN npm run build

# Serve with simple HTTP server
FROM node:18-alpine
RUN npm install -g serve

WORKDIR /app
COPY --from=0 /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Build and Run:**

```bash
docker build -t agentic-research-frontend .
docker run -p 3000:3000 agentic-research-frontend
```

### Option 4: Traditional Web Server

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/agentic-research-frontend/dist;
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass https://your-backend-url.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Deploy:**

```bash
# Build
npm run build

# Copy to server
scp -r dist/* user@server:/var/www/agentic-research-frontend/

# Restart Nginx
ssh user@server 'sudo systemctl restart nginx'
```

#### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/agentic-research-frontend/dist

    <Directory /var/www/agentic-research-frontend/dist>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    ProxyPass /api http://your-backend-url.com
    ProxyPassReverse /api http://your-backend-url.com
</VirtualHost>
```

### Option 5: AWS S3 + CloudFront

1. **Build:**
```bash
npm run build
```

2. **Upload to S3:**
```bash
aws s3 sync dist/ s3://your-bucket-name/ --delete
```

3. **Configure CloudFront:**
   - Create distribution pointing to S3 bucket
   - Set default root object to `index.html`
   - Configure error pages to redirect to `index.html`

4. **Add Custom Domain:**
   - Point DNS to CloudFront distribution

### Option 6: GitHub Pages

Limited support for SPAs, but can work:

**Steps:**

1. **Update vite.config.js:**
```javascript
export default defineConfig({
  base: '/agentic-research-frontend/',
  // ... rest of config
})
```

2. **Add to package.json:**
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. **Deploy:**
```bash
npm run deploy
```

⚠️ **Note:** GitHub Pages has limitations with SPAs. Use one of the other options for better results.

## Production Configuration

### Environment Variables

```env
# Required
VITE_API_URL=https://your-production-backend.com

# Optional monitoring/analytics
VITE_SENTRY_DSN=https://your-sentry-dsn
VITE_GA_ID=UA-XXXXX-X
```

### CORS Configuration

Ensure backend allows requests from production domain:

```python
# Backend example (Flask)
CORS_ORIGINS = [
    'https://your-frontend-domain.com',
    'https://app.your-domain.com'
]
```

### SSL/HTTPS

- **Netlify/Vercel**: Automatic
- **Self-hosted**: Use Let's Encrypt
  ```bash
  certbot certonly --webroot -w /var/www/html -d your-domain.com
  ```
- **AWS**: Use AWS Certificate Manager

### Performance Optimization

1. **Enable Gzip Compression:**
   - Nginx: `gzip on;`
   - Apache: `mod_deflate` enabled

2. **Set Cache Headers:**
```nginx
# Assets with content hash (long cache)
location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML files (short cache or no cache)
location ~* \.html?$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

3. **Enable Minification:**
   - Already done by Vite build

4. **CDN Integration:**
   - Use CloudFlare, Cloudfront, or similar
   - Serves static assets from edge locations

## Monitoring & Logging

### Application Monitoring

```javascript
// Add to App.jsx for monitoring
if (import.meta.env.PROD) {
  // Sentry error tracking
  if (import.meta.env.VITE_SENTRY_DSN) {
    import('* @sentry/react').then(Sentry => {
      // Initialize Sentry
    });
  }
}
```

### Server Logs

Monitor access logs:
```bash
# Nginx
tail -f /var/log/nginx/access.log

# Apache
tail -f /var/log/apache2/access.log
```

### Frontend Errors

Check browser console for errors:
- Visit production site
- Open DevTools (F12)
- Check Console tab

## Rollback Procedure

### Netlify/Vercel
- Click "Previous Deployments"
- Select a previous build
- Click "Restore"

### Docker
```bash
# List images
docker images

# Run previous version
docker run -p 3000:3000 agentic-research-frontend:previous-tag
```

### S3/CloudFront
```bash
# Keep previous dist folder
aws s3 cp s3://your-bucket-name/dist-v1 . --recursive

# Restore from previous backup
aws s3 sync dist-v1 s3://your-bucket-name/dist --delete
```

## Troubleshooting Deployment

### Issue: Blank Page
- Check browser console for errors
- Verify `VITE_API_URL` in environment
- Ensure `index.html` is being served
- Clear browser cache

### Issue: API Not Reachable
- Verify backend is accessible from production domain
- Check CORS headers in backend
- Verify proxy configuration (if applicable)
- Check firewall rules

### Issue: Assets Not Loading
- Verify `dist/` folder contains files
- Check web server is configured correctly
- Verify file permissions (755 for dirs, 644 for files)
- Check base URL in vite.config.js

### Issue: Slow Performance
- Enable gzip compression
- Use CDN
- Optimize images
- Check API response times
- Monitor network in DevTools

### Issue: CORS Errors
- Add frontend domain to backend CORS_ORIGINS
- Verify headers in API responses
- Check proxy configuration

## Post-Deployment

1. **Test All Features:**
   - Create threshold
   - View analytics
   - Compare simulations
   - Check responsiveness on mobile

2. **Monitor:**
   - Check error logs
   - Monitor API response times
   - Track user sessions
   - Set up alerts

3. **Backup:**
   - Backup database
   - Archive deployment configs
   - Save environment variables securely

4. **Document:**
   - Record deployment date/version
   - Note any configuration changes
   - Update deployment runbooks

## Maintenance

### Regular Updates

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update major versions (carefully)
npm install package@latest
```

### Backup Schedule

- Daily: Database backups
- Weekly: Full system backups
- Monthly: Disaster recovery drill

### Monitoring Schedule

- Daily: Check error logs
- Weekly: Performance review
- Monthly: Security audit

---

**Deployment Guide** | Last Updated: January 20, 2026
