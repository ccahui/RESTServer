// ==================================================
//  PUERTO , HEROKU establece esa variable en la nube
// ==================================================
process.env.PORT = process.env.PORT || 3000;

// ===================================================
//  ENTORNO , HEROKU establece esa variable en la nube
// ===================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'local';

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