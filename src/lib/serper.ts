interface SerperResult {
  title: string;
  link: string;
  snippet: string;
}

interface SerperResponse {
  organic: SerperResult[];
}

/**
 * Search the web using Serper API (Google Search).
 * Returns empty results on failure — never throws.
 */
export async function searchWeb(query: string): Promise<SerperResponse> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    return { organic: [] };
  }

  try {
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query, num: 10 }),
    });

    if (!response.ok) {
      console.error("Serper API error:", response.status);
      return { organic: [] };
    }

    const data = await response.json();
    return {
      organic: (data.organic || []).map((r: Record<string, string>) => ({
        title: r.title || "",
        link: r.link || "",
        snippet: r.snippet || "",
      })),
    };
  } catch (error) {
    console.error("Serper search failed:", error);
    return { organic: [] };
  }
}
