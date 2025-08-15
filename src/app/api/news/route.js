import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ConnectionStr } from "@/dbCon/db";
import { SavedNews } from "@/dbCon/Model/saveNews";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const country = searchParams.get("country");
  const nextPage = searchParams.get("nextPage");

  const keys = process.env.NEWSDATA_API_KEYS?.split(",") || [];

  let data = null;
  let usedKey = null;
  let message = "All API keys exhausted or failed";
  let statusCode = 500;

  console.log("📡 Fetching News for:", q, "Country:", country, "Page:", nextPage);

  // 🔁 Try all keys until success
  for (const key of keys) {
    let apiUrl = `https://newsdata.io/api/1/news?apikey=${key}&q=${encodeURIComponent(q)}&country=${country}&language=en`;
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

      // 🔄 If rate limit, try next key
      const errorCode = resData.results?.code || "unknown";
      if (errorCode === "RateLimitExceeded") {
        console.warn("⚠️ Rate limit hit on key:", key);
        continue;
      } else {
        // 🔴 Any other error — stop loop
        message = resData.results?.message || "Unknown API error";
        return new Response(JSON.stringify({ error: true, message, code: 500 }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (err) {
      console.error("❌ Failed on key:", key, err.message);
      continue; // Try next key if network failure
    }
  }

  // 🔚 No key worked
  if (!data) {
    console.error("🛑 All keys failed");
    return new Response(
      JSON.stringify({ error: true, message, code: 429 }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // ✅ Decode token & get saved news
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
      saved: saveIds.has(article.article_id),
    }));

    console.log(`✅ Returning ${updatedArticles.length} articles`);
    return new Response(
      JSON.stringify({
        ...data,
        updatedArticles,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("❌ Internal server error:", err.message);
    return new Response(
      JSON.stringify({ error: true, message: "Internal Server Error", code: 500 }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
