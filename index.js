const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
let tidy = require("htmltidy2").tidy;

const fs = require("fs");
const util = require("util");
tidy = util.promisify(tidy);

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
  const browser = await puppeteer.launch({ headless: true });
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

async function loadHtml(html) {
  let cleanHtml = await tidy(html);
  const $ = cheerio.load(cleanHtml);

  return $;
}

async function getBriefInfo(html) {
  const $ = await loadHtml(html);

  let briefInfo = {};

  briefInfo.id = $(".headerTitle")
    .text()
    .trim()
    .split("ID: ")[1];

  $(".headerValue").each(function(i, elem) {
    if (i === 1) briefInfo.validFrom = $(this).text();
    if (i === 2) briefInfo.validTo = $(this).text();
    if (i === 6) briefInfo.issueDate = $(this).text();
  });

  return briefInfo;
}

async function getAerodromeList(html) {
  const $ = await loadHtml(html);

  let aerodromeList = [];

  $(".notamLocation").each(function(i, elem) {
    let aerodrome = $(this)
      .text()
      .trim();
    aerodromeList.push(aerodrome);
  });

  $(".metLocation").each(function(i, elem) {
    let aerodrome = $(this)
      .text()
      .trim();

    if (!aerodromeList.includes(aerodrome)) aerodromeList.push(aerodrome);
  });

  aerodromeList = aerodromeList.slice(0, -17); // Remove AAW areas from end

  return aerodromeList;
}

async function getNotams(html) {
  const $ = await loadHtml(html);

  let allNotams = [];

  $(".notamSeries").each(function(i, elem) {
    let item = $(this);
    let series = item.text();
    let validity = item
      .next()
      .text()
      .replace(/&nbsp;/g, " ")
      .trim();
    let text = item
      .next()
      .next()
      .text()
      .replace(/&nbsp;/g, " ")
      .trim();

    let aerodrome = item
      .prevAll(".notamLocation")
      .first()
      .text()
      .trim();

    let notam = { aerodrome, series, validity, text };
    allNotams.push(notam);
  });

  return allNotams;
}

async function getMet(html) {
  const $ = await loadHtml(html);

  let allMet = [];

  $(".metText").each(function(i, elem) {
    let item = $(this);
    let content = item.text();
    let type = content.split(" ")[0];
    let aerodrome = item
      .prevAll(".metLocation")
      .first()
      .text()
      .trim();

    console.log("\n\naerodrome :", aerodrome);
    console.log("type :", type);
    console.log("content :", content);
  });
}

async function parseBriefingContent(html) {
  //   let cleanHtml = await tidy(html);
  //   const $ = cheerio.load(cleanHtml, { xml: { normalizeWhitespace: false } });
  //   let aerodromeList = [];
  //   let allNotams = [];
  //   $(".notamLocation").each(function(i, elem) {
  //     let aerodrome = $(this)
  //       .text()
  //       .trim();
  //     aerodromeList.push(aerodrome);
  //   });
  //   $(".notamSeries").each(function(i, elem) {
  //     let item = $(this);
  //     let series = item.text();
  //     let validity = item
  //       .next()
  //       .text()
  //       .replace(/&nbsp;/g, " ")
  //       .trim();
  //     let text = item
  //       .next()
  //       .next()
  //       .text()
  //       .replace(/&nbsp;/g, " ")
  //       .trim();
  //     let aerodrome = item
  //       .prevAll(".notamLocation")
  //       .first()
  //       .text()
  //       .trim();
  //     let notam = { aerodrome, series, validity, text };
  //     // console.log("notam :", notam);
  //     allNotams.push(notam);
  //   });
  //   const notams = aerodromeList.map(aerodrome => {
  //     const notams = allNotams.filter(n => n.aerodrome === aerodrome);
  //     return { aerodrome, notams };
  //   });
  //   return { notams };
}

(async () => {
  let html = await getBriefingData();

  const briefInfo = await getBriefInfo(html);
  const aerodromeList = await getAerodromeList(html);
  const allNotams = await getNotams(html);
  const allMet = await getMet(html);

  // console.log("briefInfo :", briefInfo);
  // console.log("aerodromeList :", aerodromeList);

  let aerodromes = aerodromeList.map(aerodrome => {
    const notams = allNotams.filter(n => n.aerodrome === aerodrome);
    return { aerodrome, notams };
  });

  // console.log("AERODROMES :", aerodsromes);
  // console.log(JSON.stringify(notams, null, 4));
})();
