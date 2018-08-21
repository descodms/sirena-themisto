const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const errorHandler = require('koa-better-error-handler');
const koa404Handler = require('koa-404-handler');
const puppeteer = require('puppeteer');

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
