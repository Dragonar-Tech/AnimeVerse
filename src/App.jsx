import { useState, useCallback } from "react";
import SearchBar from "./components/SearchBar.jsx";
import AnimeCard from "./components/AnimeCard.jsx";
import AnimeModal from "./components/AnimeModal.jsx";
import Random from "./components/Random.jsx";
import Pagination from "./components/Pagination.jsx";
import SkeletonGrid from "./components/Skeleton.jsx";
import "./global.css";

const JIKAN = "https://api.jikan.moe/v4";

const SORT_OPTIONS = [
  { value: "score", label: "Highest Score" },
  { value: "score_asc", label: "Lowest Score" },
  { value: "title", label: "Title A–Z" },
  { value: "episodes", label: "Most Episodes" },
  { value: "popularity", label: "Popularity" },
];

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "TV", label: "TV" },
  { value: "Movie", label: "Movie" },
  { value: "OVA", label: "OVA" },
  { value: "ONA", label: "ONA" },
  { value: "Special", label: "Special" },
];

function sortList(list, sort) {
  const copy = [...list];
  switch (sort) {
    case "score": return copy.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    case "score_asc": return copy.sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
    case "title": return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "episodes": return copy.sort((a, b) => (b.episodes ?? 0) - (a.episodes ?? 0));
    case "popularity": return copy.sort((a, b) => (a.popularity ?? 9999) - (b.popularity ?? 9999));
    default: return copy;
  }
}

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [activeAnime, setActiveAnime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState("");
  const [sort, setSort] = useState("score");
  const [typeFilter, setTypeFilter] = useState("");
  const [pagination, setPagination] = useState({ current: 1, last: 1, total: 0 });
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const doSearch = useCallback(async (query, page = 1) => {
    setLoading(true);
    setError(null);
    setLastQuery(query);
    try {
      const params = new URLSearchParams({
        q: query,
        sfw: "true",
        page,
        limit: 20,
        ...(typeFilter && { type: typeFilter }),
      });
      const res = await fetch(`${JIKAN}/anime?${params}`);
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const sorted = sortList(data.data ?? [], sort);
      setAnimeList(sorted);
      setPagination({
        current: data.pagination?.current_page ?? 1,
        last: data.pagination?.last_visible_page ?? 1,
        total: data.pagination?.items?.total ?? 0,
      });
      if (!data.data?.length) showToast("No results found — try a different title");
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Failed to fetch. The Jikan API may be rate-limited — wait a moment and try again.");
        setAnimeList([]);
      }
    } finally {
      setLoading(false);
    }
  }, [sort, typeFilter]);

  const handlePageChange = (page) => {
    doSearch(lastQuery, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRandom = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${JIKAN}/random/anime`);
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setAnimeList([data.data]);
      setPagination({ current: 1, last: 1, total: 1 });
      setLastQuery("");
      showToast(`🎲 Rolled: ${data.data.title}`);
    } catch {
      setError("Couldn't fetch a random anime — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setAnimeList((prev) => sortList(prev, newSort));
  };

  const handleTypeChange = (newType) => {
    setTypeFilter(newType);
  };

  const filtered = typeFilter
    ? animeList.filter((a) => a.type === typeFilter)
    : animeList;

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="logo">Anime<span>Verse</span></div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          Powered by Jikan / MAL
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <h1 className="hero-title">Discover <span>Anime</span></h1>
        <p className="hero-sub">Search thousands of titles, find your next obsession</p>

        <SearchBar onSearch={doSearch} loading={loading} />
        <Random onRandom={handleRandom} loading={loading} />
      </section>

      {/* Error */}
      {error && (
        <div style={{ maxWidth: "600px", margin: "0 auto 1.5rem", padding: "0 2rem" }}>
          <div style={{
            background: "rgba(230,57,70,0.1)",
            border: "1px solid rgba(230,57,70,0.3)",
            borderRadius: "var(--radius-md)",
            padding: "0.85rem 1rem",
            fontSize: "0.85rem",
            color: "#f87171",
          }}>
            ⚠ {error}
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && filtered.length > 0 && (
        <div className="toolbar">
          <div className="results-info">
            {lastQuery
              ? <><strong>{pagination.total.toLocaleString()}</strong> results for "<strong>{lastQuery}</strong>"</>
              : <><strong>{filtered.length}</strong> title{filtered.length !== 1 ? "s" : ""}</>
            }
          </div>
          <div className="filter-row">
            <span className="filter-label">Sort:</span>
            <select
              className="select-styled"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <span className="filter-label">Type:</span>
            <select
              className="select-styled"
              value={typeFilter}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <SkeletonGrid count={12} />
      ) : filtered.length > 0 ? (
        <div className="anime-grid">
          {filtered.map((anime) => (
            <AnimeCard
              key={anime.mal_id}
              anime={anime}
              onClick={setActiveAnime}
            />
          ))}
        </div>
      ) : !error && (
        <div className="state-box">
          <div className="state-icon">🎌</div>
          <p>Your next favourite anime is waiting</p>
          <p className="state-hint">Search a title or hit "Surprise me" to get started</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && filtered.length > 0 && lastQuery && (
        <Pagination
          currentPage={pagination.current}
          lastPage={pagination.last}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modal */}
      {activeAnime && (
        <AnimeModal anime={activeAnime} onClose={() => setActiveAnime(null)} />
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

export default App;
