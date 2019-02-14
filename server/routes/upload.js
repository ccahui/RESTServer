const express = require('express');
// =======================================
//  express-fileupload 1.1.1 alpha se presento  errores,
//  debido a esto se uso una version anterior la 1.0.0 para la carga de archivos
// =======================================
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');
const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
const tipos = tiposValidos = ['usuario', 'producto'];
const fs = require('fs');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res) => {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Ningun archivo seleccionado'
            }
        });
    }

    let imagen = req.files.imagen;
    let extension = extensionValida(imagen.name);
    if (!extension) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: {
                messaje: ' Las extensiones validas son ' + extensionesValidas.join(', ')
            }
        });
    }

    let tipo = req.params.tipo;
    if (!tipoValido(tipo)) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de Collection no valido',
            err: {
                message: 'Tipos de Collection validos son ' + tiposValidos.join(', ')
            }
        });
    }


    let id = req.params.id;
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    let pathNuevo = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);


    if (tipo == 'usuario') {
        imagenUsuario(id, nombreArchivo, imagen, pathNuevo, res);
    } else if (tipo === 'producto')
        imagenProducto(id, nombreArchivo, imagen, pathNuevo, res);

});

// =======================================
//  Verifica si tiene extencion png, jpg, gif, jpeg
//  Retorna NULL si no pertene al array
// =======================================
function extensionValida(nombre) {

    var nombreSplit = nombre.split('.'); // Nombre del Archivo
    var extension = nombreSplit[nombreSplit.length - 1]; // Extension del Archivo

    if (extensionesValidas.indexOf(extension) < 0) {
        return null;
    }
    return extension;
}
// =======================================
//  Las imagenes de acuerdo a un TIPO se agrupan en una carpeta
// =======================================
function tipoValido(tipo) {

    if (tiposValidos.indexOf(tipo) < 0) {
        return false;
    }
    return true;
}


// =======================================
//  Subir Imagen Usuario
// =======================================
function imagenUsuario(id, nombreArchivo, archivo, pathNuevo, res) {

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar Usuario [id]",
                err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                err: {
                    message: 'No existe un usuario con ese ID'
                }

            });
        }

        archivo.mv(pathNuevo, err => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al mover Archivo',
                    err
                });
            }
            let pathViejo = path.resolve(__dirname, `../../uploads/usuario/${usuario.img}`);
            eliminarArchivo(pathViejo);

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar imagen de Usuario',
                        err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Usuario Actualizada',
                    usuario: usuarioActualizado
                });
            });
        });

    });
}


// =======================================
//  Subir Imagen Producto
// =======================================
function imagenProducto(id, nombreArchivo, archivo, pathNuevo, res) {

    Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar Producto [id]",
                err
            });
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El producto con el id ' + id + ' no existe',
                err: {
                    message: 'No existe un producto con ese ID'
                }

            });
        }

        archivo.mv(pathNuevo, err => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al mover Archivo',
                    err
                });
            }
            let pathViejo = path.resolve(__dirname, `../../uploads/producto/${producto.img}`);
            eliminarArchivo(pathViejo);

            producto.img = nombreArchivo;
            producto.save((err, productoActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar imagen de Producto',
                        err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Producto Actualizada',
                    producto: productoActualizado
                });
            });
        });

    });
}
// =======================================
//  Elimina archivo si existe
// =======================================

function eliminarArchivo(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}
module.exports = app;