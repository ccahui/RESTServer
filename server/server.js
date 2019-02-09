const express = require('express');
const bodyParser = require('body-parser');
const app = express();

require('./config/config');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())


app.get('/usuario', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'get Usuario',
    })
});


app.post('/usuario', (req, res) => {

    let body = req.body;

    if (!body.nombre) {
        return res.status(400).json({
            ok:false,
            err:{
                message:'El nombre es necesario',
            }
        });
    }

    res.json({
        ok: true,
        mensaje: 'post Usuario',
        persona: body
    });
});


app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        ok: true,
        mensaje: 'put Usuario',
        id
    });
})


app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        ok: true,
        mensaje: 'delete Usuario',
        id
    })
})


app.listen(process.env.PORT, () => {
    console.log("Escuchando \x1b[32m%s\x1b[0m", 'puerto 3000');
})