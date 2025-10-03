"use client";

import { useState, useEffect, useRef } from "react";
import React from "react";
import toast from "react-hot-toast";

export default function Post({
  newsData,
  scrollLoading,
  hasNextPage,
  loading,
  layout = "timeline",
  onRefresh,
}) {
  const [likedStates, setLikedStates] = useState({});
  const [focusedCard, setFocusedCard] = useState(null);
  const cardRefs = useRef([]);

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

  const toggleLike = async (id, article) => {
    const isLiked = likedStates[id];
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
              country: article.country[0],
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
      ));
    }
  };

  useEffect(() => {
    if (layout !== "timeline") return; // Only run for timeline

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      let bestCardIndex = null;
      let minDistance = Infinity;
      const threshold = 0.9;

      cardRefs.current.forEach((card, index) => {
        if (card) {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.top + rect.height / 2;
          const windowCenter = windowHeight / 2;
          const distance = Math.abs(cardCenter - windowCenter);

          if (distance < minDistance && rect.top < windowHeight * threshold) {
            minDistance = distance;
            bestCardIndex = index;
          }
        }
      });

      setFocusedCard(bestCardIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [newsData, layout]);

  return (
    <div
      className={`mt-5 post-parent ${layout === "grid" ? "container" : ""}`}
      style={{
        width: layout === "grid" ? "100%" : "800px",
        margin: "auto",
      }}
    >
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
            .map((item, index) => {
              const key = item.article_id || item.savedNewsId || item.id;

              return (
                <div
                  key={key}
                  className={layout === "grid" ? "col" : ""}
                  ref={(el) => (cardRefs.current[index] = el)}
                >
                  <div
                    className={`card mb-4 shadow-sm p-3 mt-4 d-flex flex-column justify-content-between ${layout === "timeline" && focusedCard === index
                      ? "focused"
                      : ""
                      } ${layout === "timeline" && focusedCard !== index ? "blur" : ""}`}
                    style={{
                      width: layout === "timeline" ? "700px" : "100%",
                      height: "600px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start">
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
                            <small className="text-muted fs-6 fw-bold mt-1">
                              {item.creator}
                            </small>
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
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "10px",
                      }}
                    >
                      <img
                        src={item.image_url || "/image_not_available.png"}
                        onError={(e) => {
                          e.target.onerror = null; // prevent infinite loop
                          e.target.src = "/image_not_available.png";
                        }}
                        alt="News"
                        className="img-fluid rounded"
                        style={{
                          maxHeight: "300px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>


                    {/* Title */}
                    <h6
                      className="mt-2 fw-bold fs-4 "
                      style={{ marginTop: "15px" }}
                    >
                      {item.title}
                    </h6>

                    {/* Description */}
                    <p
                      className="news-content "
                      style={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 4,
                        margin: "10px 0",
                      }}
                    >
                      {item.description
                        ? item.description + "..."
                        : "No Description Available"}
                    </p>

                    {/* Footer */}
                    {/* Footer */}
                    <div
                      className="d-flex justify-content-between align-items-center mt-2"
                      style={{ marginTop: "auto" }}
                    >
                      <a
                        href={item.link}
                        className="text-success small text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Original Source
                      </a>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {/* Eye Icon */}
                        <span className="icon-wrapper" onClick={() => console.log("View clicked")}>
                          👁️
                          <span className="tooltip-text">View</span>
                        </span>

                        {/* Heart Icon */}
                        <span
                          className="icon-wrapper"
                          role="button"
                          onClick={() => toggleLike(key, item)}
                        >
                          {likedStates[key] ? "❤️" : "🤍"}
                          <span className="tooltip-text">
                            {likedStates[key] ? "Remove News" : "Save News"}
                          </span>
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <p className="text-center mt-5">No articles available</p>
      )}

      {layout === "timeline" && scrollLoading && (
        <div className="text-center mb-4">
          <div className="spinner-border text-success" role="status" />
          <p className="text-muted small">more news...</p>
        </div>
      )}
      {!loading && newsData?.length > 0 && hasNextPage === false && (
        <div className="text-center mt-4 text-muted small">
          <p>You've reached the end of the news list.</p>
        </div>
      )}
    </div>
  );
}
