const puppeteer = require("puppeteer");

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

  briefingLoaded: ".notamSectionHeader"
};

const credentials = {
  username: "metscope",
  password: "iamar0bot"
};

(async () => {
  console.log("RUNNING SCRIPT");
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
  console.log("LOGIN SUCCESSFUL");

  // Navigate to briefing selection and wait for load
  await page.goto(pages.areaBriefing);
  await page.waitForSelector(selectors.briefingAreas);

  // Input briefing request
  await page.click(selectors.ATIS);
  await page.click(selectors.METAR);
  await page.click(selectors.TAF);
  await page.click(selectors.briefingAreas);
  await page.keyboard.type("1 2 3 4 5 6 7 8 9 10");
  await page.click(selectors.aawAreas);
  await page.keyboard.type(
    "FN TA ED TK CP MH SA DV ST TN KA WW AL PL FD CY GE"
  );

  // Submit brief request and wait for redirect
  await page.click(selectors.submit);
  await page.waitForSelector(selectors.briefingLoaded);
  console.log("REQUEST SUCCESSFUL");

  const data = await page.content();
  console.log(data);

  await browser.close();
})();
