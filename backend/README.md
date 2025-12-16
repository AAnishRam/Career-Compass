# Career Compass Backend

The robust, AI-driven backend API for the Career Compass platform. This service handles the complex logic of resume parsing, job analysis, and intelligent matching, serving as the bridge between user data and our AI models.

## 🌟 Unique Value Propositions

- **AI-Native Architecture**: Built from the ground up to integrate with Large Language Models (LLMs), specifically Google's Gemini Pro, for nuanced text understanding.
- **Serverless Database**: Utilizes NeonDB (PostgreSQL) for scalable, serverless data management.
- **Secure & Private**: Implements industry-standard security practices including JWT authentication and secure password hashing.

## ✨ Key Features

### 🔐 Secure Identity Management

- **JWT Authentication**: Stateless, secure user sessions.
- **Bcrypt Hashing**: Industry-standard password encryption.
- **Rate Limiting**: Protection against brute-force and DDoS attacks.

### 🤖 AI Engine (Google Gemini)

- **Deep Contextual Analysis**: Uses Gemini Pro to "read" job descriptions like a human recruiter would.
- **Semantic Matching**: Matches resumes to jobs based on meaning, not just keywords.
- **Prompt Engineering**: Custom-tuned prompts to extract structured JSON data from unstructured text.

### 📄 Document Processing

- **PDF Parsing**: Robust PDF text extraction using `pdfjs-dist`.
- **Intelligent Formatting**: Cleans and normalizes text for optimal AI processing.

### 📊 Data Management

- **Skills Tracking**: Dynamic CRUD operations for user skills.
- **Historical Analysis**: Stores and retrieves past job analyses for progress tracking.

## 🏗️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) with [TypeScript](https://www.typescriptlang.org/) for type safety.
- **Framework**: [Express.js](https://expressjs.com/) for RESTful API routing.
- **Database**: [NeonDB](https://neon.tech/) (Serverless PostgreSQL).
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) for type-safe database queries.
- **AI Model**: [Google Gemini API](https://ai.google.dev/) (generative-ai).
- **Validation**: [Zod](https://zod.dev/) for strict runtime schema validation.

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

**Required Variables:**

- `DATABASE_URL`: Your NeonDB connection string.
- `GEMINI_API_KEY`: API key from [Google AI Studio](https://makersuite.google.com/app/apikey).
- `JWT_SECRET`: Secure random string for token signing.
- `PORT`: (Optional) Server port, defaults to 3000.

### 3. Database Setup

We use Drizzle Kit for database migrations.

**Generate Migrations:**

```bash
npm run db:generate
```

**Apply Migrations:**

```bash
npm run db:migrate
```

### 4. Start the Server

**Development Mode (Hot Reload):**

```bash
npm run dev
```

**Production Build:**

```bash
npm run build
npm start
```

## Project Structure

```
backend/
├── src/
│   ├── db/            # Database schema & connection
│   ├── middleware/    # Auth, Validation, Error handling
│   ├── routes/        # API Route definitions
│   ├── services/      # Business logic (Gemini, PDF Parser)
│   ├── utils/         # Helper functions
│   └── index.ts       # Application entry point
├── drizzle/           # Migration files
└── package.json
```
