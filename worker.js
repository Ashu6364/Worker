export default {
    async fetch(request) {
        try {
            const response = await fetch("https://www.nseindia.com/api/some-endpoint", {
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Accept": "application/json"
                }
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
                    "Access-Control-Allow-Methods": "GET",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Content-Type": "application/json"
                }
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: "Failed to fetch data", details: error.message }), {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                }
            });
        }
    }
};
