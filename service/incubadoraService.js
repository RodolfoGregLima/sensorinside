var Request = require('tedious').Request;
var Connection = require('tedious').Connection;
var Incubadora = require('../models/incubadora')
var Medicao = require('../models/medicao');
var TYPES = require('tedious').TYPES; 



module.exports = class incubadoraService {

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


    };


    //Obtem uma lista de Incubadoras

    getIncubadoras() {

        return new Promise((resolve, reject) => {

            const connection = new Connection(this.config);
            let listaIncubadoras = [];


            connection.on('connect', function (err) {
                // If no error, then good to go...

                const request = new Request("select * from incubadora", function (err, rowCount) {
                    if (err) {
                        reject(err)
                    } else {
                        console.log(rowCount + ' rows')
                    }

                    connection.close()
                })

                request.on('row', function (columns) {

                    var incubadora = new Incubadora();
                    
                    incubadora.idIncubadora = columns[0].value;
                    incubadora.codigo = columns[1].value;
                    incubadora.status = columns[2].value;

                    listaIncubadoras.push(incubadora);

                    resolve(listaIncubadoras);


                });

                // In SQL Server 2000 you may need: connection.execSqlBatch(request);
                connection.execSql(request)

            }
            );

     
        });
    }

    // Adiciona uma incubadora
    cadIncubadora(incubadora){
        return new Promise((resolve, reject)=>{

            const connection = new Connection(this.config);

            connection.on('connect', function (err) {
                
                let codigo = incubadora.codigo;
                let status = incubadora.status;
                console.log(codigo);
                
                let request = new Request("INSERT into incubadora  values ( @codigo, @status);", function (err, linhas) {
                    if (err) {
                        connection.close()
                        reject(err);
                    } else {
                        console.log(`Registro salvo com sucesso. Linhas afetadas: ${linhas}`);
                        connection.close()
                        resolve(true);
                    }
                    connection.close()
                });

                request.addParameter('codigo', TYPES.Decimal, codigo);
                request.addParameter('status', TYPES.Bit, status);

                connection.execSql(request);



        });

        });
    }

    getIncubadoraPorId(idIncubadora){
        return new Promise((resolve, reject) => {

            const connection = new Connection(this.config);

            connection.on('connect', function (err) {
                // If no error, then good to go...
                var id = idIncubadora;
                const request = new Request("select * from incubadora where idIncubadora = @id; ", function (err, rowCount) {
                    if (err) {
                        connection.close()
                        reject(err)
                    }
                    if(rowCount == 0){
                       connection.close()
                       resolve(null);
                    } else {
                        console.log(rowCount + ' rows')
                    }

                    connection.close()
                })
                request.addParameter('id', TYPES.Decimal, id);
                request.on('row', function (columns) {

                    var incubadora = new Incubadora();

                    incubadora.idIncubadora = columns[0].value;
                    incubadora.codigo = columns[1].value;
                    incubadora.status = columns[2].value;

                    resolve(incubadora);


                });

                // In SQL Server 2000 you may need: connection.execSqlBatch(request);
                connection.execSql(request)

            }
            );


        });
    }



    getMedicao(idIncubadora) {
        return new Promise((resolve, reject) => {

            const connection = new Connection(this.config);

            connection.on('connect', function (err) {
                // If no error, then good to go...
                var id = idIncubadora;
                const request = new Request("select Max(idMedicao), temperatura, umidade from medicao where fkIncubadora = @id group by idMedicao, temperatura, umidade; ", function (err, rowCount) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(rowCount + ' rows')
                    }

                    connection.close()
                })
                request.addParameter('id', TYPES.Decimal, id);
                request.on('row', function (columns) {

                    var medicao = new Medicao();

                    medicao.idMedicao = columns[0].value;
                    medicao.temperatura = columns[1].value;
                    medicao.umidade = columns[2].value;

                    resolve(medicao);


                });

                // In SQL Server 2000 you may need: connection.execSqlBatch(request);
                connection.execSql(request)

            }
            );


        });
    }

}

