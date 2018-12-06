var express = require('express');
var router = express.Router();
const Cryptr = require('cryptr');
const cryptr = new Cryptr('2012');

// Exibe a lista de usuários

router.get('/', function (req, res) {

    global.conn.request().query`select idUsuario, nome, email from usuario`
        .then((result) => {

            if (req.query.successCreate)
            res.render('usuarios/index', { usuarios: result.recordset , mensagem: 'Usuário Cadastrado com sucesso!' });
        else if (req.query.failCreate)
            res.render('usuarios/index', { usuarios: result.recordset,  mensagem: 'Usuário já existe!' });
       
        else{
            res.render('usuarios/index', { usuarios: result.recordset, mensagem: null });
        }    
            

        })
        .catch((err) => {

            console.log(err);
        })

})



// Obtem a view do formulário de cadastro de usuário
router.get('/create', function (req, res) {

    if (req.query.failCreate)
    res.render('usuarios/create', { mensagem: 'Usuário já existe!' });

    else{
    res.render('usuarios/create', { mensagem: null });
    }    

    

});

//Cadastra o usuário
router.post('/create', function (req, res, next) {

    let email = req.body.email;

    global.conn.request().query`select * from usuario where email = ${email}`
        .then(resultado => {

            

            if (resultado.recordset.length > 0)
                res.redirect('/users/create?failCreate=true');
            else
                next();

        }).catch(err => {
            // Se der algum erro imprime no console
            console.log(err);
        })
}, (req, res) => {


    let nome = req.body.nome;
    //Criptografa a senha
    let senha = cryptr.encrypt(req.body.senha);

    let email = req.body.email;

    global.conn.request().query`insert into usuario values(${nome}, ${senha},${email})`
        .then(() => {
            res.redirect('/users?successCreate=true')

        }).catch((err) => {
            console.log(err);

        })

});


router.get('/delete/:id', function (req, res) {

    let id = req.params.id;

    global.conn.request().query`delete from usuario where idUsuario = ${id}`
        .then((result) => {

            res.redirect('/users/');
        }).catch((err) => {

            console.log(err);
        })

});



module.exports = router;
