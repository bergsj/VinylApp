# Vinyl App — Proxmox LXC Setup Guide

## 1. Create Debian LXC in Proxmox

- Template: Debian 12 (Bookworm)
- RAM: 2048 MB (4096 recommended)
- Disk: 30 GB
- Features: `keyctl=1,nesting=1` (required for Docker)

## 2. Install Docker in the LXC

```bash
apt update && apt install -y curl
curl -fsSL https://get.docker.com | sh
systemctl enable docker
```

## 3. Deploy the app

```bash
# Copy project files to the LXC (from your Windows machine)
scp -r . root@192.168.2.164:/opt/vinyl-app

# On the LXC
cd /opt/vinyl-app

# Create .env file
cp .env.example .env
nano .env   # Fill in NEXTAUTH_URL, NEXTAUTH_SECRET, S3_PUBLIC_URL

# Generate a secure secret
openssl rand -base64 32   # paste into NEXTAUTH_SECRET

# Start everything
docker compose up -d

# Run database migrations
docker compose exec app npx prisma migrate deploy

# Create your user account
docker compose exec app npx tsx scripts/create-user.ts you@example.com yourpassword
```

## 4. Set up Nginx reverse proxy

```bash
apt install -y nginx certbot python3-certbot-nginx

# Copy config
cp nginx/vinyl-app.conf /etc/nginx/sites-available/vinyl-app
ln -s /etc/nginx/sites-available/vinyl-app /etc/nginx/sites-enabled/
# Edit: replace your-domain.com with your actual domain
nano /etc/nginx/sites-available/vinyl-app

nginx -t && systemctl reload nginx

# Get SSL certificate
certbot --nginx -d your-domain.com
```

## 5. Install as PWA on your phone

1. Open the site in Safari (iOS) or Chrome (Android)
2. Tap Share → "Add to Home Screen"
3. The app installs like a native app with camera access

## MinIO admin console

- URL: http://<lxc-ip>:9001
- User: minioadmin / minioadmin  ← **change this in production!**

Create bucket `vinyl-covers` and set it to public read if you want cover images accessible without signed URLs.

## Updating

```bash
cd /opt/vinyl-app
git pull   # or copy new files
docker compose up -d --build
docker compose exec app npx prisma migrate deploy
```
