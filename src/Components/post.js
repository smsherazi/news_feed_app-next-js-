"use client";

import { useState, useEffect } from "react";
import React from "react";
import toast from "react-hot-toast";

export default function Post({ newsData, scrollLoading, hasNextPage, loading }) {
  const [expandedStates, setExpandedStates] = useState({});
  const [likedStates, setLikedStates] = useState({});

  // 🕒 Time ago function
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

  // ✅ Initialize likedStates on load
  useEffect(() => {
    const initialLikes = {};
    newsData.forEach((item, i) => {
      
      initialLikes[i] = item.saved === true;
      
    });
    setLikedStates(initialLikes);
  }, [newsData]);

  // 📌 Read More toggle
  const toggleReadMore = (index) => {
    setExpandedStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // ❤️ Toggle Like
  const toggleLike = async (index, article) => {
    const isLiked = likedStates[index];

    if (!isLiked) {
      try {
        await toast.promise(
          fetch("/api/saved_news", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              savedNewsId: article.article_id,
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
          [index]: true,
        }));
      } catch (err) {
        console.log("Save error:", err.message);
      }
    } else {
      toast((t) => (
        <span>
          Are you sure you want to remove this?
          <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const res = await fetch("/api/saved_news", {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ savedNewsId: article.article_id }),
                  });
                  const data = await res.json();

                  if (data.success) {
                    toast.success("News removed.");
                    setLikedStates((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
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
      ), { duration: 6000 });
    }
  };

  return (
    <div className="mt-5 post-parent">
      <div>
        {loading ? (
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
            <style jsx>{`
              @keyframes float {
                0% { transform: translate(-50%, -50%) translateY(0); }
                50% { transform: translate(-50%, -50%) translateY(-10px); }
                100% { transform: translate(-50%, -50%) translateY(0); }
              }
            `}</style>
          </div>
        ) : newsData?.filter((item) => item?.title).length > 0 ? (
          <>
            {newsData
              .filter((item) => item?.title && item?.pubDate)
              .map((item, i) => (
                <React.Fragment key={item.article_id || i}>
                  <div className="card mb-4 shadow-sm p-3" style={{ maxWidth: "500px", margin: "auto" }}>
                    {/* Header */}
                    <div className="d-flex justify-content-between">
                      <a href={item.source_url} target="_blank" className="text-decoration-none">
                        <strong className="text-dark small">
                          <img src={item.source_icon} width={20} />{" "}
                          {item.creator || item.source_name}
                        </strong>
                        <br />
                        {item.creator && (
                          <small className="text-muted">{item.source_name}</small>
                        )}
                      </a>
                      <div className="text-end">
                        <small className="text-muted">{getTimeAgo(item.pubDate)}</small>
                      </div>
                    </div>

                    {/* Image */}
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        onError={(e) => (e.target.style.display = "none")}
                        alt="News"
                        className="img-fluid mt-3 rounded"
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                      />
                    )}

                    {/* Title */}
                    <h5 className="mt-3 fw-bold">{item.title}</h5>

                    {/* Description */}
                    <p
                      className="news-content"
                      style={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: expandedStates[i] ? "unset" : 4,
                      }}
                    >
                      {item.description || "No Description Available"}
                    </p>

                    {/* Read More */}
                    {item.description?.length > 100 && (
                      <button
                        className="btn p-0 mt-1 mb-2"
                        onClick={() => toggleReadMore(i)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "green",
                          fontSize: "0.875rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        {expandedStates[i] ? "Show less" : "Read more"}
                      </button>
                    )}

                    {/* Footer */}
                    <div className="d-flex justify-content-between align-items-center">
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
                        onClick={() => toggleLike(i, item)}
                        style={{ fontSize: "1.3rem", cursor: "pointer" }}
                        className="icon-wrapper"
                      >
                        {likedStates[i] ? "❤️" : "🤍"}
                        <span className="tooltip-text">
                          {likedStates[i] ? "Remove News" : "Saved News"}
                        </span>
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            {scrollLoading && (
              <div className="text-center mb-4">
                <div className="spinner-border text-success" role="status" />
                <p className="text-muted small">more news...</p>
              </div>
            )}
            {!loading && newsData.length > 0 && hasNextPage === false && (
              <div className="text-center mt-4 text-muted small">
                <p>You&apos;ve reached the end of the news list.</p>
              </div>
            )}
          </>
        ) : (
          <p className="text-center mt-5">No articles available</p>
        )}
      </div>
    </div>
  );
}
