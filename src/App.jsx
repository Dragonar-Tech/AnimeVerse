import { useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import AnimeList from "./components/AnimeList.jsx";
import Random from "./components/Random.jsx";
import "./global.css";

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [activeAnime, setActiveAnime] = useState(null);

  return (
    
    <div>
      <h1 className="title">AnimeVerse</h1>

      <div className="search-wrapper">
        <SearchBar setAnimeList={setAnimeList} />
        <Random setRandomList={setAnimeList} />
      </div>

      <AnimeList
        animeList={animeList}
        activeAnime={activeAnime}
        setActiveAnime={setActiveAnime}
      />
      
    </div>
  );
}

export default App;
