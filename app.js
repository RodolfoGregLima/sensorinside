var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var expressLayouts = require('express-ejs-layouts')
var passport = require('passport')
var session = require('express-session');

require('./controllers/authController')(passport);


var indexRouter = require('./controllers/indexController');
var usersRouter = require('./controllers/usersController');
var incubadorasRouter = require('./controllers/incubadorasController');
var recemNascidosRouter = require('./controllers/recemNascidosController');

const app = express();

app.use(session({
    secret: '123',//configure um segredo seu aqui
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/incubadoras', incubadorasRouter);
app.use('/recemNascidos', recemNascidosRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;