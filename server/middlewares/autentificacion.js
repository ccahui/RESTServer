var jwt = require('jsonwebtoken'); 

// ==============================
// TOKEN, el token es enviado en HEADERS de la peticion
// ==============================
let verificaToken = function (req, res, next) {
    // header
    var token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({ // No autorizado
                ok: false,
                err:{
                    message:'Token no valido'
                }
            });
        }
        // Propieda usuario para manipular
        req.usuario = decoded.usuario; 
        next();

    });
}
let verificaAdmin = function (req, res, next) {
    // Usuario Login
    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No es administrador, no tiene los permisos'
            }
        });
    }
}
module.exports = {
    verificaToken,
    verificaAdmin
}