var express = require('express');
var router = express.Router();
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var IncubadoraService = require('../service/incubadoraService');


var incubadoraService = new IncubadoraService();

router.get('/incubadoras', ensureLoggedIn('/login?fail=true'), function(req, res){
  

     incubadoraService.getIncubadoras().then((incubadoras) => {

    res.render('incubadoras/index', { incubadoras: incubadoras});

    }).catch((err) => {

    console.log(err);

  });
  
 
});




/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('login', { message: null });
});



router.get('/login', function (req, res) {
  if (req.query.fail)
    res.render('login', { message: 'Usuário e/ou senha incorretos!' });
  else
    res.render('login', { message: null });
});

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/incubadoras');
  });


module.exports = router;
