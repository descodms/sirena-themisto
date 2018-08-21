const scrapperController = require('../controllers/scrapperController');
const Router = require('koa-router');
const router = new Router();

//koa-router

/* API ROUTES */
router.post('/api/start', scrapperController.start);

//fake route callbackURL
router.post('/api/callbackurl', scrapperController.call);

module.exports = router;
