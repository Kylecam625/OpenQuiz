<div align="center">

# 🧠 OpenQuiz

### AI-Powered Intelligent Study Platform

Transform your learning with AI-generated flashcards, spaced repetition, and intelligent practice tests.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--5-412991?style=for-the-badge&logo=openai)](https://openai.com/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**OpenQuiz** is a next-generation study platform that leverages artificial intelligence to revolutionize how you learn. Whether you're a student preparing for exams, a professional mastering new skills, or a lifelong learner exploring new topics, OpenQuiz adapts to your learning style and pace.

### Why OpenQuiz?

- 🤖 **AI-First Approach**: Automatically generate high-quality flashcards from any text
- 🧪 **Science-Backed**: Implements the proven SM-2 spaced repetition algorithm
- 📊 **Data-Driven**: Track your progress with detailed analytics and insights
- 🎨 **Beautiful UI**: Modern, intuitive interface built with shadcn/ui
- 🔒 **Privacy-Focused**: Your data stays secure with industry-standard authentication

---

## ✨ Features

### 🎴 AI Flashcard Generation
Upload documents (`.txt`, `.md`) or paste your notes, and let GPT-5 create comprehensive flashcards automatically. Control the number of cards or let AI determine the optimal amount based on content complexity.

- **Smart Parsing**: Extracts key concepts and definitions
- **Context-Aware**: Understands relationships between topics
- **Customizable**: Add your own notes and preferences

### 🔄 Spaced Repetition System
Master any subject with our intelligent review scheduling based on the SM-2 algorithm. Cards appear at scientifically-proven optimal intervals to maximize retention.

- **Adaptive Scheduling**: Reviews adjust based on your performance
- **Four Rating Levels**: Again, Hard, Good, Easy
- **Progress Tracking**: See your mastery level for each deck

### 📝 Multiple Study Modes
Study your way with flexible learning modes:

- **Flip Cards**: Classic flashcard experience
- **Multiple Choice**: Test your recall with options
- **Type-In**: Practice active recall by typing answers

### 💡 On-Demand AI Explanations
Stuck on a concept? Get detailed, context-aware explanations for any flashcard with a single click. Explanations are intelligently cached to optimize performance and costs.

### 🎯 Practice Tests
Generate comprehensive tests from your flashcard decks with various question types:

- Multiple Choice Questions
- Short Answer Questions
- True/False Questions
- Detailed Answer Explanations
- Performance Analytics

### 📓 Obsidian-Style Notes
Powerful note-taking system inspired by Obsidian:

- **Markdown Support**: Format your notes beautifully
- **LaTeX Math**: Render complex mathematical equations
- **Hierarchical Organization**: Folders and nested notes
- **Bidirectional Links**: Connect related concepts (coming soon)

### 📊 Progress Dashboard
Track your learning journey with comprehensive analytics:

- Study streaks and consistency metrics
- Performance charts and trends
- Cards due for review
- Recent activity timeline

---

## 🎬 Demo

> 📸 *Screenshots coming soon*

**Try OpenQuiz:** [Live Demo](#) *(Coming Soon)*

### Quick Preview

1. **Generate Flashcards**: Upload your study material
2. **Study with Spaced Repetition**: Review cards at optimal intervals
3. **Take Practice Tests**: Test your knowledge
4. **Track Progress**: Monitor your improvement

---

## 🛠 Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library

### Backend
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Serverless API
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Reliable database
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication

### AI & Machine Learning
- **[OpenAI GPT-5](https://openai.com/)** - Advanced language model
- **Responses API** - Structured outputs
- **SM-2 Algorithm** - Spaced repetition logic

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14 or higher ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn** package manager
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### Step-by-Step Setup

1. **Clone the Repository**

```bash
git clone https://github.com/Kylecam625/OpenQuiz.git
cd OpenQuiz
```

2. **Install Dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure Environment Variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/openquiz"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key-here"
```

**Generate a secure NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

4. **Setup the Database**

Create your PostgreSQL database:

```bash
createdb openquiz
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

5. **Start the Development Server**

```bash
npm run dev
```

6. **Open Your Browser**

Navigate to [http://localhost:3000](http://localhost:3000) and start learning! 🚀

---

## 🚀 Usage

### Creating Your First Deck

1. **Sign Up / Log In** to your account
2. Navigate to **Decks** → **New Deck**
3. Give your deck a name and optional description
4. Choose a color and add tags

### Generating Flashcards with AI

1. Go to **Generate** tab
2. **Option 1**: Upload a document (`.txt` or `.md` file)
3. **Option 2**: Paste your text directly
4. Configure generation settings:
   - Number of cards (or let AI decide)
   - Allow external knowledge
   - Add custom notes/context
5. Click **Generate** and watch the magic happen! ✨
6. Preview and review your AI-generated cards
7. Cards are automatically saved to a new deck

### Studying with Spaced Repetition

1. Open a deck from your **Decks** page
2. Click **Study Now**
3. Review each card and rate your recall:
   - **Again (1)**: Didn't remember - see it soon
   - **Hard (2)**: Barely remembered - shorter interval
   - **Good (3)**: Remembered well - normal interval
   - **Easy (4)**: Very easy - longer interval
4. The algorithm automatically schedules your next review

### Taking Practice Tests

1. Go to **Practice** → **New Test**
2. Select one or more decks
3. Choose question types and count
4. Complete the test
5. Review your results and explanations

### Managing Notes

1. Navigate to **Notes** tab
2. Create folders to organize topics
3. Write notes in Markdown with LaTeX support
4. Link notes to related flashcard decks

---

## 📂 Project Structure

```
OpenQuiz/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (main)/                   # Main application
│   │   ├── dashboard/            # Dashboard & analytics
│   │   ├── decks/                # Deck management
│   │   │   ├── [deckId]/         # Individual deck pages
│   │   │   └── new/              # Create new deck
│   │   ├── flashcards/           # Flashcard management
│   │   ├── generate/             # AI generation interface
│   │   ├── notes/                # Note-taking system
│   │   ├── practice/             # Practice tests
│   │   └── settings/             # User settings
│   └── api/                      # API Routes
│       ├── auth/                 # Authentication endpoints
│       ├── decks/                # Deck CRUD
│       ├── flashcards/           # Flashcard CRUD
│       ├── generate/             # AI generation
│       ├── notes/                # Notes CRUD
│       ├── practice/             # Practice tests
│       ├── settings/             # User settings
│       └── study/                # Study session & reviews
├── components/                   # React Components
│   ├── auth/                     # Login/Register forms
│   ├── dashboard/                # Dashboard widgets
│   ├── decks/                    # Deck components
│   ├── flashcards/               # Flashcard display
│   ├── generate/                 # Generation UI
│   ├── layout/                   # Header, Sidebar
│   ├── notes/                    # Note editor
│   ├── practice/                 # Test components
│   ├── study/                    # Study session UI
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utilities & Configuration
│   ├── ai/                       # OpenAI integration
│   │   ├── flashcard-generator.ts
│   │   ├── test-generator.ts
│   │   ├── explanation-generator.ts
│   │   └── openai.ts
│   ├── auth/                     # NextAuth config
│   ├── db/                       # Prisma client
│   ├── spaced-repetition/        # SM-2 algorithm
│   ├── types/                    # TypeScript types
│   └── utils/                    # Helper functions
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Migration history
├── public/                       # Static assets
├── .env.example                  # Environment template
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## 📚 API Documentation

### Authentication

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Sign in (via NextAuth)

### Decks

- `GET /api/decks` - List all user decks
- `POST /api/decks` - Create new deck
- `GET /api/decks/[id]` - Get deck details
- `PUT /api/decks/[id]` - Update deck
- `DELETE /api/decks/[id]` - Delete deck

### Flashcards

- `GET /api/flashcards` - List flashcards
- `POST /api/flashcards` - Create flashcard
- `PUT /api/flashcards/[id]` - Update flashcard
- `DELETE /api/flashcards/[id]` - Delete flashcard
- `POST /api/flashcards/[id]/explanation` - Generate AI explanation

### AI Generation

- `POST /api/generate/flashcards` - Generate flashcards from text
- `POST /api/generate/practice-test` - Generate practice test

### Study

- `POST /api/study/session` - Start study session
- `POST /api/study/review` - Submit card review

### Practice Tests

- `GET /api/practice` - List all tests
- `POST /api/practice` - Create test
- `GET /api/practice/[id]` - Get test details
- `POST /api/practice/[id]/attempt` - Submit test attempt

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (if you haven't already)

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Environment Variables**
   - Add all variables from your `.env` file
   - Make sure to use a production PostgreSQL database

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be live in minutes!

### Deploy to Other Platforms

OpenQuiz can be deployed to any platform that supports Next.js:

- **Railway**: Easy PostgreSQL + Next.js deployment
- **Render**: Free tier available
- **DigitalOcean**: App Platform
- **AWS**: Amplify or EC2
- **Google Cloud**: Cloud Run

### Database Setup

For production, consider:
- **Vercel Postgres**: Integrated solution
- **Supabase**: Free PostgreSQL with great features
- **Railway**: Easy setup with automatic backups
- **AWS RDS**: Scalable and reliable

---

## 🤝 Contributing

We love contributions! Whether it's bug fixes, feature additions, or documentation improvements, all contributions are welcome.

### How to Contribute

1. **Fork the Repository**

2. **Create a Feature Branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make Your Changes**
   - Write clean, documented code
   - Follow the existing code style
   - Add tests if applicable

4. **Commit Your Changes**
```bash
git commit -m "Add amazing feature"
```

5. **Push to Your Fork**
```bash
git push origin feature/amazing-feature
```

6. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues

### Development Guidelines

- Use TypeScript for type safety
- Follow the existing file structure
- Write descriptive commit messages
- Update documentation for new features
- Test thoroughly before submitting

### Code Style

This project uses:
- **ESLint** for linting
- **Prettier** for formatting
- **TypeScript** for type checking

Run before committing:
```bash
npm run lint
```

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? We'd love to hear from you!

- **Bug Reports**: [Open an issue](https://github.com/Kylecam625/OpenQuiz/issues/new?template=bug_report.md)
- **Feature Requests**: [Open an issue](https://github.com/Kylecam625/OpenQuiz/issues/new?template=feature_request.md)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** for the incredible GPT-5 API
- **Vercel** for Next.js and hosting platform
- **shadcn** for the beautiful UI components
- **Piotr Woźniak** for the SM-2 algorithm
- The open-source community for inspiration

---

## 📞 Contact & Support

- **GitHub**: [@Kylecam625](https://github.com/Kylecam625)
- **Issues**: [GitHub Issues](https://github.com/Kylecam625/OpenQuiz/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Kylecam625/OpenQuiz/discussions)

---

<div align="center">

**Built with ❤️ by Kyle Camuti**

⭐ Star us on GitHub — it helps!

[⬆ Back to Top](#-openquiz)

</div>
