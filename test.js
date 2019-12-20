const scrape = require("./scrapeIfis");

(async () => {
  const brief = await scrape();
  console.log("brief :", brief);
})();
