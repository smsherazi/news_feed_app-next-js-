'use client'

import Navbar from "@/Components/navbar";
import Post from "@/Components/post";
import { useState, useEffect } from "react";

export default function SavedNews() {
  const [savedArticles, setSavedArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [country, setCountry] = useState("pk");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSaved = async (query = "", countryCode = "") => {
    setLoading(true);
    try {
      let url = `/api/saved_news?`;
      if (query) url += `q=${encodeURIComponent(query)}&`;
      if (countryCode) url += `country=${encodeURIComponent(countryCode)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setSavedArticles(data.result);
    } catch (err) {
      console.error("Error fetching saved news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchSaved();
  }, []);

  const handleSearchChange = (query, countryCode) => {
    setSearchQuery(query);
    setCountry(countryCode);
    fetchSaved(query, countryCode);
  };

  return (
    <>
      <Navbar
        onSearchChange={handleSearchChange}
        country={country}
        setCountry={setCountry}
        isSavedPage={true}
        user={user}
        setUser={setUser}
      />
      <div className="container mt-5">
        <h4 className="mb-5 text-white display-4 fw-bold">Saved News</h4>
        <Post
          newsData={savedArticles}
          loading={loading}
          layout="grid"
          onRefresh={() => fetchSaved(searchQuery, country)}
        />
      </div>
    </>
  );
}
