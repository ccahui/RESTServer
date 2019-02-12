const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({
        email: body.email
    }, (err, usuario) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err,
            });
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '[Usuario] ó password incorrecto'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario ó [password] incorrecto'
                }
            });
        }

        let token = jwt.sign({
            usuario
        }, process.env.SEED, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        });
        res.json({
            ok: true,
            usuario,
            token
        });
    });
});
// =======================================
//  Google configuraciones
// =======================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
}

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            });
        });
    Usuario.findOne({
        email: googleUser.email
    }, (err, usuario) => {
        if (err) {
            return status(500).json({
                ok: false,
                err
            });
        }
        // Email ya esta registrado
        if (usuario) {
            if (usuario.google === false) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Debe utilizar la [autenticación normal]'
                });
            } else {
                // Crear Token
                var token = jwt.sign({ // Inicia sesion y los datos son almacenados 
                    usuario: usuario
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN,
                });
                res.status(200).json({
                    ok: true,
                    usuario,
                    token: token,
                });
            }
        } else { // Crea Usuario Google y Token
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)'; // En el esquema el password es REQUIRED

            usuario.save((err, usuarioGoogle) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                }
                // Crear Token
                var token = jwt.sign({  
                    usuario: usuario
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN,
                }); 

                res.status(200).json({
                    ok: true,
                    usuario,
                    mensaje: 'Usuario Creado - Google',
                    token: token,
                });
            });
        }
    });

});

module.exports = app;