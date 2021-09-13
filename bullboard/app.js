var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Queue = require('bull')
const { createBullBoard } = require('@bull-board/api')
const { BullAdapter } = require('@bull-board/api/bullAdapter')
const { ExpressAdapter } = require('@bull-board/express')

//var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let details = { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST }
if( process.env.REDIS_PASSWORD) {
  details.password = process.env.REDIS_PASSWORD
}

const bullQueue1 = new Queue('get query graph', process.env.REDIS_HOST ?
    { redis: details } : 'redis://127.0.0.1:6379')
const bullQueue2 = new Queue('get query graph by team', process.env.REDIS_HOST ?
    { redis: details } : 'redis://127.0.0.1:6379')
const bullQueue3 = new Queue('get query graph by api', process.env.REDIS_HOST ?
    { redis: details } : 'redis://127.0.0.1:6379')

const serverAdapter = new ExpressAdapter();
const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [
    new BullAdapter(bullQueue1),
    new BullAdapter(bullQueue2),
    new BullAdapter(bullQueue3),
  ],
  serverAdapter:serverAdapter
})

//app.use('/', indexRouter);
//serverAdapter.setBasePath('/')
app.use('/', serverAdapter.getRouter());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
