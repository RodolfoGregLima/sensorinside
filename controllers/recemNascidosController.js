var express = require('express');
var router = express.Router();
var RecemNascidoService = require('../service/recemNascidoService');
var RecemNascido = require('../models/recemNascido');

var recemNascidoService = new RecemNascidoService();

// GET Lista de recem nascidos

router.get('/',function(req,res,next) {
    recemNascidoService.getRecemNascidos().then((recemNascidos) => {
        res.render('recemNascidos/index',{recemNascidos : recemNascidos});
    }).catch((err) => {
        console.log(err);
    })
})

module.exports = router;