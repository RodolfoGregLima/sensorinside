var express = require('express');
var router = express.Router();
var moment = require('moment');
moment.locale('pt-BR', {
    longDateFormat: {
        L: 'YYYY-MM-DD',
        LTS: 'HH:mm:ss',
    }
});

//Obtem lista de recem nascido
//----------------------------------------------------------------------------------------------------------------------------------------
router.get('/', (req, res) => {

    global.conn.request().query`select idRecemNasc,nome,nomeMae from recemNasc;`
        .then((result) => {
            if (req.query.successCreate)
                res.render('recemNasc/index', { recensNasc: result.recordset, mensagem: 'Recém-Nascido Cadastrado com sucesso!' });
            else if (req.query.successEdit)
                res.render('recemNasc/index', { recensNasc: result.recordset, mensagem: 'Dados do Recém-Nascido alterados com sucesso!' });
            else if (req.query.successDelete)
                res.render('recemNasc/index', { recensNasc: result.recordset, mensagem: 'Recém-Nascido deletado com sucesso!' });
            else
                res.render('recemNasc/index', { recensNasc: result.recordset, mensagem: null });



        }).catch((err) => {

            console.log(err);
        })


});

//----------------------------------------------------------------------------------------------
router.get('/create', (req, res) => {

    global.conn.request().query`select * from incubadora where status = 0`
        .then((result) => {


            res.render('recemNasc/create',{incubadoras :result.recordset});

            
        }).catch(err => {

            // Se der algum erro imprime no console
            console.log(err);
        });

    

});

// Cadastra Recem Nascido
router.post('/create', (req, res) => {

    let nome = req.body.nome;
    let sexo = req.body.group1;
    let dateNasc = req.body.date;
    let timeNasc = req.body.time;
    let nomeMae = req.body.nomeMae;
    let nomePai = req.body.nomePai;
    var idIncubadora = req.body.idIncubadora;



    global.conn.request().query`insert into recemNasc values(${nome},${sexo},${dateNasc},${timeNasc},${nomeMae},${nomePai});SELECT SCOPE_IDENTITY() as idRecemNasc;`
        .then((result) => {

            let date = moment().format('l');
            let time = moment().format('LTS');
            
            global.conn.request().query`update incubadora set status = 1, dateInternacao = ${date}, timeInternacao = ${time},fkRecemNasc=${result.recordset[0].idRecemNasc} where idIncubadora = ${idIncubadora}`
                .then(() =>{

                    

                    res.redirect('/recemNasc?successCreate=true');


                }).catch(err => {

                    // Se der algum erro imprime no console
                    console.log(err);
                });


        }).catch(err => {

            // Se der algum erro imprime no console
            console.log(err);
        });

});

router.get('/delete/:id', function (req, res) {

    let id = req.params.id;

    global.conn.request().query`delete from recemNasc where idRecemNasc = ${id}`
        .then((result) => {

            res.redirect('/recemNasc/?successDelete=true');
        }).catch((err) => {

            console.log(err);
        })

});

// Detalhe de recém Nascido. Aqui também verifico se o recém nascido já está internado
//---------------------------------------------------------------------------------------------------
router.get('/details/:id', function (req, res) {

    let id = req.params.id;

    global.conn.request().query`select idRecemNasc, nome,sexo,CONVERT (varchar(10), dateNasc, 103) as date, CONVERT (varchar(10), timeNasc,108) as time,nomeMae,nomePai  from recemNasc where idRecemNasc = ${id}`
        .then((recemNascido) => {

            global.conn.request().query`select idIncubadora from incubadora where fkRecemNasc = ${id} `
                .then((result) => {

                    res.render('recemNasc/details', { data: recemNascido.recordset[0], internacao: result.recordset });
                }).catch((err) => {

                    console.log(err);
                })

        }).catch((err) => {

            console.log(err);
        })

});

// Obtem formulário para edição de recém-nascido
router.get('/edit/:id', function (req, res) {

    let id = req.params.id;



    global.conn.request().query`select idRecemNasc,nome,sexo,CONVERT (varchar(10), dateNasc) as date, CONVERT (varchar(10), timeNasc,108) as time,nomeMae,nomePai  from recemNasc where idRecemNasc = ${id}`
        .then((recemNasc) => {

            res.render('recemNasc/edit', { recemNasc: recemNasc.recordset[0] })
        }).catch((err) => {

            console.log(err);
        })

});

// Cadastra a edição dos dados do recém-nascido
router.post('/edit/:id', function (req, res) {

    let id = req.params.id;

    let nome = req.body.nome;
    let sexo = req.body.group1;
    let dateNasc = req.body.dateNasc;
    let timeNasc = req.body.timeNasc;
    let nomeMae = req.body.nomeMae;
    let nomePai = req.body.nomePai;

    global.conn.request().query`update recemNasc set nome = ${nome},sexo = ${sexo}, dateNasc = ${dateNasc},
    timeNasc = ${timeNasc}, nomeMae = ${nomeMae}, nomePai = ${nomePai} where idRecemNasc = ${id}`
        .then((recemNasc) => {

            res.redirect('/recemNasc?successEdit=true')
        }).catch((err) => {

            console.log(err);
        })

});





module.exports = router;