function AnimeCard({ anime }) {
  return (
    <div className="card">
      <img
        src={anime.images?.jpg?.image_url}
        alt={anime.title}
      />

      <div className="card-body">
        <h3>{anime.title}</h3>

        <div className="meta">
          ⭐ {anime.score ?? "N/A"} · {anime.episodes ?? "Ongoing"} eps
        </div>

        <div className="season">
          {anime.status} · {anime.season ?? "NA"} {anime.year ?? ""}
        </div>

          
        </div>
      </div>
  );
}

export default AnimeCard;
