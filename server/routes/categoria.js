const express = require('express');
const app = express();
const Categoria = require('../models/categoria');
const {
    verificaToken,
} = require('../middlewares/autentificacion')

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion') // ordenado por ...
        .populate('usuario','nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            });
        });
});

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });




});
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findById(id, (err, categoriaBuscado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!categoriaBuscado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No se pudo actualizar la cotegoria con es [id] ${id}`
                }
            });
        }

        categoriaBuscado.descripcion = body.descripcion;

        categoriaBuscado.save((err, categoriaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.status(200).json({
                ok: true,
                categoria: categoriaGuardado
            });

        });
    });
});
app.delete('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findOneAndDelete({
        _id: id
    }, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No se eliminar una categoria con es [id] ${ id }`,
                }
            });
        }
        res.json({
            ok: true,
            categoria,
        });
    });


});




module.exports = app;