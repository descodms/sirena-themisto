const puppeteer = require('puppeteer');
const axios = require('axios');
const config = require('config');

//TODO login (Themisto) with request credentials on provider url
//TODO bug: category, discountPrice
exports.call = ctx => {
  console.log('callbackURL');
  console.log(ctx.request.body);
};

exports.start = ctx => {
  const searchQuery = ctx.request.body.searchQuery;
  const response = {
    status: 'ok',
  };
  ctx.body = response;
  scrape(searchQuery);
};

let scrape = async searchQuery => {
  let page = {};
  let products = [];
  try {
    const browser = await puppeteer.launch({ headless: true });
    [page] = await browser.pages();
  } catch (error) {
    console.log('error at launch', error);
  }
  page.on('error', err => {
    // console.log('error happen at the page: ', err);
  });
  page.on('pageerror', pageerr => {
    // console.log('pageerror occurred: ', pageerr);
  });
  const searchURL = `https://www.easy.com.ar/webapp/wcs/stores/servlet/SearchDisplay?storeId=10151&catalogId=10051&langId=-5&pageSize=1&beginIndex=0&searchSource=Q&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&pageView=image&searchTerm=${searchQuery}`;
  try {
    await page.goto(searchURL, { waitUntil: 'networkidle2' });
  } catch (error) {
    console.log('error search url', error);
  }

  initialItem = 0;
  totalItem = await page.evaluate(() => {
    return document.querySelector('.search-results').textContent.trim();
  });
  totalItem--;
  console.log(totalItem);
  totalItem = 50;

  for (let index = 16; index < totalItem; index++) {
    let product = {};
    //navigate through products via url
    let searchURL = `https://www.easy.com.ar/webapp/wcs/stores/servlet/SearchDisplay?storeId=10151&catalogId=10051&langId=-5&pageSize=1&beginIndex=${index}&searchSource=Q&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&pageView=image&searchTerm=${searchQuery}`;
    try {
      await page.goto(searchURL, { waitUntil: 'networkidle2' });
    } catch (error) {
      console.log('error search url dentro del for', error);
    }

    //click on each product
    try {
      const [response] = await Promise.all([
        page.waitForSelector(`#WC_CatalogSearchResultDisplay_div_6_1`),
        page.waitForNavigation(),
        page.click(`#WC_CatalogSearchResultDisplay_div_6_1`),
      ]);
    } catch (error) {
      console.log('error en click/wait selectors');
    }
    try {
      await page.waitForSelector('#breadcrumb');
    } catch (error) {
      console.log('breadcrumb');
    }

    //grab the data for each product
    try {
      //! some products fail at this
      product.category = await page.$eval(
        '#breadcrumb > a:nth-child(3)',
        item => item.href,
      );
    } catch (error) {
      console.log('error en category');
      product.category = '';
    }
    try {
      //! some products fail at this
      product.discountPrice = await page.$eval(
        '.product-description .price-mas',
        item => item.textContent.trim(),
      );
    } catch (error) {
      console.log('error en discountPrice');
      product.discountPrice = '';
    }
    try {
      product.name = await page.$eval(
        '.product-description .prod-title',
        item => item.textContent.trim(),
      );
    } catch (error) {
      console.log('error en name');
      product.name = '';
    }
    try {
      product.sku = await page.$eval(
        '.product-description > span:nth-child(3)',
        item => item.textContent.trim(),
      );
    } catch (error) {
      console.log('error en sku');
      product.sku = '';
    }
    try {
      product.price = await page.$eval('.product-description .price-e', item =>
        item.textContent.trim(),
      );
    } catch (error) {
      console.log('error en price');
      product.price = '';
    }
    try {
      product.description = product.name;
    } catch (error) {
      console.log('error en description');
      product.description = '';
    }
    try {
      product.images = `https://easyar.scene7.com/is/image/EasyArg/${
        product.sku
      }`;
    } catch (error) {
      console.log('error en images');
      product.images = '';
    }

    const l = products.push(product);
    console.log(l);
    console.log(product);
  }

  const results = {
    searchQuery,
    products,
    /*products: [
      {
        name: 'Tremendous Chair',
        sku: '1234412',
        price: '50.0',
        category: 'silla de aquellas no hay mas',
        description: 'la mejó silla del monde',
        images: [
          'http://globallingo.co/wp-content/uploads/2018/08/ethan-allen-charlotte-nc-medium-size-of-tremendous-chair-alt-chair-in-chairs-ethan-allen-charlotte-north-carolina.jpg',
          'http://www.binkily.com/wp-content/uploads/2018/02/frightening-beach-lounge-chair-unusual-furniture-fill-your-home-with-tremendous-chairs-walmart.jpeg',
        ],
      },
      {
        name: 'Horrible Chair',
        sku: '98989',
        price: '02.0',
        category: 'worst chairs',
        description: 'la worst silla del monde',
        images: [
          'http://globallingo.co/wp-content/uploads/2018/08/ethan-allen-charlotte-nc-medium-size-of-tremendous-chair-alt-chair-in-chairs-ethan-allen-charlotte-north-carolina.jpg',
          'http://www.binkily.com/wp-content/uploads/2018/02/frightening-beach-lounge-chair-unusual-furniture-fill-your-home-with-tremendous-chairs-walmart.jpeg',
        ],
      },
      {
        name: 'cuasimanous cucionsa',
        sku: '44444',
        price: '44.0',
        category: 'silla de aquellas no hay mas',
        description: 'la cucucu silla del cucu',
        images: [
          'http://globallingo.co/wp-content/uploads/2018/08/ethan-allen-charlotte-nc-medium-size-of-tremendous-chair-alt-chair-in-chairs-ethan-allen-charlotte-north-carolina.jpg',
          'http://www.binkily.com/wp-content/uploads/2018/02/frightening-beach-lounge-chair-unusual-furniture-fill-your-home-with-tremendous-chairs-walmart.jpeg',
        ],
      },
    ],*/
  };
  console.log(results);
  await page.close();
  page.on('close', postResults(results));
  // postResults(results);
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
