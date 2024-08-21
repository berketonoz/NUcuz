import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function SearchPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query) {
      navigate(`/products?search=${query}`);
    }
  };

  return (
    <div className="container">
      <div className="search-bar">
        <input
          placeholder="Type a product"
          id="search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
}

export default SearchPage;
