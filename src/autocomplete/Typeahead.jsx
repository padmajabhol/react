import { useEffect, useState, useRef } from "react"
import useDebounce from "./useDebounce";

export default function Typeahead() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const skipFetch = useRef(null);

  const handleSelect = (name) => {
    skipFetch.current = true;
    setQuery(name)
    setSuggestions([])
  }

  const debouncedQuery = useDebounce(query, 3000);

  useEffect(() => {
    if (skipFetch.current) {
      skipFetch.current = false;
      return
    }
    
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestion = async () => {
      setLoading(true);

      try {
        const res = await fetch(`https://restcountries.com/v3.1/name/${debouncedQuery}`)
        if (!res.ok) throw new Error("No Results");
        const data = await res.json();
        setSuggestions(data.map((c) => c.name.common))
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestion();
  }, [debouncedQuery])

  return (
    <div>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      {loading && <p>Loading</p>}

      {!loading && debouncedQuery && suggestions.length === 0 && (
        <p>No Result Found</p>
      )}

      {suggestions.length > 0 && (
        <ul style={{
          position: "absolute",
          width: "100%",
          border: "1px solid #ccc",
          listStyle: "none",
          margin: "0",
          padding: "0",
          background: "#fff"
        }}>
          {suggestions.map((name) => (
            <li style={{padding: "8px", cursor: "pointer"}} key={name} onClick={() => handleSelect(name)}>
              {name}
            </li>
          ))}
        </ul>
      )}

    </div>
  )
}