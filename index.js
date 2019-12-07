const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

async function getBriefingData() {
  const pages = {
    login:
      "https://www.ifis.airways.co.nz/secure/script/user_reg/login.asp?RedirectTo=%2F",
    areaBriefing:
      "https://www.ifis.airways.co.nz/script/other/simple_briefing.asp"
  };

  const selectors = {
    username: "input[name=UserName]",
    password: "input[name=Password]",
    submit: "input[value=Submit]",

    homepage: "#home-photo",

    briefingAreas: "input[name=Areas]",
    aawAreas: "input[name=MetAviationAreas]",
    ATIS: "input[name=ATIS]",
    METAR: "input[name=METAR]",
    TAF: "input[name=TAF]",

    briefingLoaded: ".notamSectionHeader",
    briefingContent: ".aqcResponse"
  };

  const credentials = {
    username: "metscope",
    password: "iamar0bot"
  };

  const startTime = new Date(); // Used for measuring execution time
  console.log("Logging in to IFIS...");
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to login and wait for load
  await page.goto(pages.login);
  await page.waitForSelector(selectors.username);

  // Input login credentials
  await page.click(selectors.username);
  await page.keyboard.type(credentials.username);
  await page.click(selectors.password);
  await page.keyboard.type(credentials.password);

  // Submit login and wait for redirect
  await page.click(selectors.submit);
  await page.waitForSelector(selectors.homepage);
  console.log("Login successful.");

  // Navigate to briefing selection and wait for load
  console.log("Requesting briefing...");
  await page.goto(pages.areaBriefing);
  await page.waitForSelector(selectors.briefingAreas);

  // Input briefing request
  await page.click(selectors.ATIS);
  await page.click(selectors.METAR);
  await page.click(selectors.TAF);
  await page.click(selectors.briefingAreas);
  await page.keyboard.type("1 2 3 4 5 6 7 8 9 10"); // All briefing areas
  await page.click(selectors.aawAreas);
  await page.keyboard.type(
    "FN TA ED TK CP MH SA DV ST TN KA WW AL PL FD CY GE"
  ); // All AAW areas

  // Submit brief request and wait for redirect
  await page.click(selectors.submit);
  await page.waitForSelector(selectors.briefingContent, { visible: true });

  // Navigate to same page to ensure all content loads successfully
  await page.goto(`${page.url()}#contentContainer`, {
    waitUntil: "networkidle0"
  });
  console.log("Briefing request successful.");

  // Get html content from page
  const data = await page.content();
  await browser.close();

  // Track execution time
  const endTime = new Date();
  console.log(`Completed in ${(endTime - startTime) / 1000} seconds.`);

  return data;
}

async function parseBriefingContent(html) {
  const $ = cheerio.load(html, { xml: { normalizeWhitespace: false } });

  let textContent = $(".aqcResponse").text();
  // .replace(/(&nbsp;)*/g, " ");

  console.log(textContent);
}

(async () => {
  const html = await getBriefingData();
  await parseBriefingContent(html);
})();
