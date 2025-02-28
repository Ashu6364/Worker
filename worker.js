export default {
  async fetch(request) {
    const url = "https://www.nseindia.com/api/sector-indices";
    
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "application/json, text/plain, */*",
      "Referer": "https://www.nseindia.com/"
    };

    try {
      const response = await fetch(url, { headers });
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch NSE data" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
