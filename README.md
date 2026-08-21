# AnimeVerse

A fast, modern anime discovery app built with React and the Kitsu API. Search thousands of anime titles, explore their details, and discover your next obsession.

**Live Demo:**https://anime-verse11-five.vercel.app/

---

## Features

- **Search** — search anime by title using the Kitsu API
- **Detail Modal** — click an anime card to view its synopsis, score, episodes, status, and other details
- **Sort** — sort results by highest score, lowest score, title, or number of episodes
- **Filter** — filter anime by type such as TV, Movie, OVA, ONA, and Special
- **Pagination** — browse through multiple pages of search results
- **Surprise Me** — get a randomly selected anime recommendation
- **Skeleton Loading** — displays loading placeholders while API data is being fetched
- **Error Handling** — displays a friendly message when the API request fails
- **Responsive UI** — works across desktop and mobile screen sizes

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | Building the user interface |
| Vite | Development server and production build tool |
| JavaScript | Application logic |
| Kitsu API | Anime data |
| CSS | Custom styling |
| Git & GitHub | Version control |
| Vercel | Deployment |

---

## How It Works

The application follows a simple client-side architecture:

```text
User
  ↓
SearchBar
  ↓
React App
  ↓
fetch()
  ↓
Kitsu REST API
  ↓
JSON Response
  ↓
Data Transformation
  ↓
React State
  ↓
AnimeCard / AnimeModal
