# Seekers Entertainment - Auto-Deploy Setup

## Overview
This project is configured for automatic deployment on Vercel with auto-seeding database functionality. The system will automatically populate the MongoDB database with sample data on first deployment.

## Quick Deploy to Vercel

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/seekers-entertainment)

### Manual Deploy Steps

1. **Fork this repository** to your GitHub account

2. **Set up MongoDB Atlas**:
   - Create a MongoDB Atlas account at https://cloud.mongodb.com
   - Create a new cluster
   - Get your connection string
   - Whitelist Vercel IPs (0.0.0.0/0 for all IPs)

3. **Deploy to Vercel**:
   - Connect your GitHub account to Vercel
   - Import your forked repository
   - Configure environment variables:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/seekers-entertainment
JWT_SECRET=your-super-secret-jwt-key-here
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

4. **Deploy**: Click "Deploy" - the system will automatically:
   - Build the application
   - Deploy to Vercel
   - Auto-seed the database on first visit

## Environment Variables

Create these in your Vercel dashboard under Settings > Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key-minimum-32-chars` |
| `NEXT_PUBLIC_APP_URL` | Your deployed app URL | `https://your-app.vercel.app` |

## Auto-Seeding System

The project includes an intelligent auto-seeding system that:

### ✅ Features
- **Automatic Detection**: Checks if database is empty on deployment
- **Smart Seeding**: Only seeds if no data exists
- **Sample Data**: Includes packages, media, backgrounds, and contact inquiries
- **Production Ready**: Optimized for Vercel serverless environment
- **Error Handling**: Graceful fallbacks if seeding fails

### 🔧 Components
- `lib/db-seed.ts` - Core seeding logic
- `lib/seed-data.ts` - Sample data definitions
- `app/api/seed/route.ts` - Seeding API endpoint
- `middleware.ts` - Auto-seeding trigger
- `components/auto-seeder.tsx` - Client-side seeding component

### 📋 Seeded Data
The system automatically creates:
- **4 Entertainment Packages** (Birthday, Wedding, Corporate, Anniversary)
- **8 Media Files** (Images and videos)
- **6 Background Images** (Various event themes)
- **3 Sample Inquiries** (Contact form submissions)

## Manual Database Management

### Seed Database Manually
```bash
# Development
npm run seed

# Production (via API)
curl -X POST https://your-app.vercel.app/api/seed
```

### Reset Database
Access the admin panel at `/admin` (requires authentication) to manage data.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Tech Stack

- **Framework**: Next.js 14.2 with App Router
- **Database**: MongoDB Atlas with Mongoose
- **Styling**: Tailwind CSS + Radix UI
- **Animation**: Framer Motion
- **Authentication**: JWT
- **Deployment**: Vercel
- **Language**: TypeScript

## Project Structure

```
app/
├── api/                 # API routes
│   ├── auth/           # Authentication endpoints
│   ├── packages/       # Package management
│   ├── media/          # File upload/management
│   ├── contact/        # Contact form
│   └── seed/           # Database seeding
├── admin/              # Admin dashboard
└── (pages)/            # Public pages

components/
├── ui/                 # Reusable UI components
├── sections/           # Page sections
└── providers/          # Context providers

lib/
├── mongodb.ts          # Database connection
├── db-seed.ts          # Seeding logic
├── seed-data.ts        # Sample data
└── utils.ts            # Utilities
```

## Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Environment variables set in Vercel
- [ ] Repository connected to Vercel
- [ ] Domain configured (optional)
- [ ] SSL certificate enabled (automatic)
- [ ] Auto-seeding tested

## Support

If you encounter any issues during deployment:

1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Ensure MongoDB Atlas allows connections from Vercel
4. Test the `/api/seed` endpoint manually if needed

## Production URLs

After deployment, your app will be available at:
- **Main Site**: `https://your-app.vercel.app`
- **Admin Panel**: `https://your-app.vercel.app/admin`
- **API**: `https://your-app.vercel.app/api`

The system is now ready for production deployment with automatic database seeding! 🚀
