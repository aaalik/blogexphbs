var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var session = require('express-session');
var cookieSession = require('cookie-session');
var hbsutils = require('hbs-utils')(hbs);

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
hbsutils.registerPartials(`${__dirname}/views/partials`);
hbsutils.registerWatchedPartials(`${__dirname}/views/partials`);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// create session 
// app.set('trust proxy', 1) // trust first proxy
app.use(cookieSession({
	name: 'expsession',
    secret: 'keyboard cat',
    resave: false,
  	saveUninitialized: true,
  	cookie: { secure: false }
}));

// make it global
// app.use(function (req, res, next) {
//     res.locals.session = req.session;
//     next();
// });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(`${__dirname}/node_modules/jquery/dist`));
app.use('/material', express.static(`${__dirname}/node_modules/bootstrap-material-design/dist`));
app.use('/popper', express.static(`${__dirname}/node_modules/popper.js/dist`));
app.use('/bootstrap', express.static(`${__dirname}/node_modules/bootstrap/dist`));
app.use('/sbadmin', express.static(`${__dirname}/node_modules/startbootstrap-sb-admin-2/dist`));
app.use('/addon', express.static(`${__dirname}/node_modules/startbootstrap-sb-admin-2/vendor`));
app.use('/customcss', express.static(`${__dirname}/public/stylesheets`));
app.use('/customjs', express.static(`${__dirname}/public/javascripts`));
app.use('/quill', express.static(`${__dirname}/node_modules/quill/dist`));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.all('/users/*', requireLogin);
app.use('/', index);
app.use('/users', requireLogin, users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

// buat filter login
function requireLogin(req, res, next) {
  if (req.session.loggedIn) {
    next(); // allow the next route to run
  } else {
    // require the user to log in
    res.redirect("/login"); // or render a form, etc.
  }
}


module.exports = app;
