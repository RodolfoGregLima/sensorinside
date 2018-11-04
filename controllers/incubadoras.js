var express = require('express');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const sql = require('mssql')
const config = require('../config');


//---------------------------------------------------------------------------

router.get('/', ensureLoggedIn('/login?fail=true'), function (req, res) {

  sql.connect(config).then(() => {
     return sql.query`select * from incubadora`
  }).then(result => {
    sql.close()
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

  let codigo = req.body.codigo;
  let status = 0;

  sql.connect(config).then(() => {
      return sql.query`insert into incubadora values(${codigo},${status})`
  }).then(resultado => {
      sql.close()
      res.redirect('/incubadoras');
  }).catch(err => {
    // Se der algum erro imprime no console
      sql.close()
      console.log(err);
  })

  });

//---------------------------------------------------------------------------------

// GET obtem view de detalhe da incubadora selecionada

router.get('/details/:id', function (req, res, next) {

  let id = req.params.id;

  sql.connect(config).then(() => {

    return sql.query`select * from incubadora where idIncubadora = ${id}`

  }).then(resultado => {

    sql.close()
    res.render('incubadoras/details', { incubadora: resultado.recordset[0]});
    console.log( resultado.recordset[0])

  }).catch(err => {
    // Se der algum erro imprime no console
    sql.close()
    console.log(err);
  })

 
});

//-----------------------------------------------------------------------------------
//GET obtem medicao da incubadora

router.get('/medicao/:id', (req, res, next) => {

  let id = req.params.id;

  sql.connect(config).then(() => {

    return sql.query`select Max(idMedicao), temperatura, umidade from medicao where fkIncubadora = ${id} group by idMedicao, temperatura, umidade`

  }).then(resultado => {

    sql.close()
    res.json(resultado.recordset[0]);

  }).catch(err => {
    // Se der algum erro imprime no console
    sql.close()
    console.log(err);
  })

});

//





module.exports = router;

