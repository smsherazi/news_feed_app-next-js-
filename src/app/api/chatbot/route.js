export async function POST(req) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query) {
      return new Response(JSON.stringify({ error: "Missing query input" }), { status: 400 });
    }

const prompt = `
You are a keyword extractor for news searches.
Return a STRICT JSON object with only keywords for the field "q".
Do not include extra sentences or explanations.

The JSON must contain:
{
  "q": "...",         // Only 2–3 short, highly relevant keywords
  "country": "...",
  "category": "",
  "language": "...",
  "from_date": "",
  "to_date": ""
}

Rules:
- Extract ONLY the most important keywords from the query.
- Output between 2 and 3 keywords maximum.
- Remove stop words (like 'ki', 'ka', 'the', 'of', etc.).
- Keywords must be lowercase unless proper nouns.
- Use the fewest words possible that capture the main intent.
- Category must always be empty "".
- Dates must be in YYYY-MM-DD format if present.
- Country and language must be ISO codes.

Query: "${query}"
`;


    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are a strict JSON extractor. Only return valid JSON." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter API error: ${errText}`);
    }

    const result = await response.json();
    const output = result.choices?.[0]?.message?.content || "{}";

    const match = output.match(/\{[\s\S]*\}/);
    let fields = {};
    try {
      if (match) {
        fields = JSON.parse(match[0]);
      } else {
        throw new Error("No valid JSON found");
      }
    } catch (err) {
      console.error("❌ JSON parse error:", err, output);
      return new Response(JSON.stringify({ error: "Failed to parse model output" }), { status: 500 });
    }

    // Ensure safe defaults
    fields.q = fields.q || query;
    fields.country = fields.country || "pk";
    fields.category = ""; // ✅ Always empty
    fields.language = fields.language || "en";
    fields.from_date = "";
    fields.to_date = "";

    return new Response(JSON.stringify(fields), { status: 200 });
  } catch (error) {
    console.error("❌ Error extracting fields:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
