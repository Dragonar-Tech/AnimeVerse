function AnimeList({ animeList }) {
  return (
    <div className="anime-list">
      {animeList.map((anime) => (
        <div className="card" key={anime.mal_id}>
          <img
            src={anime.images.jpg.image_url}
            alt={anime.title}
          />

          <div className="card-body">
            <h3>{anime.title}</h3>

            <p className="meta">
              ⭐ {anime.score ?? "N/A"} • {anime.episodes ?? "Ongoing"} eps
            </p>

            <p className="season">
              {anime.season
                ? `${anime.season.toUpperCase()} ${anime.year}`
                : "Season N/A"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AnimeList;
