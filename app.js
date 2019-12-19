const express = require("express");
const scrapeIfis = require("./scrapeIfis");

const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => res.send(`API listening on port ${port}`));

app.get("/brief", async (req, res) => {
  try {
    const brief = await scrapeIfis();
    return res.status(200).json({ data: brief });
  } catch (error) {
    console.log("Error retrieving brief.");
    return res.status(500).json({ error: error });
  }
});

console.log("API launching...");
app.listen(port);

console.log(`API online at port: ${port}`);
