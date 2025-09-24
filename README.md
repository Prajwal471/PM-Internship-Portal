# PM Internship Recommendation Engine

An AI-assisted internship recommendation prototype for the PM Internship Scheme. It suggests 3–5 relevant internships per candidate using simple, explainable rules based on profile inputs (education, skills, sectors, location). The UI is mobile-first, bilingual (English/Hindi), and designed for low digital literacy.

## Highlights

- Secure email/password authentication (NextAuth credentials, JWT sessions)
- Guided profile capture: education, skills, sector interests, location, language
- Rule-based, ML-light recommendations with short “why” reasons
- Optional AI (Gemini) only for generating skill-test questions; safe static fallback
- Mobile-first UX with simple cards and visual cues

## Tech Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS 4
- MongoDB + Mongoose
- NextAuth.js (credentials)
- Optional: Google Gemini API (@google/generative-ai)

## Getting Started

1. Install dependencies
   - npm install
2. Create `.env.local`
   - MONGODB_URI=your_MongoDB_Url
   - GEMINI_API_KEY=your_gemini_api_key_here (optional)
   - NEXTAUTH_SECRET=your_nextauth_secret_here
   - NEXTAUTH_URL=http://localhost:3000
3. Run the app
   - npm run dev

## Usage Flow

- Register or sign in
- Complete profile (education, skills, sectors, location)
- Optionally take a short skill test (5 questions)
- View 3–5 recommendations with match scores and reasons

## Key API Endpoints

- Auth: `/api/auth/[...nextauth]`, `/api/auth/register`
- Me/Profile: `/api/user`, `/api/profile`
- Test: `/api/test/questions`, `/api/test/submit`
- Recommendations: `/api/recommendations`
- Internship details: `/api/internships/[id]`

## Data Model (User)

- Identity: email, name, password (bcrypt hashed)
- Profile: education { level, field, institution, year }, skills[], interestedSectors[], location { state, district, pincode }, language
- Assessment: skillTestCompleted, skillTestScore, testHistory[]
- Meta: profileCompleted, timestamps

## Recommendation Logic (ML-light)

Scoring combines:
- skills overlap (major weight)
- sector alignment
- education requirement match
- location preference
- test score signal (if available)
- posting recency

Returns top 3–5 internships with score and brief reasons.

## Project Structure

```
src/
  app/
    api/              # API routes (auth, profile, test, recommendations, internships)
    auth/             # signin/register pages
    dashboard/        # recommendations UI
    profile/          # profile form
    test/             # skill test UI
    internship/[id]/  # internship details
  components/         # Navbar, Providers
  contexts/           # Language context
  data/               # internships.json (sample catalog)
  lib/                # mongodb connection helper
  models/             # User schema
  types/              # NextAuth types augmentation
middleware.ts         # route protection
```

## Environment Variables

| Variable | Description | Example |
|---------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/pm-internship |
| GEMINI_API_KEY | Google Gemini API key (optional) | AIza... |
| NEXTAUTH_SECRET | NextAuth encryption secret | generated-32-char-string |
| NEXTAUTH_URL | App base URL | http://localhost:3000 |

Security note: do not commit `.env.local`.

## Accessibility & Localization

- English/Hindi toggle via language context
- Large tap targets, minimal text, visual cues

## Limitations (MVP)

- Internship list is a static JSON; replace with a curated feed for production
- Rule-based ranking; consider learn-to-rank when usage data exists
- Skill test and anti-cheat are deterrents, not proctoring-grade

## License & Use

Functional prototype for the PM Internship Scheme. Perform security, privacy, and accessibility reviews before production deployment.


