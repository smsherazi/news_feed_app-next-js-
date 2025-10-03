import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ConnectionStr } from "@/dbCon/db";
import { SavedNews } from "@/dbCon/Model/saveNews";

const cache = new Map();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "latest";
  const country = searchParams.get("country") || "pk";
  const category = searchParams.get("category") || "";
  const language = searchParams.get("language") || "en";
  const nextPage = searchParams.get("nextPage");

  const cacheKey = `${q}-${country}-${category}-${language}-${nextPage}`;
  const cached = cache.get(cacheKey);

  if (cached && cached.expires > Date.now()) {
    console.log("♻️ Returning cached data for:", cacheKey);
    return new Response(JSON.stringify(cached.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const keys = process.env.NEXT_PUBLIC_NEWSDATA_API_KEYS?.split(",") || [];
  let data = null;
  let usedKey = null;

  console.log("📡 Fetching News for:", q, "Country:", country, "Page:", nextPage);

  for (const key of keys) {
    let apiUrl = `https://newsdata.io/api/1/news?apikey=${key}&q=${encodeURIComponent(q)}&country=${country}&language=${language}`;
    if (category) apiUrl += `&category=${category}`;
    if (nextPage) apiUrl += `&page=${encodeURIComponent(nextPage)}`;

    try {
      const response = await fetch(apiUrl);
      const resData = await response.json();

      if (resData.status !== "error") {
        data = resData;
        usedKey = key;
        console.log("✅ Success with key:", key);
        break;
      }

      const errorCode = resData.results?.code || "unknown";
      if (errorCode === "RateLimitExceeded") {
        console.warn("⚠️ Rate limit hit on key:", key);
        continue;
      } else {
        const message = resData.results?.message || "Unknown API error";
        return new Response(JSON.stringify({ error: true, message, code: 500 }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (err) {
      console.error("❌ Failed on key:", key, err.message);
      continue;
    }
  }

  if (!data) {
    console.error("🛑 All keys failed");
    return new Response(JSON.stringify({ error: true, message: "All API keys exhausted", code: 429 }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    let userId = null;
    if (token) {
      try {
        const decoded = jwt.decode(token);
        userId = decoded?.id;
      } catch (err) {
        console.warn("❗ Invalid token:", err);
      }
    }

    let saveIds = new Set();
    if (userId) {
      await mongoose.connect(ConnectionStr);
      const saveNews = await SavedNews.find({ userId });
      saveIds = new Set(saveNews.map((item) => item.savedNewsId));
    }

    const updatedArticles = (data.results || []).map((article) => ({
      ...article,
      id: article.article_id,
      saved: saveIds.has(article.article_id),
    }));

    const cachedData = { ...data, updatedArticles };
    cache.set(cacheKey, { data: cachedData, expires: Date.now() + 2 * 60 * 1000 });

    console.log(`✅ Returning ${updatedArticles.length} articles`);
    return new Response(JSON.stringify(cachedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Internal server error:", err.message);
    return new Response(JSON.stringify({ error: true, message: "Internal Server Error", code: 500 }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
