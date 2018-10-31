var express = require('express');
var router = express.Router();
var IncubadoraService = require('../service/incubadoraService');
var Incubadora = require('../models/incubadora')

 var incubadoraService = new IncubadoraService();

//  /*GET lista de Incubadoras. */
//  router.get('/', function(req, res, next) {



//   incubadoraService.getIncubadoras().then((incubadoras) => {

//   res.render('incubadoras/index', { incubadoras: incubadoras });
    
//    }).catch((err) => {
//      console.log(err); 
//   });
//  });



// GET Formulário de Cadastro de Incubadora
router.get('/create', function (req, res, next) {

res.render('incubadoras/create')
  
});

// POST Adiciona Incubadora
router.post('/create', function (req, res, next) {
    
  var incubadora = new Incubadora();

  incubadora.codigo = req.body.codigo;
  incubadora.status = 0;

  incubadoraService.postIncubadora(incubadora).then((resultado)=>{

    res.redirect('/incubadoras/');

  }); 
});

// GET obtem view de detalhe da incubadora selecionada

router.get('/details/:id', function (req, res, next) {


    incubadoraService.getIncubadoraPorId(req.params.id).then((incubadora)=>{

      res.render('incubadoras/details', { incubadora: incubadora });
      console.log(incubadora);

  });
});

//GET obtem medicao da incubadora

router.get('/medicao/:id', (req, res, next) => {

  incubadoraService.getMedicao(req.params.id).then((medicao)=>{

    res.json(medicao);


  
  });

});

//





module.exports = router;

