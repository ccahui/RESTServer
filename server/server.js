require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json());

// =======================================
//  ROUTES Globales
// =======================================
app.use(require('./routes/index'));


// =======================================
//  Conexion con la DB
// =======================================
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.URI_DB,(err)=>{
    if(err){
        console.log('ERROR');
        throw err;
    }
    console.log("Base de datos \x1b[32m%s\x1b[0m", 'ONLINE')
});


app.listen(process.env.PORT, () => {
    console.log("Escuchando \x1b[32m%s\x1b[0m", 'puerto 3000');
})