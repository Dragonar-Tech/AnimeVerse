import { useState, useCallback } from "react";

import SearchBar from "./components/SearchBar.jsx";
import AnimeCard from "./components/AnimeCard.jsx";
import AnimeModal from "./components/AnimeModal.jsx";
import Random from "./components/Random.jsx";
import Pagination from "./components/Pagination.jsx";
import SkeletonGrid from "./components/Skeleton.jsx";

import "./global.css";

// Kitsu API
const API = "https://kitsu.io/api/edge";

// Number of anime displayed per page
const ITEMS_PER_PAGE = 20;


// -----------------------------
// SORT OPTIONS
// -----------------------------

const SORT_OPTIONS = [
  { value: "score", label: "Highest Score" },
  { value: "score_asc", label: "Lowest Score" },
  { value: "title", label: "Title A–Z" },
  { value: "episodes", label: "Most Episodes" },
];


// -----------------------------
// TYPE OPTIONS
// -----------------------------

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "TV", label: "TV" },
  { value: "movie", label: "Movie" },
  { value: "OVA", label: "OVA" },
  { value: "ONA", label: "ONA" },
  { value: "special", label: "Special" },
];


// -----------------------------
// SORT FUNCTION
// -----------------------------

function sortList(list, sort) {
  const copy = [...list];

  switch (sort) {
    case "score":
      return copy.sort(
        (a, b) => (b.score ?? 0) - (a.score ?? 0)
      );

    case "score_asc":
      return copy.sort(
        (a, b) => (a.score ?? 0) - (b.score ?? 0)
      );

    case "title":
      return copy.sort(
        (a, b) => a.title.localeCompare(b.title)
      );

    case "episodes":
      return copy.sort(
        (a, b) => (b.episodes ?? 0) - (a.episodes ?? 0)
      );

    default:
      return copy;
  }
}


// -----------------------------
// CONVERT KITSU DATA
// -----------------------------
//
// Kitsu and Jikan have different
// response formats.
//
// This function converts Kitsu data
// into the format our existing
// AnimeCard and AnimeModal use.
//

function convertAnime(anime) {
  const data = anime.attributes;

  return {
    mal_id: anime.id,

    title:
      data.canonicalTitle ||
      data.titles?.en ||
      "Unknown Title",

    title_japanese:
      data.titles?.ja_jp || "",

    synopsis:
      data.synopsis ||
      "No synopsis available.",

    type:
      data.subtype || "Unknown",

    episodes:
      data.episodeCount || 0,

    // Kitsu rating is 0–100.
    // Convert it to 0–10.
    score:
      data.averageRating
        ? Number(data.averageRating) / 10
        : 0,

    status:
      data.status || "Unknown",

    images: {
      jpg: {
        image_url:
          data.posterImage?.large ||
          data.posterImage?.medium ||
          data.posterImage?.small ||
          "",
      },
    },

    aired: {
      from: data.startDate || null,
      to: data.endDate || null,
    },
  };
}


// -----------------------------
// APP
// -----------------------------

function App() {

  // Anime search results
  const [animeList, setAnimeList] = useState([]);

  // Anime selected for the modal
  const [activeAnime, setActiveAnime] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Error message
  const [error, setError] = useState(null);

  // Last search query
  const [lastQuery, setLastQuery] = useState("");

  // Current sorting method
  const [sort, setSort] = useState("score");

  // Current type filter
  const [typeFilter, setTypeFilter] = useState("");

  // Pagination information
  const [pagination, setPagination] = useState({
    current: 1,
    last: 1,
    total: 0,
  });

  // Toast message
  const [toast, setToast] = useState(null);


  // -----------------------------
  // SHOW TOAST
  // -----------------------------

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };


  // -----------------------------
  // SEARCH ANIME
  // -----------------------------

  const doSearch = useCallback(
    async (query, page = 1) => {

      if (!query.trim()) {
        return;
      }

      setLoading(true);
      setError(null);
      setLastQuery(query);

      try {

        // Calculate pagination offset.
        //
        // Page 1 = 0
        // Page 2 = 20
        // Page 3 = 40

        const offset =
          (page - 1) * ITEMS_PER_PAGE;


        // Build URL parameters

        const params = new URLSearchParams({
          "filter[text]": query,
          "page[limit]": ITEMS_PER_PAGE.toString(),
          "page[offset]": offset.toString(),
        });


        // Send GET request

        const response = await fetch(
          `${API}/anime?${params}`
        );


        // Check HTTP status

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status}`
          );
        }


        // Convert response to JSON

        const result = await response.json();


        // Convert Kitsu data into
        // our application's format

        let anime = (result.data || []).map(
          convertAnime
        );


        // Sort results

        anime = sortList(anime, sort);


        // Store anime in React state

        setAnimeList(anime);


        // Get total number of results

        const total =
          result.meta?.count || 0;


        // Calculate total pages

        const lastPage =
          Math.max(
            1,
            Math.ceil(
              total / ITEMS_PER_PAGE
            )
          );


        setPagination({
          current: page,
          last: lastPage,
          total: total,
        });


        // No results

        if (anime.length === 0) {
          showToast(
            "No results found — try another title"
          );
        }

      } catch (err) {

        console.error(
          "Search error:",
          err
        );

        setError(
          "Failed to fetch anime. Please try again."
        );

        setAnimeList([]);

      } finally {

        setLoading(false);
      }
    },
    [sort]
  );


  // -----------------------------
  // CHANGE PAGE
  // -----------------------------

  const handlePageChange = (page) => {

    doSearch(lastQuery, page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // -----------------------------
  // RANDOM ANIME
  // -----------------------------

  const handleRandom = async () => {

    setLoading(true);
    setError(null);

    try {

      // Select a random page

      const randomPage =
        Math.floor(Math.random() * 20) + 1;


      const offset =
        (randomPage - 1) * ITEMS_PER_PAGE;


      const params = new URLSearchParams({
        "page[limit]":
          ITEMS_PER_PAGE.toString(),

        "page[offset]":
          offset.toString(),
      });


      // Request anime from Kitsu

      const response = await fetch(
        `${API}/anime?${params}`
      );


      if (!response.ok) {
        throw new Error(
          `API error: ${response.status}`
        );
      }


      const result = await response.json();


      const list = result.data || [];


      if (list.length === 0) {
        throw new Error(
          "No anime returned"
        );
      }


      // Select one anime randomly

      const randomAnime =
        list[
          Math.floor(
            Math.random() * list.length
          )
        ];


      // Convert the API response

      const anime =
        convertAnime(randomAnime);


      // Display the anime

      setAnimeList([anime]);


      // Reset pagination

      setPagination({
        current: 1,
        last: 1,
        total: 1,
      });


      // Clear search

      setLastQuery("");


      // Show toast

      showToast(
        `🎲 Rolled: ${anime.title}`
      );

    } catch (err) {

      console.error(
        "Random anime error:",
        err
      );

      setError(
        "Couldn't fetch a random anime. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };


  // -----------------------------
  // SORT CHANGE
  // -----------------------------

  const handleSortChange = (newSort) => {

    setSort(newSort);

    setAnimeList((previousList) =>
      sortList(
        previousList,
        newSort
      )
    );
  };


  // -----------------------------
  // TYPE FILTER CHANGE
  // -----------------------------

  const handleTypeChange = (newType) => {
    setTypeFilter(newType);
  };


  // -----------------------------
  // APPLY TYPE FILTER
  // -----------------------------

  const filtered =
    typeFilter
      ? animeList.filter(
          (anime) =>
            anime.type === typeFilter
        )
      : animeList;


  // -----------------------------
  // UI
  // -----------------------------

  return (
    <>
      {/* HEADER */}

      <header className="header">

        <div className="logo">
          Anime<span>Verse</span>
        </div>

        <div
          style={{
            fontSize: "0.78rem",
            color: "var(--text-muted)",
          }}
        >
          Powered by Kitsu
        </div>

      </header>


      {/* HERO */}

      <section className="hero">

        <h1 className="hero-title">
          Discover <span>Anime</span>
        </h1>

        <p className="hero-sub">
          Search thousands of titles,
          find your next obsession
        </p>


        {/* SEARCH BAR */}

        <SearchBar
          onSearch={doSearch}
          loading={loading}
        />


        {/* RANDOM BUTTON */}

        <Random
          onRandom={handleRandom}
          loading={loading}
        />

      </section>


      {/* ERROR MESSAGE */}

      {error && (
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto 1.5rem",
            padding: "0 2rem",
          }}
        >

          <div
            style={{
              background:
                "rgba(230,57,70,0.1)",

              border:
                "1px solid rgba(230,57,70,0.3)",

              borderRadius:
                "var(--radius-md)",

              padding:
                "0.85rem 1rem",

              fontSize:
                "0.85rem",

              color:
                "#f87171",
            }}
          >
            ⚠ {error}
          </div>

        </div>
      )}


      {/* RESULTS TOOLBAR */}

      {!loading &&
        filtered.length > 0 && (

        <div className="toolbar">

          <div className="results-info">

            {lastQuery ? (

              <>
                <strong>
                  {pagination.total.toLocaleString()}
                </strong>{" "}
                results for "
                <strong>
                  {lastQuery}
                </strong>
                "
              </>

            ) : (

              <>
                <strong>
                  {filtered.length}
                </strong>{" "}
                title
                {filtered.length !== 1
                  ? "s"
                  : ""}
              </>

            )}

          </div>


          <div className="filter-row">

            {/* SORT */}

            <span className="filter-label">
              Sort:
            </span>

            <select
              className="select-styled"
              value={sort}
              onChange={(event) =>
                handleSortChange(
                  event.target.value
                )
              }
            >

              {SORT_OPTIONS.map(
                (option) => (

                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>

                )
              )}

            </select>


            {/* TYPE */}

            <span className="filter-label">
              Type:
            </span>

            <select
              className="select-styled"
              value={typeFilter}
              onChange={(event) =>
                handleTypeChange(
                  event.target.value
                )
              }
            >

              {TYPE_OPTIONS.map(
                (option) => (

                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>

                )
              )}

            </select>

          </div>

        </div>
      )}


      {/* ANIME GRID */}

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

      ) : !error ? (

        <div className="state-box">

          <div className="state-icon">
            🎌
          </div>

          <p>
            Your next favourite anime
            is waiting
          </p>

          <p className="state-hint">
            Search a title or hit
            "Surprise me" to get started
          </p>

        </div>

      ) : null}


      {/* PAGINATION */}

      {!loading &&
        filtered.length > 0 &&
        lastQuery && (

        <Pagination
          currentPage={
            pagination.current
          }

          lastPage={
            pagination.last
          }

          onPageChange={
            handlePageChange
          }
        />

      )}


      {/* ANIME MODAL */}

      {activeAnime && (

        <AnimeModal
          anime={activeAnime}
          onClose={() =>
            setActiveAnime(null)
          }
        />

      )}


      {/* TOAST */}

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}

    </>
  );
}

export default App;