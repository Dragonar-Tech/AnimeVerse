# AnimeVerse 

A fast, modern anime discovery app built with React and the Jikan API. Search thousands of titles, explore details, and find your next obsession.

**Live Demo:** [https://anime-verse11-bm6jqejto-aryan-khandelwals-projects-da3a0729.vercel.app/](https://anime-verse11-five.vercel.app/)

---

## Features

- **Search** — find any anime by title with real-time results from MyAnimeList
- **Detail Modal** — click any card to see synopsis, score, rank, studio, genres, and more
- **Sort & Filter** — sort by score, title, episodes, or popularity; filter by type (TV, Movie, OVA, etc.)
- **Pagination** — browse all pages of search results
- **Surprise Me** — get a random anime recommendation instantly
- **Skeleton Loading** — smooth placeholder UI while data loads
- **Error Handling** — friendly messages when the API is unavailable

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite | Build tool & dev server |
| Jikan API v4 | Anime data (no API key needed) |
| CSS (custom) | Styling — no UI library |

---

## Getting Started

**Prerequisites:** Node.js 18+ installed ([nodejs.org](https://nodejs.org))

```bash
# 1. Clone the repo
git clone https://github.com/Dragonar-Tech/AnimeVerse.git
cd AnimeVerse

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## Project Structure

```
src/
├── App.jsx                  # Root component, state & API logic
├── global.css               # All styles
├── main.jsx                 # React entry point
└── components/
    ├── SearchBar.jsx        # Search input + button
    ├── Random.jsx           # Surprise me button
    ├── AnimeCard.jsx        # Individual anime card
    ├── AnimeModal.jsx       # Detail overlay
    ├── Pagination.jsx       # Page navigation
    └── Skeleton.jsx         # Loading placeholders
```

---

## API

This project uses [Jikan](https://jikan.moe/) — an unofficial MyAnimeList REST API. No authentication or API key is required.

Key endpoints used:

```
GET /v4/anime?q={query}&page={page}   — search
GET /v4/random/anime                  — random anime
```

> Jikan has a rate limit of ~3 requests/second. If you see errors, wait a moment and try again.

---

## Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

---
