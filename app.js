var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var cors = require('cors');



require('./controllers/auth')(passport);


var sessionRouter = require('./controllers/session');
var usersRouter = require('./controllers/users');
var incubadorasRouter = require('./controllers/incubadoras');
var medicaoRouter = require('./controllers/medicao');
var recemNasc = require('./controllers/recemNasc');


const app = express();
app.use(cors())



app.use(session({
    secret: '123',//configure um segredo seu aqui
    resave: false,
    saveUninitialized: false,
}));



app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', sessionRouter);
app.use('/users', usersRouter);
app.use('/incubadoras', incubadorasRouter);
app.use('/medicao', medicaoRouter);
app.use('/recemNasc', recemNasc);


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
    

