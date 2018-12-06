var express = require('express');
var router = express.Router();
var stats = require('stats-lite');

//GET obtem medicao da incubadora
//------------------------------------------------------------------------------------------------------------
router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  global.conn.request().query`select Top(1) temperatura, umidade, CONVERT (varchar(10), dataMed) as date, CONVERT (varchar(10), timeMed,108) as time from medicao  where fkIncubadora = ${id} order by idMedicao desc ;`

    .then(resultado => {

      res.json(resultado.recordset[0]);
     

    }).catch(err => {
      // Se der algum erro imprime no console
      console.log(err);
    })

});

// Obtem estatisticas do dia selecionado
//---------------------------------------------------------------------------------------------------------
router.post('/estatisticaDia/:id', (req, res, next) => {

  let id = req.params.id

  let date = req.body.dia;



  global.conn.request().query`select  temperatura, umidade from medicao where dataMed = ${date} and fkIncubadora = ${id};`

    .then(resultado => {


      let temperatura = [];
      let umidade = [];

      for (data of resultado.recordset) {

        temperatura.push(data.temperatura);
        umidade.push(data.umidade);
      }

      let estatistica = getEstatistica(temperatura, umidade);

      res.json(estatistica);

    }).catch(err => {
      // Se der algum erro imprime no console
      console.log(err);
    })

});

// Obtem estatisticas da semana selecionada
//---------------------------------------------------------------------------------------------------------

router.post('/estatisticaSemana/:id', (req, res, next) => {

  let id = req.params.id
  let semana = req.body.semana;
  

  global.conn.request().query`select temperatura, umidade from medicao where DATEPART(WEEK,dataMed) = ${semana} and fkIncubadora = ${id};`

    .then(resultado => {


      let temperatura = [];
      let umidade = [];

      for (data of resultado.recordset) {

        temperatura.push(data.temperatura);
        umidade.push(data.umidade);
      }

      let estatistica = getEstatistica(temperatura, umidade);

      res.json(estatistica);

    }).catch(err => {
      // Se der algum erro imprime no console
      console.log(err);
    })

});


// Obtem estatisticas do mes selecionado
//---------------------------------------------------------------------------------------------------------

router.post('/estatisticaMes/:id', (req, res, next) => {

  let id = req.params.id
  let mes = req.body.mes;

  global.conn.request().query`select temperatura, umidade from medicao where DATEPART(MONTH,dataMed) = DATEPART(MONTH,${mes}) and fkIncubadora = ${id};`

    .then(resultado => {


      let temperatura = [];
      let umidade = [];

      for (data of resultado.recordset) {

        temperatura.push(data.temperatura);
        umidade.push(data.umidade);
      }

      let estatistica = getEstatistica(temperatura, umidade);

      res.json(estatistica);

    }).catch(err => {
      // Se der algum erro imprime no console
      console.log(err);
    })

});


// Aqui é realizado o cálculos de estatisticas
//----------------------------------------------------------------------------
function getEstatistica(temperatura, umidade) {


  let estatisticas = {
    //Estatisticas temperatura
    mediaTemp: parseInt(stats.mean(temperatura)),
    medianaTemp: parseInt(stats.median(temperatura)),
    dvPdTemp: parseInt(stats.stdev(temperatura)),
    q1Temp: parseInt(stats.percentile(temperatura, 0.25)),
    q3Temp: parseInt(stats.percentile(temperatura, 0.75)),
    minTemp: Math.min(...temperatura),
    maxTemp: Math.max(...temperatura),

    //Estatisticas umidade
    mediaUmid: parseInt(stats.mean(umidade)),
    medianaUmid: parseInt(stats.median(umidade)),
    dvPdUmid: parseInt(stats.stdev(umidade)),
    q1Umid: parseInt(stats.percentile(umidade, 0.25)),
    q3Umid: parseInt(stats.percentile(umidade, 0.75)),
    minUmid: Math.min(...umidade),
    maxUmid: Math.max(...umidade)
  };

  return estatisticas;

};


module.exports = router;