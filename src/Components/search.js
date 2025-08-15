import { FaSearch } from "react-icons/fa";
import "@/Component Css/search.css";

export default function Search({ query, setQuery, handleBtn, setInputValue }) {
  const handleSearchBtn = (e) => {
    e.preventDefault();
    const finalQuery = query.trim() === "" ? "latest" : query.trim();
    setInputValue(finalQuery);
  };

  return (
    <form
      className="animated-search"
      onSubmit={handleSearchBtn}
    >
      <input
        className="searchInput"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="search"
        placeholder="Search news..."
        aria-label="Search"
      />
      <div className="searchIcon">
      <button
        type="submit"
        className="searchIcon"
      >
        <FaSearch />
      </button>
      </div>
    </form>
  );
}
