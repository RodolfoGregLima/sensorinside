var Request = require('tedious').Request;
var Connection = require('tedious').Connection;
var Medicao = require('../models/medicao');
var TYPES = require('tedious').TYPES;



module.exports = class usuarioService {

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

    getUsuario() {

        return new Promise((resolve, reject) => {

            const connection = new Connection(this.config);
            let listaUsuarios = [];


            connection.on('connect', function (err) {
                // If no error, then good to go...

                const request = new Request("select idUsuario, nome, email from usuario", function (err, rowCount) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(rowCount + ' rows')
                    }

                    connection.close()
                })

                request.on('row', function (columns) {

                    let usuario = {

                        idUsuario: columns[0].value,
                        nome: columns[1].value,
                        email: columns[2].value

                    }


                    listaUsuarios.push(usuario);

                    resolve(listaIncubadoras);


                });

                // In SQL Server 2000 you may need: connection.execSqlBatch(request);
                connection.execSql(request)

            }
            );


        });
    }

    //Adiciona um usuario
    cadUsuario(usuario) {
        return new Promise((resolve, reject) => {

            const connection = new Connection(this.config);

            connection.on('connect', function (err) {

                let nome = usuario.nome;
                let senha = usuario.senha;
                let email = usuario.email;

                

                let request = new Request("INSERT into usuario values ( @nome, @senha, @email);", function (err, linhas) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(`Registro salvo com sucesso. Linhas afetadas: ${linhas}`);
                        resolve(true);
                    }
                    connection.close()
                });

                request.addParameter('nome', TYPES.VarChar, nome);
                request.addParameter('senha', TYPES.VarChar, senha);
                request.addParameter('email', TYPES.VarChar, email);

                connection.execSql(request);



            });

        });
    }

    getUsuarioPorId(idUsuario) {
        return new Promise((resolve, reject) => {

            const connection = new Connection(this.config);

            connection.on('connect', function (err) {
                // If no error, then good to go...
                var id = idUsuario;
                const request = new Request("select idUsuario, nome, email from usuario where idUsuario = @id; ", function (err, rowCount) {
                    if (err) {
                        reject(err)
                    } else {
                        console.log(rowCount + ' rows')
                    }

                    connection.close()
                })
                request.addParameter('id', TYPES.Decimal, id);
                request.on('row', function (columns) {

                    let usuario = {

                        idUsuario: columns[0].value,
                        nome: columns[1].value,
                        email: columns[2].value

                    }

                    resolve(usuario);


                });

                // In SQL Server 2000 you may need: connection.execSqlBatch(request);
                connection.execSql(request)

            }
            );


        });
    }

    getUsuarioPorNome(nomeUsuario) {
        return new Promise((resolve, reject) => {

            const connection = new Connection(this.config);
            let linhas;

            connection.on('connect', function (err) {
                // If no error, then good to go...
                var nome = nomeUsuario;
                const request = new Request("select * from usuario where nome = @nome; ", function (err, rowCount) {
                    if (err) {
                        console.log(err)
                    } else {
                        linhas = rowCount;
                        console.log(rowCount + ' rows')
                    }

                    connection.close()
                })
                request.addParameter('nome', TYPES.VarChar, nomeUsuario);
                request.on('row', function (columns) {

                    let usuario = {

                        idUsuario: columns[0].value,
                        nome: columns[1].value,
                        senha: columns[2].value,
                        email: columns[3].value

                    }

                    resolve(usuario, linhas);


                });

                // In SQL Server 2000 you may need: connection.execSqlBatch(request);
                connection.execSql(request)

            }
            );


        });
    }


}

