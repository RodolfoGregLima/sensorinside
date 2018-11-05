var express = require('express');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

//---------------------------------------------------------------------------

router.get('/', ensureLoggedIn('/login?fail=true'), function (req, res) {

  
  global.conn.request().query`select * from incubadora`
  .then(result => {
       res.render('incubadoras/index', { incubadoras: result.recordset });    
   }).catch(err => {
       console.dir(err);
  })


});

//----------------------------------------------------------------------

// GET Formulário de Cadastro de Incubadora
router.get('/create', function (req, res, next) {
   res.render('incubadoras/create')

});

//-----------------------------------------------------------------------------------

// POST Adiciona Incubadora
router.post('/create', function (req, res, next) {

  let desc = req.body.desc;
  let status = 0;

  
  global.conn.request().query`insert into incubadora values(${status},${desc})`
  .then(resultado => {
           res.redirect('/incubadoras');
  }).catch(err => {
    // Se der algum erro imprime no console
        console.log(err);
  })

  });

//---------------------------------------------------------------------------------

// GET obtem view de detalhe da incubadora selecionada

router.get('/details/:id', function (req, res, next) {

  let id = req.params.id;

  global.conn.request().query`select * from incubadora where idIncubadora = ${id}`

  .then(resultado => {

    res.render('incubadoras/details', { incubadora: resultado.recordset[0]});
    console.log( resultado.recordset[0])

  }).catch(err => {
    // Se der algum erro imprime no console
    console.log(err);
  })

 
});

//-----------------------------------------------------------------------------------
//GET obtem medicao da incubadora

router.get('/medicao/:id', (req, res, next) => {

  let id = req.params.id;

  global.conn.request().query(`select Max(idMedicao), temperatura, umidade from medicao where fkIncubadora = ${id} group by idMedicao, temperatura, umidade`)
  
  .then(resultado => {

    res.json(resultado.recordset[0]);

  }).catch(err => {
    // Se der algum erro imprime no console
    console.log(err);
  })

});

//





module.exports = router;

