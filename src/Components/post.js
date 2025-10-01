"use client";

import { useState, useEffect } from "react";
import React from "react";
import toast from "react-hot-toast";

export default function Post({
  newsData,
  scrollLoading,
  hasNextPage,
  loading,
  layout = "timeline",
  onRefresh, // ✅ parent refresh callback
}) {
  const [expandedStates, setExpandedStates] = useState({});
  const [likedStates, setLikedStates] = useState({});

  // 🕒 Time ago
  function getTimeAgo(pubDate) {
    const publishedTime = new Date(pubDate);
    const now = new Date();
    const diffInSeconds = Math.floor((now - publishedTime) / 1000);
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);

    if (diffInSeconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  // ✅ Initialize likedStates (timeline vs grid)
  useEffect(() => {
    const initialLikes = {};
    newsData?.forEach((item) => {
      const key = item.article_id || item.savedNewsId || item.id;
      if (key) {
        initialLikes[key] = item.saved === true || !!item.savedNewsId;
      }
    });
    setLikedStates(initialLikes);
  }, [newsData]);

  // 📌 Read More toggle
  const toggleReadMore = (id) => {
    setExpandedStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ❤️ Save / Remove
  const toggleLike = async (id, article) => {
    const isLiked = likedStates[id];

    // --- SAVE ---
    if (!isLiked) {
      try {
        await toast.promise(
          fetch("/api/saved_news", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              savedNewsId: id,
              title: article.title,
              link: article.link,
              description: article.description,
              pubDate: article.pubDate,
              source_id: article.source_id,
              source_name: article.source_name,
              source_icon: article.source_icon,
              image_url: article.image_url,
              creator: article.creator,
            }),
          }).then(async (res) => {
            if (res.redirected) {
              window.location.href = res.url;
              throw new Error("Redirecting to login...");
            }
            const result = await res.json();
            if (!result.success) throw new Error("Failed to save");
            return result;
          }),
          {
            loading: "Saving news...",
            success: "News saved!",
            error: "Could not save news",
          }
        );

        setLikedStates((prev) => ({
          ...prev,
          [id]: true,
        }));
      } catch (err) {
        console.log("Save error:", err.message);
      }
    }

    // --- REMOVE ---
    else {
      toast(
        (t) => (
          <span>
            Are you sure you want to remove this?
            <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  try {
                    const res = await fetch("/api/saved_news", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ savedNewsId: id }),
                    });
                    const data = await res.json();

                    if (data.success) {
                      toast.success("News removed.");
                      setLikedStates((prev) => ({
                        ...prev,
                        [id]: false,
                      }));

                      // 🔄 Grid/Timeline refresh
                      if (typeof onRefresh === "function") {
                        onRefresh();
                      }
                    } else {
                      toast.error("Failed to remove.");
                    }
                  } catch {
                    toast.error("Error while removing.");
                  }
                }}
                style={{
                  padding: "4px 10px",
                  fontSize: "13px",
                  background: "#2ecc71",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Yes
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                style={{
                  padding: "4px 10px",
                  fontSize: "13px",
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                No
              </button>
            </div>
          </span>
        ),
        { duration: 6000 }
      );
    }
  };

  return (
    <div className={`mt-5 post-parent ${layout === "grid" ? "container" : ""}`}>
      {loading ? (
        // 🔄 Loader
        <div
          style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            flexDirection: "column",
          }}
        >
          <div style={{ position: "relative", width: "60px", height: "60px" }}>
            <img
              src="/logoImg.png"
              alt="NewsIcon"
              style={{
                width: "40px",
                height: "30px",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                animation: "float 2s ease-in-out infinite",
              }}
            />
            <div
              className="spinner-border text-success"
              role="status"
              style={{ width: "60px", height: "60px", borderWidth: "6px" }}
            />
          </div>
        </div>
      ) : newsData?.filter((item) => item?.title).length > 0 ? (
        <div
          className={
            layout === "grid"
              ? "row row-cols-1 row-cols-md-3 g-4"
              : "d-flex flex-column align-items-center"
          }
        >
          {newsData
            .filter((item) => item?.title && item?.pubDate)
            .map((item) => {
              const key = item.article_id || item.savedNewsId || item.id;

              return (
                <div key={key} className={layout === "grid" ? "col" : ""}>
                  <div
                    className="card mb-4 shadow-sm p-3 mt-4"
                    style={
                      layout === "timeline"
                        ? { maxWidth: "500px", margin: "auto" }
                        : {}
                    }
                  >
                    {/* Header */}
                    <div className="d-flex justify-content-between">
                      <a
                        href={item.source_url}
                        target="_blank"
                        className="text-decoration-none"
                      >
                        <strong className="text-dark small">
                          <img src={item.source_icon} width={20} />{" "}
                          {item.source_name}
                        </strong>
                        {item.creator && (
                          <div>
                            <small className="text-muted">{item.creator}</small>
                          </div>
                        )}
                      </a>
                      <div className="text-end">
                        <small className="text-muted">
                          {getTimeAgo(item.pubDate)}
                        </small>
                      </div>
                    </div>

                    {/* Image */}
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        onError={(e) => (e.target.style.display = "none")}
                        alt="News"
                        className="img-fluid mt-3 rounded"
                        style={{ maxHeight: "200px", objectFit: "cover" }}
                      />
                    )}

                    {/* Title */}
                    <h6 className="mt-2 fw-bold">{item.title}</h6>

                    {/* Description */}
                    <p
                      className="news-content"
                      style={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: expandedStates[key] ? "unset" : 4,
                      }}
                    >
                      {item.description || "No Description Available"}
                    </p>
                    {item.description?.length > 100 && (
                      <button
                        className="btn p-0 mb-2"
                        onClick={() => toggleReadMore(key)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "green",
                          fontSize: "0.875rem",
                          fontWeight: "bold",
                        }}
                      >
                        {expandedStates[key] ? "Show less" : "Read more"}
                      </button>
                    )}

                    {/* Footer */}
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <a
                        href={item.link}
                        className="text-success small text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Original Source
                      </a>
                      <span
                        role="button"
                        onClick={() => {
                          toggleLike(key, item)

                        }}
                        style={{ fontSize: "1.3rem", cursor: "pointer" }}
                        className="icon-wrapper"
                      >
                        {likedStates[key] ? "❤️" : "🤍"}
                        <span className="tooltip-text">
                          {likedStates[key] ? "Remove News" : "Save News"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <p className="text-center mt-5">No articles available</p>
      )}

      {/* Infinite Scroll Loader */}
      {layout === "timeline" && scrollLoading && (
        <div className="text-center mb-4">
          <div className="spinner-border text-success" role="status" />
          <p className="text-muted small">more news...</p>
        </div>
      )}
      {!loading && newsData?.length > 0 && hasNextPage === false && (
        <div className="text-center mt-4 text-muted small">
          <p>You&apos;ve reached the end of the news list.</p>
        </div>
      )}
    </div>
  );
}
