var express = require('express');
var router = express.Router();
var passport = require('passport');
var ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('index', { message: null });
});


router.get('/login',ensureLoggedOut('/incubadoras'), function (req, res) {
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

  //Desloga do sistema
router.get('/logout', (req, res)=>{
  req.session.destroy(function (err) {
    res.redirect('/login'); 
  });

})

  


module.exports = router;
