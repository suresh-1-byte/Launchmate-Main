# 🚀 LaunchMate Deployment Guide

LaunchMate is a production-ready LinkedIn + Udemy + AI Mentor platform for students and freshers. Follow these steps to set up and deploy the application.

## 🛠️ Environment Variables
Create a `.env` file in the root directory (one has been created for you) with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/launchmate?schema=public"
JWT_SECRET="your-super-secret-key"
NEXT_PUBLIC_API_URL="http://localhost:3000"

# External APIs
ADZUNA_APP_ID="your_adzuna_app_id"
ADZUNA_APP_KEY="your_adzuna_app_key"
OPENAI_API_KEY="your_openai_api_key"
```

## 📦 Local Setup
1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Migration**:
   ```bash
   npx prisma db push
   ```

3. **Seed Database** (Optional but recommended for demo):
   ```bash
   npx prisma db seed
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🚀 Production Build
1. **Build the Application**:
   ```bash
   npm run build
   ```

2. **Start Production Server**:
   ```bash
   npm start
   ```

## 🌐 Hosting Options
### 1. Vercel (Recommended for Frontend)
- Connect your GitHub repository to Vercel.
- Vercel will automatically detect Next.js.
- Add your environment variables in the Vercel dashboard.
- Note: You will need a hosted PostgreSQL database (e.g., Supabase, Railway, Neon).

### 2. Railway / Render (Full Stack)
- Good for hosting both the Next.js app and the PostgreSQL database.
- Use the provided `Dockerfile` (if added) or Nixpacks.

## 📁 Folder Structure
- `/src/app`: Next.js App Router pages and API routes.
- `/src/components`: Reusable UI components.
- `/src/lib`: Shared utilities (auth, prisma, api helpers).
- `/prisma`: Database schema and seed script.

## 🤖 AI Mentor & Jobs API
- **AI Mentor**: Uses OpenAI GPT-3.5 by default. If no key is provided, it falls back to an intelligent template-based system for a working demo.
- **Jobs API**: Uses Adzuna India API. Search "software developer" or specific companies like "Infosys" to see live results.

---
**LaunchMate** — Built for the next generation of tech talent.
