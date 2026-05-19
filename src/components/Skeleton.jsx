function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton-line" style={{ height: "14px", width: "85%", marginBottom: "8px" }} />
        <div className="skeleton-line" style={{ height: "14px", width: "60%", marginBottom: "8px" }} />
        <div className="skeleton-line" style={{ height: "20px", width: "45%" }} />
      </div>
    </div>
  );
}

function SkeletonGrid({ count = 12 }) {
  return (
    <div className="anime-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default SkeletonGrid;
