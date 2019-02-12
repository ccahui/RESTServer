// ==================================================
//  PUERTO , HEROKU establece esa variable en la nube
// ==================================================
process.env.PORT = process.env.PORT || 3000;

// ===================================================
//  ENTORNO , HEROKU establece esa variable en la nube
// ===================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'local';

// =======================================
//  TOKEN Seed y Vencimiento
// =======================================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.SEED = process.env.SEED || 'este-es-el-seed-local';

// =======================================
//  Google SignIn
// =======================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '274424266167-bfdohtg2fvbu3ssu4ipe6uirq8o68o9a.apps.googleusercontent.com';
// =======================================
//  BASE DE DATOS
// =======================================

let URI;
if (process.env.NODE_ENV === 'local') {
    URI = 'mongodb://localhost:27017/cafe';
} else {
    //Especificamos /cafe ---> Nombre de la base de datos en la nube
    // =======================================
    //  EN MONGO BD ATLAS LISTA DE DIRECCION IP DE CONEXION PERMITIDAS 0.0.0.0/0
    // =======================================
    URI = process.env.URI_MONGO;
}



process.env.URI_DB = URI;