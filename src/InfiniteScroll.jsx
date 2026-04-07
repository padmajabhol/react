import { useState, useEffect, useRef, useCallback } from "react";

export default function InfiniteScroll() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page + 1}&_limit=10`);
    const data = await res.json();
    setItems((prev) => [...prev, ...data]);
    setPage((p) => p + 1);
    setHasMore(data.length > 0 && page + 1 < 10); 
    } catch (err) {
      
    } finally {
      setLoading(false); 
    }    
  }, [page, loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "100px" }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
          <strong>{item.title}</strong>
          <p>{item.body}</p>
        </div>
      ))}
      <div ref={sentinelRef} />
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more items</p>}
    </div>
  );
}