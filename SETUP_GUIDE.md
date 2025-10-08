# AI Flashcards App - Setup Guide

This guide will help you get the AI flashcards application running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher
- **PostgreSQL** 14.x or higher
- **npm** or **yarn** package manager
- **OpenAI API Key** (get one at https://platform.openai.com)

## Step 1: Clone and Install Dependencies

```bash
# Navigate to the project directory
cd /path/to/quizlet

# Install dependencies
npm install
```

## Step 2: Setup PostgreSQL Database

### Option A: Local PostgreSQL

1. Install PostgreSQL if you haven't already
2. Create a new database:

```sql
CREATE DATABASE flashcards;
```

3. Note your connection details (host, port, username, password)

### Option B: Cloud PostgreSQL (Recommended for beginners)

Use a cloud provider like:
- **Supabase** (https://supabase.com) - Free tier available
- **Neon** (https://neon.tech) - Free tier available
- **Railway** (https://railway.app) - Free tier available

## Step 3: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Open `.env` and fill in your values:

```env
# Database URL format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://postgres:password@localhost:5432/flashcards"

# Next.js URL (use http://localhost:3000 for development)
NEXTAUTH_URL="http://localhost:3000"

# Generate a secure secret (run: openssl rand -base64 32)
NEXTAUTH_SECRET="your-generated-secret-here"

# Your OpenAI API key from https://platform.openai.com
OPENAI_API_KEY="sk-your-api-key-here"
```

### Generating NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

## Step 4: Setup Database Schema

Run Prisma migrations to create all necessary tables:

```bash
npx prisma migrate dev --name init
```

This will:
- Create all database tables
- Generate the Prisma client
- Set up relationships and indexes

## Step 5: (Optional) Seed Sample Data

If you want to start with sample data, you can create a seed script or manually add data through the UI after starting the app.

## Step 6: Start the Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`

## Step 7: Create Your First Account

1. Navigate to `http://localhost:3000`
2. Click "Sign up" or go to `/register`
3. Enter your details and create an account
4. You'll be redirected to login
5. After logging in, you'll see the dashboard

## Common Issues & Solutions

### Issue: Database Connection Error

**Error:** `Can't reach database server`

**Solution:**
- Verify your PostgreSQL server is running
- Check your DATABASE_URL in `.env`
- Ensure the database exists
- Check firewall/network settings

### Issue: Prisma Client Error

**Error:** `@prisma/client did not initialize yet`

**Solution:**
```bash
npx prisma generate
```

### Issue: OpenAI API Error

**Error:** `Invalid API key`

**Solution:**
- Verify your OPENAI_API_KEY in `.env`
- Make sure it starts with `sk-`
- Check if the key has sufficient credits
- Ensure you're using a valid GPT-5 model key

### Issue: Port 3000 Already in Use

**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

## Production Deployment

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="different-secret-for-production"
OPENAI_API_KEY="sk-your-api-key"
```

### Build for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Recommended Hosting Platforms

- **Vercel** (https://vercel.com) - Best for Next.js, easy deployment
- **Railway** (https://railway.app) - Includes database hosting
- **Render** (https://render.com) - Free tier available
- **DigitalOcean** (https://digitalocean.com) - More control, requires setup

## Using the Application

### 1. Create a Deck

1. Go to "Decks" from the sidebar
2. Click "New Deck"
3. Enter a name, description, and choose a color
4. Click "Create Deck"

### 2. Generate Flashcards with AI

1. Click "Generate" from the sidebar OR click "Add Cards with AI" from a deck
2. Either paste text or upload a .txt or .md file
3. Choose "Auto" to let AI decide card count, or "Manual" to specify
4. Click "Generate Flashcards"
5. Wait for AI to create your cards (usually 5-30 seconds)

### 3. Study Your Cards

1. Open a deck that has cards
2. Click "Study" if there are due cards
3. Read the question, click to flip the card
4. Rate your recall:
   - **Again**: Didn't remember (< 1 min)
   - **Hard**: Remembered with difficulty (< 6 min)
   - **Good**: Remembered correctly (~10 min)
   - **Easy**: Very easy to remember (4 days)

### 4. Understanding Spaced Repetition

The app uses the SM-2 algorithm to schedule reviews:
- New cards start with a 1-day interval
- Correct answers increase the interval
- Incorrect answers reset the interval
- The more times you get it right, the longer until next review

## API Endpoints

If you want to integrate with the API:

- `POST /api/auth/register` - Create new user
- `POST /api/auth/[...nextauth]` - Authentication
- `GET /api/decks` - List all decks
- `POST /api/decks` - Create new deck
- `POST /api/generate/flashcards` - Generate flashcards with AI
- `POST /api/study/review` - Submit a card review
- `POST /api/flashcards/[cardId]/explanation` - Get AI explanation

## Development Tips

### Watch Database Changes

```bash
npx prisma studio
```

This opens a GUI to view and edit your database.

### Check Logs

The application logs to the console. Keep your terminal open to see:
- API requests
- Database queries (in development)
- Errors and warnings

### Reset Database

If you need to start fresh:

```bash
npx prisma migrate reset
```

⚠️ This will delete all data!

## Getting Help

If you encounter issues:

1. Check the [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for known limitations
2. Review error messages in the terminal
3. Check the browser console for frontend errors
4. Verify all environment variables are set correctly

## Next Steps

- Explore the dashboard to see your study statistics
- Try uploading different types of content to see how AI generates cards
- Experiment with study sessions to see spaced repetition in action
- Check the [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for planned features

Enjoy learning with AI-powered flashcards! 🎓✨

