export default async function getApi(q, country, nextPageToken) {
  try {
    let url = `/api/news?q=${q}&country=${country}`;
    
    if (nextPageToken) {
      url += `&nextPage=${nextPageToken}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (data.status === "error") {
      const errorCode = data.results?.code;
      const message = data.results?.message;

      if (errorCode === "InvalidPageToken") {
        return {
          error: true,
          code: 500,
          message: "Invalid page token. No more data available.",
        };
      }

      if (errorCode === "RateLimitExceeded","ApiLimitExceeded") {
        return {
          error: true,
          code: 429,
          message,
        };
      }

      return {
        error: true,
        code: 500,
        message,
      };
    }

    if (!Array.isArray(data.results)) {
      return { error: true, code: 500, message: "No results array." };
    }

    return {
      articles: data.results,
      nextPage: data.nextPage || null,
    };

  } catch (error) {
    console.error("🚨 API fetch error:", error.message);
    return { error: true, code: 500, message: error.message };
  }
}
