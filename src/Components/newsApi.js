export default async function getApi(q, country, nextPageToken, language, category, fromDate, toDate) {
  try {
    let url = `/api/news?q=${encodeURIComponent(q)}&country=${country}&language=${language}`;
    if (category && category !== "latest") url += `&category=${category}`;
    if (fromDate) url += `&from_date=${fromDate}`;
    if (toDate) url += `&to_date=${toDate}`;
    if (nextPageToken) url += `&nextPage=${encodeURIComponent(nextPageToken)}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.warn(`❌ API ERROR ${data.code}: ${data.message}`);
      return { error: true, code: data.code, message: data.message };
    }

    if (!Array.isArray(data.updatedArticles)) {
      return { error: true, code: 500, message: "Invalid articles array" };
    }

    return { articles: data.updatedArticles, nextPage: data.nextPage || null };
  } catch (err) {
    console.error("🚨 Fetch failed:", err.message);
    return { error: true, code: 500, message: err.message };
  }
}
