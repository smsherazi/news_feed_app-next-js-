'use client'

import Navbar from "@/Components/navbar";
import Post from "@/Components/post";
import { useState, useEffect } from "react";

export default function SavedNews() {
  const [allArticles, setAllArticles] = useState([]);   
  const [savedArticles, setSavedArticles] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [availableCountries, setAvailableCountries] = useState([]); // ✅ unique countries

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/saved_news");  
      const data = await res.json();
      if (data.success) {
        setAllArticles(data.result); 
        setSavedArticles(data.result); 

        // ✅ extract unique countries dynamically
        const uniqueCountries = [...new Set(data.result.map(a => a.country))];
        setAvailableCountries(uniqueCountries);
      }
    } catch (err) {
      console.error("Error fetching saved news:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ search + country filter apply
  useEffect(() => {
    let filtered = [...allArticles];

    // ✅ keyword search (title + description dono)
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        (article.title && article.title.toLowerCase().includes(lower)) ||
        (article.description && article.description.toLowerCase().includes(lower))
      );
    }

    // ✅ country filter
    if (country) {
      filtered = filtered.filter(article => article.country === country);
    }

    setSavedArticles(filtered);
  }, [searchQuery, country, allArticles]);


  useEffect(() => {
    fetchUser();
    fetchSaved(); 
  }, []);

  const handleSearchChange = (query, countryCode) => {
    setSearchQuery(query);
    setCountry(countryCode);
  };

  return (
    <>
      <Navbar
        onSearchChange={handleSearchChange}
        country={country}
        setCountry={setCountry}
        isSavedPage={true}   // ✅ saved page hai
        user={user}
        setUser={setUser}
        availableCountries={availableCountries}
      />
      <div className="container mt-5">
        <h4 className="mb-5 text-white display-4 fw-bold">Saved News</h4>
        <Post
          newsData={savedArticles}
          loading={loading}
          layout="grid"
          onRefresh={fetchSaved}
        />
      </div>
    </>
  );
}
