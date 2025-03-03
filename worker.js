export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/nse-data") {
      return await fetchNSEData();
    }

    return new Response(JSON.stringify({ message: "Cloudflare Worker is running!" }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};

async function fetchNSEData() {
  const marketStatusUrl = "https://www.nseindia.com/api/marketStatus";
  const indicesUrl = "https://www.nseindia.com/api/allIndices"; // Fetch all indices

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Referer": "https://www.nseindia.com/",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
    "Sec-Fetch-Mode": "cors"
  };

  try {
    // Fetch Market Status
    const marketStatusResponse = await fetch(marketStatusUrl, { headers });
    if (!marketStatusResponse.ok) throw new Error(`Market Status HTTP Error: ${marketStatusResponse.status}`);
    const marketStatusData = await marketStatusResponse.json();

    // Fetch Sector Indices
    const indicesResponse = await fetch(indicesUrl, { headers });
    if (!indicesResponse.ok) throw new Error(`Indices HTTP Error: ${indicesResponse.status}`);
    const indicesData = await indicesResponse.json();

    // Extract only sector indices (Filtering out broad indices like NIFTY 50)
    const sectorIndices = indicesData.data.filter(index => index.indexName.includes("Sector"));

    return new Response(
      JSON.stringify({
        marketState: marketStatusData.marketState,
        sectorIndices: sectorIndices
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Cache-Control": "max-age=30"
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Fetch Error", details: error.message }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      }
    );
  }
}
