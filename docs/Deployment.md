# Course Pulse Deployment Guide

## Overview

Course Pulse can be deployed to production environments using modern hosting platforms. This guide covers deployment strategies for Vercel, Railway, and self-hosted solutions.

## Environment Variables

### Production Requirements

Create a `.env.local` file with the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/dbname"

# Application Settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Optional: Analytics & Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_VERCEL_ANALYTICS=true
```

### Database Preparation

Choose one of the following database options:

#### Option 1: PostgreSQL Provider (Recommended)
- **Neon**: Serverless PostgreSQL (cloud.neon.tech)
- **Supabase**: PostgreSQL with built-in features
- **PlanetScale**: MySQL-compatible, but requires schema changes

#### Option 2: Railway PostgreSQL
Railway provides integrated PostgreSQL with the application.

#### Option 3: Self-hosted PostgreSQL
Standard PostgreSQL with connection string.

## Deployment Options

### Option 1: Vercel (Recommended)

#### Prerequisites
- Vercel account
- Domain name (optional)

#### Steps

1. **Connect GitHub Repository**
   ```bash
   # Push code to GitHub first
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to vercel.com
   - Import Project from GitHub
   - Connect repository `yourusername/Coursepluse`

3. **Configure Environment Variables**
   ```
   DATABASE_URL = postgresql://...
   NODE_ENV = production
   NEXT_PUBLIC_APP_URL = https://yourapp.vercel.app
   ```

4. **Database Migration**
   ```bash
   # Run in your local terminal
   npx prisma generate
   npx prisma db push
   ```

5. **First Data Import**
   ```bash
   # Upload sample file or use deployment hooks
   node scripts/importWaitlist.js cmswait_2025-11-23.txt
   ```

#### Vercel Features Used
- **Serverless Functions**: API routes automatically become functions
- **Edge Runtime**: Optimized performance
- **Automatic HTTPS**: SSL certificates included
- **Preview Deployments**: Test before production

### Option 2: Railway

#### Prerequisites
- Railway account (railway.app)

#### Steps

1. **Deploy from GitHub**
   - Connect GitHub repository
   - Railway automatically detects Next.js
   - Database plugin: Choose PostgreSQL

2. **Environment Configuration**
   ```bash
   # Railway will auto-populate DATABASE_URL for PostgreSQL plugin
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://yourproject.up.railway.app
   ```

3. **Database Setup**
   ```bash
   # Connect to Railway via CLI
   railway connect
   npx prisma generate
   npx prisma db push
   ```

4. **Custom Domain** (Optional)
   - Railway supports custom domains
   - Automatic SSL certificate generation

### Option 3: Docker Deployment

#### Prerequisites
- Docker and Docker Compose
- VPS with at least 2GB RAM

#### Docker Configuration

**Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/dashboard || exit 1

# Start the application
CMD ["npm", "start"]
```

**docker-compose.yml**
```yaml
version: '3.8'

services:
  coursepulse:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/coursepulse
      - NODE_ENV=production
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=coursepulse
      - POSTGRES_USER=coursepulse
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U coursepulse"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ssl_certs:/etc/nginx/ssl
    depends_on:
      - coursepulse
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:
  ssl_certs:
```

#### Nginx Configuration

**nginx.conf**
```nginx
events {
    worker_connections 1024;
}

http {
    upstream coursepulse_backend {
        server coursepulse:3000;
    }

    server {
        listen 80;
        server_name yourdomain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;

        # API endpoints
        location /api {
            proxy_pass http://coursepulse_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Frontend (served by Next.js)
        location / {
            proxy_pass http://coursepulse_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

#### Deployment Commands
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f coursepulse

# Stop deployment
docker-compose down
```

## Performance Optimization

### Database Optimization
```bash
# Analyze slow queries
npx prisma studio

# Add database indexes as needed
# File: prisma/migrations/20251123200000_add_indexes/migration.sql
CREATE INDEX idx_course_dept_wait ON Course(department, avg_wait_days);
CREATE INDEX idx_waitlist_created ON Waitlist(created_at);
```

### Application Caching
```javascript
// Example: API response caching
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET() {
  const data = await getDashboardData();
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300',
    },
  });
}
```

### Image Optimization
Course Pulse includes optimized static assets. Review `public/` folder for image optimization opportunities.

## Monitoring & Maintenance

### Health Checks
- **API Endpoint**: `/api/dashboard` serves as health check
- **Database**: Prisma connection tests
- **External**: Monitor external service dependencies

### Backup Strategy
```bash
# Database backups
pg_dump -h your_host -U your_user -d coursepulse > backup_$(date +%Y%m%d).sql

# Automated backups with cron
0 2 * * * pg_dump -h your_host -d coursepulse > /backups/backup_$(date +%Y%m%d_%H%M).sql
```

### Log Management
```javascript
// Centralized logging (recommend Winston or similar)
// Simple console logging for now
console.log('API Request:', { method, url, userAgent });
console.error('Error:', error.message, error.stack);
```

### Scaling Considerations

**Vercel Scaling**
- Functions auto-scale
- No configuration needed
- Global CDN included

**Railway Scaling**
- Auto-scale based on requests
- Pay-as-you-go pricing
- EU/US region options

**Docker Scaling**
```yaml
# Add to docker-compose.yml for horizontal scaling
services:
  coursepulse:
    scale: 3
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
```

## Security Checklist

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Database connection uses secure SSL
- [ ] Environment variables properly configured (no hardcoding)
- [ ] API endpoints protected (if needed for production)
- [ ] Input validation in import scripts
- [ ] Cross-Site Request Forgery protection
- [ ] Content Security Policy headers

## Troubleshooting Production Issues

### Common Deployment Issues

**Build Failures**
- Check Node.js version compatibility
- Verify all dependencies listed in package.json
- Check for TypeScript/ESLint errors

**Database Connection Issues**
- Verify DATABASE_URL format and credentials
- Check SSL requirements for production
- Test database connectivity: `prisma db push`

**Performance Problems**
- Enable query logging in Prisma
- Check for N+1 query problems
- Monitor database connection pool usage

**404 Errors**
- Verify API routes are correctly placed
- Check case sensitivity in file/folder names
- Test local vs production routing

## Continuous Integration

### GitHub Actions Workflow

**.github/workflows/deploy.yml**
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm run test

    - name: Build application
      run: npm run build

    - name: Deploy to Vercel
      run: npx vercel --prod --yes
```

## Cost Estimation

### Vercel Deployment
- **Free Tier**: Suitable for low-traffic academic use
- **Pro Plan**: $20/month for higher bandwidth
- **Team Plan**: Custom pricing for universities

### Railway Deployment
- **Starter Plan**: $5/month for PostgreSQL + minimal usage
- **Developer Plan**: $15/month for general use
- **Team Plan**: Custom pricing

### Self-hosted (VPS)
- **Basic VPS**: $10-20/month (AWS Lightsail, DigitalOcean, Linode)
- **PostgreSQL**: Included/u in hosting plans
- **SSL Certificate**: Let’s Encrypt (free)
- **Estimated Total**: $15-30/month

## Support & Maintenance

### Monitoring Dashboard Health
```bash
# Health check commands
curl https://yourdomain.com/api/dashboard
npx prisma studio
```

### Rollback Strategy
- Keep previous deployments accessible
- Migration rollback scripts for database changes
- Feature flags for gradual rollouts

### Documentation Updates
- Keep docs/ folder current with deployment changes
- API documentation in docs/API.md
- Environment-specific configuration notes

This deployment guide provides flexible options for universities and developers to deploy Course Pulse according to their infrastructure requirements and budget constraints.
