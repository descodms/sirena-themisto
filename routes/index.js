const scrapperController = require('../controllers/scrapperController');
const Router = require('koa-router');
const router = new Router();

//koa-router

/* API ROUTES */
router.post('/api/start', scrapperController.start);
// router.post('/api/product/search', scrapperController.crawlerTest);

module.exports = router;
