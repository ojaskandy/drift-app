const corsAnywhere = require("cors-anywhere");

const host = "0.0.0.0";
const port = 8080; // You can choose a different port if needed

corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ["origin", "x-requested-with"],
  removeHeaders: ["cookie", "cookie2"]
}).listen(port, host, () => {
  console.log(`CORS Anywhere proxy server running on http://${host}:${port}`);
});
