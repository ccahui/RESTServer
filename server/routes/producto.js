const express = require('express');
const app = express();
const {
    verificaToken,
} = require('../middlewares/autentificacion')
const Producto = require('../models/producto');

app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde); // Si envia STRING desde = NaN y por suerte omite
    limite = Number(limite);

    Producto.find({
            estado: true
        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({
                estado: true
            }, (err, total) => {
                res.json({
                    ok: true,
                    productos,
                    total
                });
            });

        });


});

app.get('/producto/:id', (req, res) => {
    let id = req.params.id;
    Producto.findOne({
        _id: id
    })
    .populate('usuario','nombre email')
    .populate('categoria','descripcion')
    .exec((err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No se obtuvo un producto con el [id] ${id}`
                }
            })
        }
        res.json({
            ok: true,
            producto
        })
    })

});
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id,
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoBuscado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!productoBuscado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No se pudo actualizar el producto con [id] ${id}`
                }

            });
        }
        productoBuscado.nombre = body.nombre;
        productoBuscado.precioUni = body.precioUni;
        productoBuscado.descripcion = body.descripcion;
        productoBuscado.categoria = body.categoria,

            productoBuscado.save((err, productoGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.status(200).json({
                    ok: true,
                    producto: productoGuardado
                });

            });
    });
});
app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
    .populate('categoria','descripcion')    
    .exec((err, productoBuscado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!productoBuscado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No se pudo eliminar el producto con [id] ${id}`
                }

            });
        }

        productoBuscado.estado = false;

        productoBuscado.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.status(200).json({
                ok: true,
                producto: productoGuardado
            });

        });
    });
});


module.exports = app;