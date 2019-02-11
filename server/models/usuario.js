const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

// =======================================
//  ROLES VALIDOS
// =======================================

const ROLES_VALIDOS = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesario']
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: true,
        enum: ROLES_VALIDOS,
        default: 'USER_ROLE',
        
    },
    google: {
        type: Boolean,
        default: false
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    collection: 'usuarios'
});


// =======================================
//  Eliminar un campo que se retorna a el frontEnd
// =======================================

usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});



module.exports = mongoose.model('Usuario', usuarioSchema);