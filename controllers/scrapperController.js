const puppeteer = require('puppeteer');
const axios = require('axios');
const config = require('config');

exports.start = ctx => {
  console.log('start themisto');
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
  const searchURL = `https://www.easy.com.ar/webapp/wcs/stores/servlet/SearchDisplay?storeId=10151&catalogId=10051&langId=-5&pageSize=12&beginIndex=0&searchSource=Q&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&pageView=image&searchTerm=${searchQuery}`;
  await page.goto(searchURL);
  await page.waitFor(3000);

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
  const results = {
    searchOrderId,
    searchQuery,
    products: [
      {
        status: 'processed',
        name: 'Tremendous Chair',
        sku: '1234412',
        price: '50.0',
        categoryName: 'silla de aquellas no hay mas',
        description: 'la mejó silla del monde',
        images: [
          'http://globallingo.co/wp-content/uploads/2018/08/ethan-allen-charlotte-nc-medium-size-of-tremendous-chair-alt-chair-in-chairs-ethan-allen-charlotte-north-carolina.jpg',
          'http://www.binkily.com/wp-content/uploads/2018/02/frightening-beach-lounge-chair-unusual-furniture-fill-your-home-with-tremendous-chairs-walmart.jpeg',
        ],
      },
      {
        status: 'processed',
        name: 'Horrible Chair',
        sku: '98989',
        price: '02.0',
        categoryName: 'worst chairs',
        description: 'la worst silla del monde',
        images: [
          'http://globallingo.co/wp-content/uploads/2018/08/ethan-allen-charlotte-nc-medium-size-of-tremendous-chair-alt-chair-in-chairs-ethan-allen-charlotte-north-carolina.jpg',
          'http://www.binkily.com/wp-content/uploads/2018/02/frightening-beach-lounge-chair-unusual-furniture-fill-your-home-with-tremendous-chairs-walmart.jpeg',
        ],
      },
      {
        status: 'processed',
        name: 'cuasimanous cucionsa',
        sku: '44444',
        price: '44.0',
        categoryName: 'silla de aquellas no hay mas',
        description: 'la cucucu silla del cucu',
        images: [
          'http://globallingo.co/wp-content/uploads/2018/08/ethan-allen-charlotte-nc-medium-size-of-tremendous-chair-alt-chair-in-chairs-ethan-allen-charlotte-north-carolina.jpg',
          'http://www.binkily.com/wp-content/uploads/2018/02/frightening-beach-lounge-chair-unusual-furniture-fill-your-home-with-tremendous-chairs-walmart.jpeg',
        ],
      },
    ],
  };
  // postResults(results);
  page.on('close', postResults(results));
  browser.close();
  // return result;
};

//when the scrapping is over, calls the API in Ganymede for posting results
const postResults = data => {
  console.log('postResults');
  const ganymedeAPI = config.get('Ganymede.API');
  axios
    .post(ganymedeAPI.url, { data })
    .then(response => {
      handleResponse(response);
    })
    .catch(error => {
      handleResponseError(error);
    });
};

const handleResponse = response => {
  console.log('handleResponse: scrapper');
};

const handleResponseError = error => {
  console.log('handleResponseError', error);
};

// scrape().then(value => {
//   console.log('value?');
//   console.log(value); // Success!
// });
