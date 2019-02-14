const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// =======================================
//  Tipo debe ser PRODUCTO - USUARIO
// =======================================
app.get('/imagen/:tipo/:img', (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        pathNoImg = path.resolve(__dirname,'../assets/no-images.png');
        res.sendFile(pathNoImg);
    }
});



module.exports = app;