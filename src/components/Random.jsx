function Random({ onRandom, loading }) {
  return (
    <button className="btn-random" onClick={onRandom} disabled={loading}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 3 21 3 21 8"/>
        <line x1="4" y1="20" x2="21" y2="3"/>
        <polyline points="21 16 21 21 16 21"/>
        <line x1="15" y1="15" x2="21" y2="21"/>
      </svg>
      {loading ? "Loading…" : "Surprise me"}
    </button>
  );
}

export default Random;
