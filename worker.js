export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/nse-data") {
      return await fetchNSEData();
    }

    // Fix: Ensure JSON response instead of plain text
    return new Response(JSON.stringify({ message: "Cloudflare Worker is running!" }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};

async function fetchNSEData() {
  const nseUrl = "https://www.nseindia.com/api/marketStatus";

  try {
    const response = await fetch(nseUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Referer": "https://www.nseindia.com/",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive",
        "Sec-Fetch-Mode": "cors",
      },
      cf: {
        cacheTtl: 30, // Cache response for 30 seconds
        cacheEverything: true,
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `HTTP Error: ${response.status}` }), {
        status: response.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Cache-Control": "max-age=30"
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Fetch Error", details: error.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    });
  }
}
