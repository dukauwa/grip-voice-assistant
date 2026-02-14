# Deployment Guide

This guide covers multiple deployment options for the Grip Voice Assistant.

## 🚀 Quick Deploy

### Option 1: Vercel (Recommended)

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dukauwa/grip-voice-assistant)

**Manual Deploy:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
# Set environment variables in Vercel dashboard
```

**Environment Variables:**
- Go to Project Settings > Environment Variables
- Add:
  - `VAPI_PUBLIC_KEY`
  - `VAPI_ASSISTANT_ID`

---

### Option 2: Netlify

**One-Click Deploy:**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/dukauwa/grip-voice-assistant)

**Manual Deploy:**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

**Environment Variables:**
- Go to Site settings > Environment variables
- Add your Vapi credentials

---

### Option 3: GitHub Pages

**Automated Deploy (GitHub Actions):**

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to main branch - automatic deployment!

**Manual Deploy:**

```bash
# Build
npm run build

# Deploy
npx gh-pages -d dist
```

---

### Option 4: Custom Server (VPS/Cloud)

**Using Node.js:**

```bash
# SSH into your server
ssh user@your-server.com

# Clone repository
git clone https://github.com/dukauwa/grip-voice-assistant.git
cd grip-voice-assistant

# Install dependencies
npm install

# Build
npm run build

# Serve with a static server
npm i -g serve
serve -s dist -p 3000
```

**Using Nginx:**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/grip-voice-assistant/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## ⚙️ Configuration

### Environment Variables

For production deployments, configure these variables:

```bash
VAPI_PUBLIC_KEY=your_public_key
VAPI_ASSISTANT_ID=your_assistant_id
NODE_ENV=production
```

### Build Configuration

**Vite Config (`vite.config.js`):**

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/', // Change if deploying to subdirectory
  build: {
    outDir: 'dist',
    sourcemap: false, // Enable for debugging
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['gsap'],
          vapi: ['@vapi-ai/web']
        }
      }
    }
  }
});
```

---

## 🔒 SSL/HTTPS

**Important:** Microphone access requires HTTPS!

### Free SSL Options:

1. **Vercel/Netlify:** Automatic SSL
2. **Let's Encrypt:** Free SSL certificates
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Get certificate
   sudo certbot --nginx -d your-domain.com
   ```
3. **Cloudflare:** Free SSL proxy

---

## 📊 Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build -- --mode production

# Check bundle visualization
npx vite-bundle-visualizer
```

### CDN Configuration

For better performance, use a CDN:

**Cloudflare:**
- Automatic caching
- DDoS protection
- Global distribution

**Configuration:**
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    }
  }
};
```

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working

- Check variable names (must start with `VITE_` in Vite)
- Restart dev server after adding variables
- Verify in deployment platform dashboard

### Microphone Not Working

- Ensure HTTPS is enabled
- Check browser permissions
- Test on supported browsers (Chrome, Edge, Safari)

### Assets Not Loading

- Check base path in `vite.config.js`
- Verify asset paths in HTML
- Check server routing configuration

---

## 📦 Docker Deployment

**Dockerfile:**

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and Run:**

```bash
# Build image
docker build -t grip-voice-assistant .

# Run container
docker run -p 80:80 grip-voice-assistant
```

---

## 🔄 CI/CD Pipeline

The included GitHub Actions workflow automatically:
- Runs on push to main
- Installs dependencies
- Builds the project
- Deploys to GitHub Pages

**Customize:**
Edit `.github/workflows/deploy.yml` for your needs.

---

## 📝 Post-Deployment Checklist

- [ ] SSL certificate is active
- [ ] Environment variables are set
- [ ] Microphone permissions work
- [ ] Theme switching works
- [ ] Animations are smooth
- [ ] Mobile responsiveness
- [ ] Cross-browser testing
- [ ] Performance metrics (Lighthouse)
- [ ] Error tracking setup (optional)
- [ ] Analytics setup (optional)

---

## 📞 Support

For deployment issues:
- Check [troubleshooting section](#-troubleshooting)
- Open an issue on GitHub
- Contact: dukauwa.du@gmail.com