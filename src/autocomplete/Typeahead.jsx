import { useEffect, useState, useRef } from "react";
import useDebounce from "./useDebounce";

const Typeahead = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0)

  const skipFetch = useRef(null);

  const handleOnChange = (e) => {
    setQuery(e.target.value)
  }

  const debouncedQuery = useDebounce(query, 300);

  const handleSelect = (item) => {
    skipFetch.current = true;
    setQuery(item)
    setSuggestions([])
  }

  useEffect(() => {

    if (skipFetch.current) {
      skipFetch.current = false;
      return;
    }

    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true)
      try {
        const res = await fetch(`https://dummyjson.com/products/search?q=${debouncedQuery}&limit=5`);
        const data = await res.json();
        setSuggestions(data.products.map((p) => p.title));
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedQuery])

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
    }
    if (e.key === "ArrowUp") {
      setActiveIndex((prev) => Math.max(prev - 1, 0))
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      handleSelect(suggestions[activeIndex])
    }
  }
  
  return (
    <div>
      <input value={query} onChange={(e) => handleOnChange(e)} onKeyDown={handleKeyDown} />
      {loading && <p>Loading...</p>}
      {!loading && debouncedQuery && suggestions.length === 0 && <p>No result</p>}
      {suggestions.length > 0 && (
        <>
          <ul>
            {suggestions.map((item, index) => (
            <li style={{border: activeIndex === index && "1px solid blue"}} key={item} onClick={() => handleSelect(item)}>
              {item}
            </li>
          ))}
          </ul>
          
        </>
      )}
    </div>
  )
}

export default Typeahead;