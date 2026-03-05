# Prepr — Weekly Meal Prep Planner

A single-purpose web app that generates a personalised weekly meal plan and exports it as a formatted `.docx` file.

Fill in a short form → get a structured plan → download a ready-to-use Word document.

---

## Features

- **Smart meal generation** — powered by Claude (Anthropic API)
- **Customisable preferences** — plan length (3/5/6 days), proteins, carbs, dietary restrictions, and flavour profile
- **Structured output** — each day includes macros, ingredients, cooking instructions, and a tonight's prep note
- **Sunday prep guide** — what to chop and pre-cook to set the week up
- **Full grocery list** — organised by category, ready to print or shop from
- **One-click `.docx` download** — professionally formatted, ready to use

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| AI | Anthropic API (claude-sonnet) |
| Docx | `docx` npm package |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/sahildeshp/Prepr.git
cd Prepr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Then add your Anthropic API key to `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Get a key at [console.anthropic.com](https://console.anthropic.com).

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
meal-prep-planner/
├── app/
│   ├── page.tsx                  # Home / form
│   ├── plan/
│   │   └── page.tsx              # Preview & edit plan
│   ├── api/
│   │   ├── generate/route.ts     # POST: call Claude, return plan JSON
│   │   └── download/route.ts     # POST: receive plan JSON, return .docx
│   └── layout.tsx
├── components/
│   ├── PlanForm.tsx
│   ├── PlanPreview.tsx
│   ├── DayCard.tsx
│   └── MacrosBar.tsx
├── lib/
│   ├── generatePlan.ts           # Claude API call + prompt construction
│   ├── buildDocx.ts              # Full .docx generation logic
│   └── types.ts                  # TypeScript types
└── .env.example
```

---

## Deployment

Deploy to Vercel in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Add `ANTHROPIC_API_KEY` as an environment variable in the Vercel dashboard before deploying.

---

## Roadmap

- **Phase 1** — Core flow: form → generate → preview → download *(in progress)*
- **Phase 2** — Editable meals: regenerate individual day cards before downloading
- **Phase 3** — Auth + saved plans (NextAuth + Supabase)
- **Phase 4** — Shareable plan links
