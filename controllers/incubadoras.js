var express = require('express');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

//---------------------------------------------------------------------------

router.get('/',  function (req, res) {


  global.conn.request().query`select r.nome,inc.idIncubadora, inc.status from incubadora as inc left join  recemNasc as r on r.idRecemNasc = inc.fkRecemNasc; `
    .then(result => {
      if (req.query.success)
        res.render('incubadoras/index', { incubadoras: result.recordset, mensagem: 'Incubadora cadastrada com Sucesso!' });
      else
        res.render('incubadoras/index', { incubadoras: result.recordset, mensagem: null });

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
  let tempMaxConfig = req.body.tempMaxConfig;
  let tempMinConfig = req.body.tempMinConfig;
  let umidMaxConfig = req.body.umidMaxConfig;
  let umidMinConfig = req.body.umidMinConfig;
  let status = 0;


  global.conn.request().query`insert into incubadora values(${status},${desc},${tempMaxConfig},${tempMinConfig},${umidMaxConfig},${umidMinConfig},null,null,null)`
    .then(resultado => {
      res.redirect('/incubadoras?success=true');
    }).catch(err => {
      // Se der algum erro imprime no console
      console.log(err);
    })

});

//---------------------------------------------------------------------------------
// GET obtem view de detalhe da incubadora selecionada

router.get('/details/:id', function (req, res, next) {

  let id = req.params.id;

  global.conn.request().query`select CONVERT (varchar(10), inc.dateInternacao, 103) as date, CONVERT (varchar(10), inc.timeInternacao,108) as time, CONVERT(varchar(7), inc.dateInternacao, 126) as dataMes,datepart(week, inc.dateInternacao) as dataSemana,CONVERT (varchar(10), inc.dateInternacao)as dataDia, datepart(week, getDate()) as dataSemanaAtual, * from incubadora as inc full join recemNasc as r on r.idRecemNasc = inc.fkRecemNasc where idIncubadora = ${id};`

    .then(resultado => {



      res.render('incubadoras/details', { incubadora: resultado.recordset[0] });

    }).catch(err => {
      // Se der algum erro imprime no console
      console.log(err);
    })


});

//----------------------------------------------------------------------------------------
// Deleta uma incubadora

router.get('/delete/:id', (req, res) => {

  let id = req.params.id;

  global.conn.request().query`delete from medicao where fkIncubadora = ${id};delete from incubadora where idIncubadora = ${id}`

    .then(resultado => {

      res.redirect('/incubadoras/');


    }).catch(err => {
      // Se der algum erro imprime no console
      console.log(err);
    })

})



//--------------------------------------------------------------------------------------------------
//Obtem view para alterar as informações da incubadora, no caso, a descrição.
router.post('/edit/:id', function (req, res, next) {

  
  let idIncubadora = req.params.id;

  let desc = req.body.desc;
  let tempMaxConfig = req.body.tempMaxConfig;
  let tempMinConfig = req.body.tempMinConfig;
  let umidMaxConfig = req.body.umidMaxConfig;
  let umidMinConfig = req.body.umidMinConfig;

  



  global.conn.request().query`update incubadora set descIncubadora = ${desc}, tempMaxConfig = ${tempMaxConfig},tempMinConfig = ${tempMinConfig}, umidMaxConfig = ${umidMaxConfig}, umidMinConfig = ${umidMinConfig} where idIncubadora = ${idIncubadora}`
    .then(() => {
      global.conn.request().query`select descIncubadora,tempMaxConfig,tempMinConfig,umidMaxConfig,umidMinConfig from incubadora where idIncubadora = ${idIncubadora}`
        .then((resultado) => {
          
          res.json(resultado.recordset[0]);
          
        }).catch(err => {

          // Se der algum erro imprime no console
          console.log(err);
        })


    }).catch(err => {
      // Se der algum erro imprime no console
      console.log(err);
    })

});

router.get('/alta/:id', (req, res) => {

  let idIncubadora = req.params.id;

  global.conn.request().query`delete from medicao where fkIncubadora = ${idIncubadora};update incubadora set status = 0, fkRecemNasc = null, dateInternacao = null, timeInternacao = null where idIncubadora = ${idIncubadora};`
              .then(() => {

                  res.redirect('/incubadoras');
              }).catch((err) => {
                  console.log(err);
              });

});




module.exports = router;

