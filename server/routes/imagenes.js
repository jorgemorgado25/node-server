const express = require('express');

const app = express();

const fs = require('fs');
const path = require('path');

let {protejerImagenToken} = require('../middelwares/autenticacion');

app.get('/imagen/:tipo/:imagen', protejerImagenToken, (req, res) => {
    
    let tipo = req.params.tipo;
    let imagen = req.params.imagen;


    //construir un path donde se encuentra la imagen
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ imagen }`);

    let noImagen = path.resolve(__dirname, `../assets/no-image.jpg`);

    //enviar físicamente
    //la funcion sendFile lee el content type del archivo y eso es lo que regresa
    //la función necesita el path absoluto
    
    console.log(pathImagen);
    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    }else{
        res.sendFile(noImagen);
    }

});







module.exports = app;