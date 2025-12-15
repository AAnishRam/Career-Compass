# Career Compass Backend

Backend API for Career Compass - AI-powered career guidance platform.

## Features

- 🔐 JWT Authentication
- 📄 Resume Upload (PDF & Text)
- 🤖 AI-Powered Job Analysis (Gemini API)
- 📊 Skills Management
- 💡 Personalized Recommendations
- 📈 Dashboard Statistics

## Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** NeonDB (Serverless PostgreSQL)
- **ORM:** Drizzle ORM
- **AI:** Google Gemini API
- **PDF Parsing:** PDF.js

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:

- `DATABASE_URL` - Your NeonDB connection string
- `GEMINI_API_KEY` - Your Google Gemini API key
- `JWT_SECRET` - A random secret string for JWT tokens

### 3. Setup NeonDB

1. Go to [Neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string (it looks like: `postgresql://user:password@host/database?sslmode=require`)
4. Paste it in your `.env` file as `DATABASE_URL`

### 4. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Paste it in your `.env` file as `GEMINI_API_KEY`

### 5. Generate Database Schema

```bash
npm run db:generate
```

### 6. Run Migrations

```bash
npm run db:migrate
```

### 7. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Resume

- `POST /api/resume/upload` - Upload PDF resume
- `POST /api/resume/text` - Add resume as text
- `GET /api/resume` - Get user's resumes
- `DELETE /api/resume/:id` - Delete resume

### Jobs

- `POST /api/jobs/analyze` - Analyze job posting
- `GET /api/jobs` - Get all job analyses
- `GET /api/jobs/:id` - Get specific job analysis
- `DELETE /api/jobs/:id` - Delete job analysis

### Skills

- `GET /api/skills` - Get all skills
- `POST /api/skills` - Add new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Recommendations

- `GET /api/recommendations` - Get all recommendations
- `GET /api/recommendations/:jobId` - Get recommendations for job

### Stats

- `GET /api/stats/dashboard` - Get dashboard statistics

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Project Structure

```
backend/
├── src/
│   ├── db/
│   │   ├── index.ts          # Database connection
│   │   ├── schema.ts         # Database schema
│   │   └── migrate.ts        # Migration runner
│   ├── middleware/
│   │   └── auth.ts           # JWT authentication
│   ├── routes/
│   │   ├── auth.ts           # Auth routes
│   │   ├── jobs.ts           # Job analysis routes
│   │   ├── resume.ts         # Resume routes
│   │   ├── skills.ts         # Skills routes
│   │   ├── recommendations.ts # Recommendations routes
│   │   └── stats.ts          # Statistics routes
│   ├── services/
│   │   ├── gemini.ts         # Gemini AI service
│   │   └── pdfParser.ts      # PDF parsing service
│   ├── utils/
│   │   └── auth.ts           # Auth utilities
│   └── index.ts              # Main server file
├── drizzle/                  # Generated migrations
├── .env.example              # Environment template
├── package.json
└── tsconfig.json
```

## License

MIT
