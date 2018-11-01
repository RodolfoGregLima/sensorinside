var UsuarioService = require('../service/usuarioService');
const LocalStrategy = require('passport-local').Strategy;
var express = require('express');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('2012');

const usuarioService = new UsuarioService();

module.exports = function (passport) {
    
    
    //configuraremos o passport aqui

    passport.serializeUser(function (user, done) {

        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        let id = user.idUsuario;
        usuarioService.getUsuarioPorId(id).then((user)=>{
            done(null, user);

        }).catch((err) =>{
            console.log(err);
        });
        
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        (username, password, done) => {
            usuarioService.getUsuarioPorNome(username).then((usuario) => {

                //Verifica se retornou usuário
               if(usuario == null) {

                     return done(null, false)
                }
                 
                 // Descriptografa a senha 
                let senhaDescript = cryptr.decrypt(usuario.senha);


                // comparando as senhas
                    if(senhaDescript != password) { 
                                               
                         return done(null, false) 
                         
                    }
                    
                // caso não entrar nos ifs anteriores retorna o usuário
                    return done(null, usuario)
                  
          
            }) // Caso der erro na procura de usuário
            .catch((err)=>{

                console.log(err);
            })
            }
    ));

    
}