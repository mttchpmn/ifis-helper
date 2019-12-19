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
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
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
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
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
      .trim()
      .substring(0, 4);
    aerodromeList.push(aerodrome);
  });

  $(".metLocation").each(function(i, elem) {
    let aerodrome = $(this)
      .text()
      .trim()
      .substring(0, 4);
    if (!aerodromeList.includes(aerodrome)) aerodromeList.push(aerodrome);
  });

  aerodromeList = aerodromeList.slice(0, -17); // Remove AAW areas

  if (aerodromeList.indexOf("NZZC") > -1) {
    // Remove SIGMET ('NZZC')
    const index = aerodromeList.indexOf("NZZC");
    aerodromeList.splice(index, 1);
  }

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
      .trim()
      .substring(0, 4);

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
      .trim()
      .substring(0, 4);

    if (type !== "AVIATION") allMet.push({ aerodrome, type, content });
  });

  return allMet;
}

async function getAaw(html) {
  const $ = await loadHtml(html);
  const aawList = [];

  $(".metText.metPreformatted").each(function(i, elem) {
    const aaw = $(this).text();
    const area = aaw.slice(14, 16);

    if (area !== "--") aawList.push({ area, aaw });
  });

  return aawList;
}

async function getSigmet(html) {
  const $ = await loadHtml(html);

  let sigmet = [];

  $(".metText").each(function(i, elem) {
    const content = $(this).text();

    if (content.slice(0, 4) === "NZZC") {
      sigmet.push({ fir: "NZZC", sigmet: content });
    }
    if (content.slice(0, 4) === "NZZO") {
      sigmet.push({ fir: "NZZO", sigmet: content });
    }
  });

  return sigmet;
}

async function getCharts(html) {
  const $ = await loadHtml(html);
  let charts = {
    sigmet: [],
    grafor: [],
    sigwx: []
  };

  $("a").each(function(i, elem) {
    const item = $(this);

    if (item.attr("href").includes("SIGMET"))
      charts.sigmet.push(`https://ifis.airways.co.nz${item.attr("href")}`);

    if (item.attr("href").includes("GRAFOR"))
      charts.grafor.push(`https://ifis.airways.co.nz${item.attr("href")}`);

    if (item.attr("href").includes("SIGWX"))
      charts.sigwx.push(`https://ifis.airways.co.nz${item.attr("href")}`);
  });

  return charts;
}

module.exports = async () => {
  try {
    let html = await getBriefingData();

    const info = await getBriefInfo(html);

    const aerodromeList = await getAerodromeList(html);
    const allNotams = await getNotams(html);
    const allMet = await getMet(html);

    const aaw = await getAaw(html);
    const sigmet = await getSigmet(html);
    const charts = await getCharts(html);

    let aerodromes = aerodromeList.map(aerodrome => {
      let notams = allNotams.filter(notam => notam.aerodrome === aerodrome);
      let result = { aerodrome, notams, atis: null, metar: null, taf: null };

      let met = allMet.filter(met => met.aerodrome === aerodrome);
      for (obj of met) {
        result[obj.type.toLowerCase()] = obj.content;
      }

      return result;
    });

    return { info, aerodromes, aaw, sigmet, charts };
  } catch (error) {
    throw error;
  }
};
