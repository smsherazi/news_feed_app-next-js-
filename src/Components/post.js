"use client";

import { useState } from "react";
import React from "react";

export default function Post({ newsData, loading, hasNextPage }) {
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

  const [expandedStates, setExpandedStates] = useState({});
  const [likedStates, setLikedStates] = useState({});

  const toggleReadMore = (index) => {
    setExpandedStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleLike = (index) => {
    setLikedStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="mt-5 post-parent">
      {newsData.filter(item => item && item.title).length > 0 ? (
        newsData
         .filter((item) => item && item.title && item.pubDate)
         .map((item, i) => (
          <React.Fragment key={item?.article_id || i}>
            <div
              className="card mb-4 shadow-sm p-3"
              style={{ maxWidth: "500px", margin: "auto" }}
            >
              {/* Header */}
              <div className="d-flex justify-content-between">
                <div>
                  <strong className="text-dark small">
                    {item?.creator == null ? item?.source_name : item?.creator}
                  </strong>
                  <br />
                  <small className="text-muted">
                    {item?.creator == null ? (
                      ""
                    ) : (
                      <span className="text-secondary">{item.source_name}</span>
                    )}
                  </small>
                </div>
                <div className="text-end">
                  <small className="text-muted">
                    {getTimeAgo(item?.pubDate)}
                  </small>
                </div>
              </div>

              {/* Image */}
              {item?.image_url && (
                <img
                  src={item?.image_url}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                  alt="News"
                  className="img-fluid mt-3 rounded"
                  style={{
                    maxHeight: "300px",
                    maxWidth: "100%",
                    objectFit: "cover",
                  }}
                />
              )}

              {/* Title */}
              <h5 className="mt-3 fw-bold">{item?.title}</h5>

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
                {item?.description || "No Description Available"}
              </p>

              {/* Read More */}
              {item?.description && item?.description.length > 100 && (
                <button
                  className="btn p-0 mt-1 mb-2"
                  onClick={() => toggleReadMore(i)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "green",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  {expandedStates[i] ? "Show less" : "Read more"}
                </button>
              )}

              {/* Footer */}
              <div className="d-flex justify-content-between align-items-center">
                <a
                  href={item?.source_url}
                  className="text-success small text-decoration-none"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Original Source
                </a>
                <span
                  role="button"
                  onClick={() => toggleLike(i)}
                  style={{ fontSize: "1.3rem", cursor: "pointer" }}
                >
                  {likedStates[i] ? "❤️" : "🤍"}
                </span>
              </div>
            </div>
            <hr
              style={{
                width: "100%",
                margin: "1rem auto",
                borderColor: "white",
              }}
            />
          </React.Fragment>
        ))
      ) :( 
        (
        <p className="text-center mt-5">No articles available</p>
      )
      )
      }

      {/* Small loader after posts when loading more */}
      {loading && (
        <div className="text-center mb-4">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted small">more news...</p>
        </div>
      )}

      {!loading &&
        newsData.length > 0 &&
        typeof hasNextPage !== "undefined" &&
        !hasNextPage && (
          <div className="text-center mt-4 text-muted small">
            <p>You&apos;ve reached the end of the news list.</p>
          </div>
        )}
    </div>
  );
}
