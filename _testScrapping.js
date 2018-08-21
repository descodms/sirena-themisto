const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const errorHandler = require('koa-better-error-handler');
const koa404Handler = require('koa-404-handler');
const puppeteer = require('puppeteer');
const HCCrawler = require('headless-chrome-crawler');

const app = new Koa();
app.context.onerror = errorHandler;
app.context.api = true;
app.use(koa404Handler);

const router = require('./routes/index');
// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

//register bodyParser
app.use(bodyParser());
//register router
app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT);

// $( "div span:first-child" )
// $( "span:first-of-type" )
//$( "td:eq( 2 )" )
// css selectors: nth-child(2) nth-of-type
const scrape = async () => {
  const crawler = await HCCrawler.launch({
    // Function to be evaluated in browsers
    evaluatePage: () => ({
      link: $$(
        '.category-all > div > div > div > div > div > div > div > div > a',
      )
        .attr('href')
        .trim(),

      // .attr('href')
      // .trim(),
    }),
    // Function to be called with evaluated results from browsers
    onSuccess: result => {
      console.log(result.result);
    },
  });

  searchQuery = 'sillas';
  const searchURL = `https://www.easy.com.ar/webapp/wcs/stores/servlet/SearchDisplay?storeId=10151&catalogId=10051&langId=-5&pageSize=12&beginIndex=0&searchSource=Q&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&pageView=image&searchTerm=${searchQuery}`;
  await crawler.queue(searchURL);
  // Queue a request
  // await crawler.queue('https://example.com/');
  // Queue multiple requests
  // await crawler.queue(['https://example.net/', 'https://example.org/']);
  // Queue a request with custom options
  // await crawler.queue({
  //   url: 'https://example.com/',
  //   // Emulate a tablet device
  //   device: 'Nexus 7',
  //   // Enable screenshot by passing options
  //   screenshot: {
  //     path: './tmp/example-com.png',
  //   },
  // });
  await crawler.onIdle(); // Resolved when no queue is left
  await crawler.close(); // Close the crawler
};

scrape();

// puppeteerScrapping = () => {
// await page.waitForSelector(`#WC_CatalogSearchResultDisplay_div_6_12`);
// let links = [];
// for (let index = 0; index < 13; index++) {
//   const selector = await page.$eval(
//     '.category-all > div > div > div > div > div > div > div > div > a',
//     item => item.href,
//   );
//   links.push(selector);
// }
// console.log(links);
// const divSearchResult1 = await page.$$(
//   '#Search_Result_div > div.center-content-area:nth-child(2) > div.category-all:nth-child(3)',
// );
// console.log(divSearchResult1);
// const results = divSearchResult1.map(div => {
//   console.log(div);
//   // div.$('div > div > div > div > div > div > div > a').href.trim();
// });
// console.log(results);
// const selector2 = await page.$$('.category-all');
// console.log(selector);
// const result = selector.map(select => {
//   console.log(select);
// });
// const result2 = selector2.map(select => {
//   console.log('select');
// });
//  }

// const browser = await puppeteer.launch({ headless: false });
// const page = await browser.newPage();
// searchQuery = 'sillas';
// const searchURL = `https://www.easy.com.ar/webapp/wcs/stores/servlet/SearchDisplay?storeId=10151&catalogId=10051&langId=-5&pageSize=12&beginIndex=0&searchSource=Q&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&pageView=image&searchTerm=${searchQuery}`;
// await page.goto(searchURL);
// await page.waitForSelector('.category-all');
// const evaluate = await page.evaluate(() => {
//   const query = document.querySelectorAll('.category-all');
//   console.log(query);
// });
// await page.click('.category-all > div:nth-child(3)');

// await page.waitFor(1000);
// browser.close();
// const LENGTH_SELECTOR_CLASS = 'category-all';
// const LENGTH_SELECTOR_CLASS = 'user-list-item';
// const PRICE_SELECTOR_CLASS = '.thumb-price-e';
// > div:nth-child(INDEX)
//#catalogEntry_img217189 > img
// await page.waitForSelector('.category-all');
// await page.click('');
// const stories = await page.evaluate(() => {
// const links = document.querySelector('div.category-all > div');
// const links = Array.from(document.querySelectorAll('.category-all'));
// return links;
// return links.map(link => link.href).slice(0, 10);
// });
