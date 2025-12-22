import { useState } from "react";

function SearchBar({ setAnimeList }) {
  const [query, setQuery] = useState("");
  
  const handleSearch = async () => {
    if (!query) return;

    const res = await fetch(
     `https://api.jikan.moe/v4/anime?q=${query}&sfw=true`
    );

    const data = await res.json();
    setAnimeList(data.data);

    const sorted = [...data.data].sort(
      (a,b) =>(b.score) - (a.score) 
    );
    setAnimeList(sorted) ; 
  };


  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter your anime ?"
        value={query}
        onChange={(e) => setQuery(e.target.value)
        }
      />

      <button onClick={handleSearch}>Search</button>

    </div>
  );
}

export default SearchBar;
