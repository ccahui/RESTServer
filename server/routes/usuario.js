const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const {
    verificaToken,
    verificaAdmin
} = require('../middlewares/autentificacion')
const _ = require('underscore');

// =======================================
//  Obtiene todos, menos los eliminados Logicamente
// =======================================
app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde); // Si envia STRING desde = NaN y por suerte omite
    limite = Number(limite);

    Usuario.find({
            estado: true
        }, 'nombre email estado role google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({
                estado: true
            }, (err, total) => {
                res.json({
                    ok: true,
                    usuarios,
                    total
                });
            });

        });


});


app.post('/usuario', [verificaToken, verificaAdmin], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            mensaje: 'post Usuario',
            usuario: usuarioDB
        });
    });




});


app.put('/usuario/:id', [verificaToken, verificaAdmin], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Usuario.findById(id, (err, usuarioBuscado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!usuarioBuscado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No se pudo actualizar el usuario con id ${id}`
                }

            });
        }

        usuarioBuscado.nombre = body.nombre;
        usuarioBuscado.email = body.email;
        usuarioBuscado.img = body.img;
        usuarioBuscado.role = body.role;
        usuarioBuscado.estado = body.estado;

        usuarioBuscado.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });
    });
});

// =======================================
//  Eliminacion LOGICA controlado por ESTADO
// =======================================
app.delete('/usuario/:id', [verificaToken, verificaAdmin], (req, res) => {

    let id = req.params.id;

    Usuario.findById(id, (err, usuarioBuscado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!usuarioBuscado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No se pudo eliminar el usuario con id ${id}`
                }

            });
        }

        usuarioBuscado.estado = false;

        usuarioBuscado.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });
    });
});

module.exports = app;