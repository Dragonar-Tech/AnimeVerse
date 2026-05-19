import { useEffect } from "react";

function AnimeModal({ anime, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const score = anime.score ? anime.score.toFixed(1) : "N/A";
  const bgImg = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const coverImg = anime.images?.jpg?.image_url;
  const genres = anime.genres ?? [];
  const studios = anime.studios?.map((s) => s.name).join(", ") || "N/A";

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={anime.title}>
        {/* Hero banner */}
        <div className="modal-hero">
          <img className="modal-hero-img" src={bgImg} alt="" aria-hidden="true" />
          <div className="modal-hero-content">
            <img className="modal-cover" src={coverImg} alt={anime.title} />
            <div className="modal-hero-info">
              <h2>{anime.title}</h2>
              {anime.title_english && anime.title_english !== anime.title && (
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                  {anime.title_english}
                </p>
              )}
              <div className="modal-meta-row">
                {anime.type && <span>{anime.type}</span>}
                {anime.year && <span>· {anime.year}</span>}
                {anime.season && <span>· {anime.season.charAt(0).toUpperCase() + anime.season.slice(1)}</span>}
                {anime.rating && <span>· {anime.rating.split(" - ")[0]}</span>}
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div>
            {anime.synopsis && (
              <>
                <h4 style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "0.5rem", fontWeight: 600 }}>
                  Synopsis
                </h4>
                <p className="modal-synopsis">{anime.synopsis}</p>
              </>
            )}
            {genres.length > 0 && (
              <div className="modal-genres">
                {genres.map((g) => (
                  <span key={g.mal_id} className="modal-genre-tag">{g.name}</span>
                ))}
              </div>
            )}
          </div>

          <div className="modal-sidebar">
            <div className="stat-box">
              <div className="stat-label">Score</div>
              <div className="score-big">{score}</div>
              {anime.scored_by && (
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  {anime.scored_by.toLocaleString()} votes
                </div>
              )}
            </div>

            <div className="stat-box">
              <div className="stat-label">Episodes</div>
              <div className="stat-value">{anime.episodes ?? "Ongoing"}</div>
            </div>

            <div className="stat-box">
              <div className="stat-label">Status</div>
              <div className="stat-value" style={{ fontSize: "0.85rem" }}>{anime.status ?? "N/A"}</div>
            </div>

            {anime.rank && (
              <div className="stat-box">
                <div className="stat-label">Rank</div>
                <div className="stat-value">#{anime.rank}</div>
              </div>
            )}

            {anime.popularity && (
              <div className="stat-box">
                <div className="stat-label">Popularity</div>
                <div className="stat-value">#{anime.popularity}</div>
              </div>
            )}

            <div className="stat-box">
              <div className="stat-label">Studio</div>
              <div className="stat-value" style={{ fontSize: "0.8rem" }}>{studios}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeModal;
