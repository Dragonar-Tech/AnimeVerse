function Pagination({ currentPage, lastPage, onPageChange }) {
  if (!lastPage || lastPage <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = currentPage - delta;
  const right = currentPage + delta;

  for (let i = 1; i <= lastPage; i++) {
    if (i === 1 || i === lastPage || (i >= left && i <= right)) {
      pages.push(i);
    }
  }

  const withEllipsis = [];
  let prev = null;
  for (const p of pages) {
    if (prev && p - prev > 1) withEllipsis.push("…");
    withEllipsis.push(p);
    prev = p;
  }

  return (
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {withEllipsis.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} style={{ color: "var(--text-muted)", padding: "0 4px" }}>…</span>
        ) : (
          <button
            key={p}
            className={`page-btn${p === currentPage ? " active" : ""}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;
