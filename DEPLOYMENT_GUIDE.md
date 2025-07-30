# Seeker's Entertainment - Project Architecture & Deployment Guide

## 🏗️ Project Architecture

### **Technology Stack**

#### **Frontend Framework**
- **Next.js 14.2.16** - React framework with App Router
- **React 18** - UI library with modern hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development

#### **Styling & UI**
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Headless UI component library for accessibility
- **Framer Motion** - Animation and gesture library
- **Shadcn/ui** - Pre-built component system
- **Lucide React** - Modern icon library

#### **Database & Backend**
- **MongoDB Atlas** - Cloud database service
- **Mongoose 8.16.5** - MongoDB object modeling
- **Next.js API Routes** - Serverless API endpoints

#### **Authentication & Security**
- **JSON Web Tokens (JWT)** - Authentication tokens
- **Zod** - TypeScript-first schema validation

#### **Forms & Validation**
- **React Hook Form** - Performant forms with easy validation
- **Hookform Resolvers** - Validation library integration

#### **File Handling**
- **Custom Upload System** - File upload with validation
- **Image Optimization** - Next.js Image component integration

#### **Development Tools**
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### **Project Structure**
```
seekers-entertainment/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (serverless functions)
│   │   ├── admin/         # Admin-specific endpoints
│   │   ├── auth/          # Authentication endpoints
│   │   ├── backgrounds/   # Background management
│   │   ├── contact/       # Contact form handling
│   │   ├── media/         # Media upload/management
│   │   ├── packages/      # Package CRUD operations
│   │   └── upload/        # File upload handling
│   ├── admin/             # Admin dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── ui/               # Shadcn/ui components
│   ├── sections/         # Page sections (hero, services, etc.)
│   └── providers/        # Context providers
├── lib/                  # Utility functions and configurations
│   ├── models/           # Database models
│   ├── mongodb.ts        # Database connection
│   ├── utils.ts          # Utility functions
│   ├── seed-data.ts      # Seed data definitions
│   └── db-seed.ts        # Database seeding logic
├── models/               # Mongoose models
├── public/               # Static assets
├── hooks/                # Custom React hooks
└── scripts/              # Build and deployment scripts
```

### **Database Schema**

#### **Collections:**
1. **packages** - Service packages with pricing
2. **inquiries** - Customer contact forms
3. **media** - Uploaded images/videos
4. **backgrounds** - Section background images
5. **users** - Admin authentication (if implemented)

### **API Architecture**
- **RESTful API** design using Next.js API routes
- **Serverless functions** deployed automatically with Vercel
- **MongoDB Atlas** for data persistence
- **JWT-based authentication** for admin features

## 🚀 Vercel Deployment Guide

### **Prerequisites**
1. GitHub repository with your code
2. Vercel account (free tier available)
3. MongoDB Atlas account and database

### **Step 1: Prepare Your Project**

1. **Update environment variables for production:**
   Create a `.env.example` file:
   ```bash
   # MongoDB Connection
   MONGODB_URI=your_mongodb_connection_string
   
   # JWT Secret for authentication
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
   
   # Next.js
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-nextauth-secret-key-minimum-32-characters
   
   # File Upload Settings
   MAX_FILE_SIZE=52428800
   UPLOAD_DIR=./public/uploads
   
   # Auto-seeding (optional)
   AUTO_SEED_DATABASE=true
   CLEAR_DB_ON_SEED=false
   ```

2. **Update MongoDB connection** in `lib/mongodb.ts`:
   ```typescript
   const MONGODB_URI = process.env.MONGODB_URI
   
   if (!MONGODB_URI) {
     throw new Error('Please define the MONGODB_URI environment variable')
   }
   ```

### **Step 2: Optimize for Vercel**

1. **Update `next.config.mjs`:**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     eslint: {
       ignoreDuringBuilds: true,
     },
     typescript: {
       ignoreBuildErrors: false, // Enable for production
     },
     images: {
       unoptimized: true,
       domains: ['your-domain.vercel.app'], // Add your domain
     },
     // Enable static exports if needed
     output: 'standalone', // For better performance
   }
   
   export default nextConfig
   ```

2. **Add `vercel.json` configuration:**
   ```json
   {
     "functions": {
       "app/api/**/*.ts": {
         "maxDuration": 30
       }
     },
     "regions": ["fra1"],
     "env": {
       "MONGODB_URI": "@mongodb-uri",
       "JWT_SECRET": "@jwt-secret",
       "NEXTAUTH_SECRET": "@nextauth-secret"
     }
   }
   ```

### **Step 3: Deploy to Vercel**

#### **Option A: GitHub Integration (Recommended)**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Configure environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Strong secret key (min 32 chars)
     - `NEXTAUTH_SECRET`: Strong secret key (min 32 chars)
     - `AUTO_SEED_DATABASE`: `true` (for auto-seeding)

3. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

#### **Option B: Vercel CLI**

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login and deploy:**
   ```bash
   vercel login
   vercel --prod
   ```

### **Step 4: Configure Auto-Seeding**

Create an API endpoint that automatically seeds the database on first deployment:

```typescript
// app/api/seed/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { seedDatabaseIfNeeded } from '@/lib/db-seed'

export async function POST(request: NextRequest) {
  try {
    // Add basic security
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.SEED_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await seedDatabaseIfNeeded()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}

// Auto-seed on GET for build-time seeding
export async function GET() {
  if (process.env.AUTO_SEED_DATABASE === 'true') {
    try {
      const result = await seedDatabaseIfNeeded()
      return NextResponse.json(result)
    } catch (error) {
      console.error('Auto-seeding failed:', error)
      return NextResponse.json(
        { error: 'Auto-seeding failed' },
        { status: 500 }
      )
    }
  }
  
  return NextResponse.json({ message: 'Auto-seeding disabled' })
}
```

### **Step 5: Post-Deployment Configuration**

1. **Custom Domain (Optional):**
   - Add your custom domain in Vercel dashboard
   - Update `NEXTAUTH_URL` environment variable

2. **Performance Monitoring:**
   - Enable Vercel Analytics
   - Set up error tracking

3. **Security Headers:**
   Add to `next.config.mjs`:
   ```javascript
   const nextConfig = {
     // ... other config
     async headers() {
       return [
         {
           source: '/(.*)',
           headers: [
             {
               key: 'X-Frame-Options',
               value: 'DENY',
             },
             {
               key: 'X-Content-Type-Options',
               value: 'nosniff',
             },
             {
               key: 'Referrer-Policy',
               value: 'origin-when-cross-origin',
             },
           ],
         },
       ]
     },
   }
   ```

### **Step 6: Database Auto-Seeding Setup**

The auto-seeding will happen automatically on first deployment when `AUTO_SEED_DATABASE=true`. The system will:

1. Check if database is already seeded
2. If not, populate with initial data:
   - Sample packages
   - Media placeholders
   - Background configurations
   - Sample inquiries

### **Environment Variables for Production**

Set these in Vercel dashboard under Project Settings > Environment Variables:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secure-secret-key-minimum-32-characters-long
NEXTAUTH_SECRET=another-super-secure-secret-key-minimum-32-characters
AUTO_SEED_DATABASE=true
CLEAR_DB_ON_SEED=false
MAX_FILE_SIZE=52428800
```

### **Deployment Features**

✅ **Automatic deployments** from GitHub  
✅ **Serverless API routes**  
✅ **Edge functions** for optimal performance  
✅ **Global CDN** for static assets  
✅ **Automatic HTTPS** with SSL certificates  
✅ **Preview deployments** for branches  
✅ **Database auto-seeding** on first deployment  

### **Performance Optimizations**

- **Image optimization** with Next.js Image component
- **Static generation** where possible
- **Code splitting** for better load times
- **CDN delivery** for global performance
- **Serverless functions** for scalability

This architecture provides a robust, scalable, and modern web application ready for production deployment on Vercel with automatic database seeding capabilities.
