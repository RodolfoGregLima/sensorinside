const LocalStrategy = require('passport-local').Strategy;
var express = require('express');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('2012');


//configuraremos o passport aqui
//---------------------------------------------------------------------------
module.exports = function (passport) {


    passport.serializeUser(function (user_id, done) {

        done(null, user_id);
    });
//------------------------------------------------------------------------------------
    passport.deserializeUser(function (user_id, done) {
    
        done(null, user_id);
          
    });
//---------------------------------------------------------------------------------------
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        (username, password, done) => {

            global.conn.request().query`select top (1) idUsuario, senha  from usuario where email = ${username} order by idUsuario desc`
            .then(usuario => {

                //Verifica se retornou alguma usuario
                if (usuario.recordset.length == 0) 
                    return done(null, false)

                let user = usuario.recordset[0]; 
                

               // Descriptografa a senha 
                let senhaDescript = cryptr.decrypt(user.senha);
        
                // comparando as senhas
                if (senhaDescript != password) 
                    return done(null, false)               

                // caso não entrar nos ifs anteriores retorna o usuário
                return done(null, user.idUsuario)

            }).catch(err => {
                // Se der algum erro imprime no console
                console.log(err);
            })

            
        }
    ));


}