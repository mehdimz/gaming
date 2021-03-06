var compression = require('compression');
var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

var app = express();
app.disable('x-powered-by');

app.locals.prefix = process.env.NODE_ENV == 'production' ? 'http://cdn.bazivision.com/public' : '';

// var oneYear = 31557600000;
app.use(compression());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'lib/storage')));
// app.use(express.static(path.join(__dirname, 'public'), { maxAge: oneYear }));
// app.use(express.static(path.join(__dirname, 'lib/storage'), { maxAge: oneYear }));

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: require('./lib/back/db').connection
  })
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(require('./lib/back/common_variables'));
app.use('/', require('./lib/back'));
app.use(logger('dev'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('صفحه مورد نظر یافت نشد');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      errorObject: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: 'صفحه مورد نظر یافت نشد',
    hiddenMessage: err.message,
    // error: {}
  });
});


module.exports = app;
