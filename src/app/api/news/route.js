export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const country = searchParams.get("country");
  const nextPage = searchParams.get("nextPage");

  const apiKey = process.env.NEWSDATA_API_KEY;

  let apiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${q}&country=${country}&language=en`;
  
  // ✅ FIXED: added '=' in nextPage param
  if (nextPage) {
    apiUrl += `&page=${nextPage}`;
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log("🌐 Raw API Response:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch news data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
