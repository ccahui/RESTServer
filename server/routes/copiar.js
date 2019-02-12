const express = require('express');
const app = express();
const {
    verificaToken,
} = require('../middlewares/autentificacion')

app.get('/categoria',(req, res)=>{
    res.json({
        ok:true,

    });
});

app.post('/categoria',(req, res)=>{
    res.json({
        ok:true,

    });
});
app.put('/categoria/:id',(req, res)=>{
    res.json({
        ok:true,

    });
});
app.delete('/categoria/:id',(req, res)=>{
    res.json({
        ok:true,

    });
});




module.exports = app;