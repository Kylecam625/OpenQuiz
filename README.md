# AI Flashcards App

An AI-powered flashcard application built with Next.js, featuring intelligent card generation, spaced repetition, practice tests, and an Obsidian-like note-taking system.

## Features

- **AI Flashcard Generation**: Upload documents and generate flashcards using GPT-5
- **Spaced Repetition**: Intelligent study system using the SM-2 algorithm
- **Multiple Study Modes**: Flip cards, multiple choice, or type-in answers
- **On-Demand AI Explanations**: Get detailed explanations for any flashcard
- **Practice Tests**: AI-generated tests from your flashcard decks
- **Note-Taking**: Obsidian-style notes with Markdown and LaTeX support
- **Progress Tracking**: Dashboard with statistics and study streaks

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-5 (Responses API)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file based on `.env.example`:

\`\`\`
DATABASE_URL="postgresql://user:password@localhost:5432/flashcards"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
OPENAI_API_KEY="sk-your-openai-api-key"
\`\`\`

Generate a secure NEXTAUTH_SECRET:
\`\`\`bash
openssl rand -base64 32
\`\`\`

4. Setup the database:

\`\`\`bash
npx prisma migrate dev
\`\`\`

5. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
/app                    # Next.js app directory
  /(auth)              # Authentication pages
  /(main)              # Main application pages
  /api                 # API routes
/components            # React components
  /auth               # Authentication components
  /dashboard          # Dashboard widgets
  /decks              # Deck management
  /flashcards         # Flashcard components
  /study              # Study session components
  /practice           # Practice test components
  /notes              # Note-taking components
  /ui                 # shadcn/ui components
/lib                   # Utilities and configuration
  /ai                 # AI integration (OpenAI)
  /auth               # Auth configuration
  /db                 # Database client
  /spaced-repetition  # Study algorithm
  /utils              # Helper functions
/prisma               # Database schema
\`\`\`

## Key Features Explained

### AI Flashcard Generation

Upload documents (txt, md) and let GPT-5 generate flashcards automatically. You can specify the exact number of cards or let the AI decide based on content complexity.

### Spaced Repetition

The app uses the SM-2 algorithm to schedule card reviews at optimal intervals:
- **Again (1)**: Review immediately
- **Hard (2)**: Shorter interval
- **Good (3)**: Normal interval
- **Easy (4)**: Longer interval

### AI Explanations

Click on any flashcard to request an AI-generated explanation. Explanations are cached to save API costs.

### Practice Tests

Generate comprehensive tests from your decks with multiple question types:
- Multiple choice
- Short answer
- True/false

### Notes System

An Obsidian-inspired note-taking interface with:
- Folder organization
- Markdown support
- LaTeX math rendering
- Hierarchical structure

## Development

\`\`\`bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Update database schema
npx prisma migrate dev
\`\`\`

## License

MIT

