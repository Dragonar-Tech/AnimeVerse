function AnimeCard({ anime, onClick }) {
  const score = anime.score ? anime.score.toFixed(1) : null;
  const type = anime.type;
  const genres = anime.genres?.slice(0, 2) ?? [];

  return (
    <div className="card" onClick={() => onClick(anime)}>
      <div className="card-img-wrap">
        <img
          src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
          alt={anime.title}
          loading="lazy"
        />
        {type && <span className="card-type-badge">{type}</span>}
        {score && (
          <span className="card-score">
            ★ {score}
          </span>
        )}
      </div>
      <div className="card-body">
        <h3>{anime.title}</h3>
        <div className="card-meta">
          <span>{anime.episodes ? `${anime.episodes} eps` : "Ongoing"}</span>
          {anime.year && (
            <>
              <span className="card-meta-dot" />
              <span>{anime.year}</span>
            </>
          )}
          {anime.status && (
            <>
              <span className="card-meta-dot" />
              <span>{anime.status === "Currently Airing" ? "Airing" : anime.status}</span>
            </>
          )}
        </div>
        {genres.length > 0 && (
          <div className="genres-row">
            {genres.map((g) => (
              <span key={g.mal_id} className="genre-tag">{g.name}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnimeCard;
