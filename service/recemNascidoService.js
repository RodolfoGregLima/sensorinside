var Request = require('tedious').Request;
var Connection = require('tedious').Connection;
var RecemNascido = require('../models/recemNascido');
var TYPES = require('tedious').TYPES; 

module.exports = class RecemNascidoService {
    constructor() {

        this.config = {
            server: 'tbtt.database.windows.net',
            userName: 'bandtec',
            password: 'TBTTprojeto5'

            , options: {
                debug: {
                    packet: true,
                    data: true,
                    payload: true,
                    token: false,
                    log: true
                },
                database: 'TheBigTecTheory',
                encrypt: true // for Azure users
            }

        }

    }

    //Obtem lista de recem nascidos

    getRecemNascidos() {

        return new Promise((resolve, reject) => {

            const connection = new Connection(this.config);
            let listaRecemNascidos = [];

            connection.on('connect', function (err) {
                // If no error, then good to go...

                const request = new Request("select * from RecemNascido ", function (err, rowCount) {
                    if (err) {
                        reject(err)
                    } else {
                        console.log(rowCount + ' rows')
                    }

                    connection.close()
                })

                request.on('row', function (columns) {

                    var recemNascido = new RecemNascido();
                    
                    recemNascido.idRecemNascido = columns[0].value;
                    recemNascido.horaNascimento = columns[1].value;
                    recemNascido.dataNascimento = columns[2].value;
                    recemNascido.nome = columns[3].value;
                    recemNascido.sexo = columns[4].value;
                    recemNascido.nomeMae = columns[5].value;
                    recemNascido.nomePai = columns[6].value;
                    recemNascido.pesoNascimento = columns[7].value;
                    recemNascido.pesoInternacao = columns[8].value;

                    listaRecemNascidos.push(recemNascido);

                    resolve(listaRecemNascidos);


                });

                // In SQL Server 2000 you may need: connection.execSqlBatch(request);
                connection.execSql(request)

            }
            );

     
        });
    }

}