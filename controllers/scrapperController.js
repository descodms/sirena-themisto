const puppeteer = require('puppeteer');
const axios = require('axios');

exports.start = ctx => {
  console.log('start themisto');
  console.log(ctx.request.body);
  const searchOrderId = ctx.request.body.searchOrderId;
  const searchQuery = ctx.request.body.searchQuery;
  const response = {
    status: 'proccessing',
    searchOrderId,
  };
  ctx.body = response;
  scrape(searchQuery, searchOrderId);
};

let scrape = async (searchQuery, searchOrderId) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const LENGTH_SELECTOR_CLASS = 'category-all';
  // const LENGTH_SELECTOR_CLASS = 'user-list-item';
  // > div:nth-child(INDEX)
  const PRICE_SELECTOR_CLASS = '.thumb-price-e';
  //#catalogEntry_img217189 > img
  const searchURL = `https://www.easy.com.ar/webapp/wcs/stores/servlet/SearchDisplay?storeId=10151&catalogId=10051&langId=-5&pageSize=12&beginIndex=0&searchSource=Q&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&pageView=image&searchTerm=${searchQuery}`;
  await page.goto(searchURL);
  // await page.waitForSelector('.category-all');
  // await page.click('');
  const stories = await page.evaluate(() => {
    const links = document.querySelector('div.category-all > div');
    // const links = Array.from(document.querySelectorAll('.category-all'));
    return links;
    // return links.map(link => link.href).slice(0, 10);
  });
  browser.close();
  // console.log(stories);
  await page.waitFor(5000);
  //when the page closes (scrapping is over) calls the Ganymede Report API for posting results
  const results = {
    searchOrderId,
    searchQuery,
    name: 'Tremendous Chair',
    sku: '1234412',
    price: '50.0',
    category: 'silla de aquellas',
    description: 'la mejó silla del monde',
    images: [
      'http://globallingo.co/wp-content/uploads/2018/08/ethan-allen-charlotte-nc-medium-size-of-tremendous-chair-alt-chair-in-chairs-ethan-allen-charlotte-north-carolina.jpg',
      'http://www.binkily.com/wp-content/uploads/2018/02/frightening-beach-lounge-chair-unusual-furniture-fill-your-home-with-tremendous-chairs-walmart.jpeg',
    ],
  };

  // page.on('close', postResults(results));
  // return result;
};

const postResults = data => {
  console.log('postResults');
  console.log(data);
};

// scrape().then(value => {
//   console.log('value?');
//   console.log(value); // Success!
// });
