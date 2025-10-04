'use client';

import React, { useState } from "react";
import styles from '@/Component Css/AiNewsSearch.module.css';
import { IoSend, IoLogoReddit } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";

const AiNewsSearch = ({onResult}) => {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const toggleSearch = () => setExpanded(true);

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = await res.json();
      console.log("🔎 Extracted Keywords:", data);
      setResult(data);

      if (onResult) onResult(data); // ✅ parent ko bhej diya
    } catch (error) {
      console.error("❌ Error fetching chatbot response:", error);
      setResult({ error: "Something went wrong" });
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <div className={styles.aiNewsContainer}>
      <form
        className={`${styles.searchBox} ${expanded ? styles.expanded : ""}`}
        onSubmit={handleSubmit}
      >
        {expanded ? (
          <>
            <textarea
              className={styles.searchInput}
              placeholder="Search anything about news..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <div className={styles.iconContainer}>
              {query === "" ? (
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => setExpanded(false)}
                >
                  <GiCancel size={20} />
                </button>
              ) : (
                <button type="submit" className={styles.iconBtn} disabled={loading}>
                  {loading ? "..." : <IoSend size={20} />}
                </button>
              )}
            </div>
          </>
        ) : (
          <button
            type="button"
            className={styles.iconBtn}
            onClick={toggleSearch}
          >
            <IoLogoReddit />
          </button>
        )}
      </form>
    </div>
  );
};

export default AiNewsSearch;
