require('./config/config')

const express = require('express')
const mongoose = require('mongoose');
const app = express()


/*----------------------------------*/
//existe un paquete que permite procesar la info y la serializa en un objeto json
// para que sea procesada facilmente en las peticiones post npm body-parser
// npm body-parser --save

//los app.use son middleware

const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 

// parse application/json
app.use(bodyParser.json())

//importu y uso las rutas del usuario
app.use(require('./routes/usuario'));
 


mongoose.connect(process.env.URLDB, { useNewUrlParser: true } , (err, res) => {
    if (err) throw err;
    console.log('base de datos ONLINE!!!');
});
 
app.listen(process.env.PORT, () => {
  console.log('Escuchando puerto: ', process.env.PORT);
});