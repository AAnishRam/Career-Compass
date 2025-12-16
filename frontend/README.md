# Career Compass

**Career Compass** is an intelligent, AI-powered career guidance platform designed to bridge the gap between your conceptual skills and market realities. By leveraging the power of Google's Gemini AI, it analyzes job postings in depth, matches them against your resume, and provides actionable, personalized insights to help you navigate your professional journey with confidence.

## Why Career Compass?

In today's competitive job market, keyword matching isn't enough. Career Compass goes beyond simple syntax checking:

- **Semantic Understanding**: We use advanced AI to understand the _context_ of your skills, not just the keywords.
- **Gap Analysis**: identifies exactly what skills you're missing for your dream job and suggests how to acquire them.
- **Privacy First**: Your data is yours. We prioritize security and privacy in every interaction.

## ✨ Key Features

### 🎯 Smart Job Analysis

Stop guessing what recruiters want. Our Gemini-powered engine breaks down job descriptions into:

- **Core Technical Requirements**: The must-have hard skills.
- **Soft Skills**: The interpersonal traits that make you a culture fit.
- **Educational & Experience Expectations**: Clear breakdown of prerequisites.

### 📄 AI Resume Matching

Upload your resume and get an instant, scored compatibility report for any job posting.

- **Detailed Scoring**: 0-100% match score based on semantic relevance.
- **Missing Skills Highlight**: Instantly see which critical skills are missing from your profile.
- **Improvement Suggestions**: Actionable advice on how to tailor your resume for specific roles.

### 💡 Personalized Career Insights

- **Skill Gap Visualization**: Interactive charts showing where you stand vs. market demands.
- **Learning Recommendations**: Curated resources to fill your identified skill gaps.
- **Trend Analysis**: (Coming Soon) Insights into emerging skills in your industry.

## 🛠️ Technology Stack

Built with a modern, high-performance frontend architecture:

- **Core**: [React](https://react.dev/) (v18), [TypeScript](https://www.typescriptlang.org/)
- **Build System**: [Vite](https://vitejs.dev/) for lightning-fast HMR and building.
- **Styling & UI**:
  - [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
  - [shadcn/ui](https://ui.shadcn.com/) for accessible, beautiful components.
  - [Lucide React](https://lucide.dev/) for consistent iconography.
- **State & Data**: [TanStack Query](https://tanstack.com/query/latest) for robust server-state management.
- **Routing**: [React Router](https://reactrouter.com/) (v6).
- **Visualization**: [Recharts](https://recharts.org/) for data-rich dashboards.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <YOUR_GIT_URL>
   cd Career-Compass/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

## available Scripts

- `npm run dev` - Start the development server.
- `npm run build` - Check types and build for production.
- `npm run lint` - Run ESLint to catch code issues.
- `npm run preview` - Preview the production build locally.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components (buttons, cards, layout)
│   ├── pages/          # Full page components (Dashboard, Analysis, Skills)
│   ├── lib/            # Utilities (API clients, formatters)
│   ├── hooks/          # Custom React hooks
│   └── main.tsx        # Entry point
├── public/             # Static assets
└── index.html          # HTML entry
```
