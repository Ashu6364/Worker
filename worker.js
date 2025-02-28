export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    if (url.pathname === "/nse-data") {
      return fetchNSEData();
    }

    return new Response("Cloudflare Worker is running!", {
      headers: { "Content-Type": "text/plain" }
    });
  }
};

async function fetchNSEData() {
  const nseUrl = "https://www.nseindia.com/api/marketStatus";

  try {
    const response = await fetch(nseUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Referer": "https://www.nseindia.com/"
      }
    });

    if (!response.ok) {
      return new Response(`Error: ${response.statusText}`, { status: response.status });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(`Fetch Error: ${error.message}`, { status: 500 });
  }
}
