"use client";

import React, { useState } from "react";
import "@/Component Css/SidebarCategory.css";

export default function CategoriesSidebar({ selectedCategory, onSelectCategory }) {
  // Categories list apne hisaab se
  const categories = [
    { label: "Latest", value: "latest" },
    { label: "Business", value: "business" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Health", value: "health" },
    { label: "Science", value: "science" },
    { label: "Sports", value: "sports" },
    { label: "Technology", value: "technology" },
    { label: "World", value: "world" },
  ];

  return (
    <div className="categories-sidebar">
      <h1 className="display-6 fw-bold text-white">Categories</h1>
       {categories.map((cat) => (
        <div
          key={cat.value}
          className={`category-item ${selectedCategory === cat.value ? "selected" : ""}`}
          onClick={() => onSelectCategory(cat.value)}
        >
          {cat.label}
        </div>
      ))}
    </div>
  );
}
