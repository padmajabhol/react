import { useState, useEffect } from "react";

const cache = new Map();

function useFetch(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setData(null);
      setError(null);

      if (cache.has(url)) {
        setData(cache.get(url));
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("error")
        }
        const apidata = await res.json();
        cache.set(url, apidata);
        setData(apidata);
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// --- Usage (no need to modify this) ---
function UserProfile({ userId }) {
  const { data, loading, error } = useFetch(
    "https://jsonplaceholder.typicode.com/users/1"
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <p>{data?.name}</p>;
}

export default UserProfile;