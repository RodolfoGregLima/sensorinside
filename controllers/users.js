var express = require('express');
var router = express.Router();
const Cryptr = require('cryptr');
var Usuario = require('../models/usuario');
var UsuarioService = require('../service/usuarioService');
usuarioServie = new UsuarioService();
const cryptr = new Cryptr('2012');

// Exibe a lista de usuários

router.get('/', function (req, res) {

    global.conn.request().query`select nome, email from usuario`
    .then((result)=>{

        res.render('usuarios/index',{usuarios : result.recordset});

    })
    .catch((err)=>{

        console.log(err);
    })
    
})



// Obtem a view do formulário de cadastro de usuário
router.get('/create', function (req, res) {


    if (req.query.success)
        res.render('usuarios/create', { menssagem: 'Usuário Cadastrado com sucesso!' });
    else
        res.render('usuarios/create', {menssagem : null });
   
});

router.post('/create', function (req, res) {

    const usuario = new Usuario();

    usuario.nome = req.body.nome;
                    //Criptografa a senha
    usuario.senha = cryptr.encrypt(req.body.senha);
    
    usuario.email = req.body.email;

    usuarioServie.cadUsuario(usuario).then( (params) =>{
        
    });;

    res.redirect('create/?success=true');
    
});




module.exports = router;
