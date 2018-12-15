const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

//importo el paquete nativo de node: file system
const fs = require('fs');

//importo el paquete nativo de node path para manejar el directorio
const path = require('path');

Usuario = require('../models/usuario');
Producto = require('../models/producto');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

  let tipo = req.params.tipo;
  let id = req.params.id;

  //los archivos se obtienen en req.files gracias al express-fileupload

  if (!req.files) {
    return res.status(400).json({
        ok: false,
        err: {
          message: 'No se ha enviado ningún archivo'
        }
    });
  }

  //valida tipos
  let tiposValidos = ['productos', 'usuarios'];

  //indexOf: barre el arreglo
  if(tiposValidos.indexOf(tipo) < 0){
    return res.status(400).json({
      ok: false,
      err: {
          message: 'Los tipos válidos son: ' + tiposValidos.join(', '),
          tipo
        }
    });
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let archivo = req.files.img;

  //separo el nombre del archivo por puntos
  let nombreCortado = archivo.name.split('.');

  //obtengo la última posición
  let extension = nombreCortado[nombreCortado.length - 1];

  //extensiones permitidas
  let extensionesPermitidas = ['png', 'jpg', 'jpeg', 'gif'];

  if(extensionesPermitidas.indexOf(extension) < 0){
    return res.status(400).json({
      ok: false,
      err: {
          message: 'Las extensiones permitidas son: ' + extensionesPermitidas.join(', '),
          extension
        }
    });
  }

  //cambiar nombre al archivo:
  let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, function(err) {
    
    if (err)
      return res.status(500).json({
          ok: false,
          err
      });

      /** aquí imagen se cargó */

      switch(tipo){
        case 'usuarios':
          imagenUsuario(id, res, nombreArchivo)
        break;
        case 'productos':
          imagenProducto(id, res, nombreArchivo)
        break;
      }

  });

});

//verifica si el usuario existe
/*el objeto res no existe dentro del contexto de la función, se debe pasar el objeto, y javascript
  los pasa por referencia, cosa que conviene en este caso
*/

function imagenUsuario(id, res, nombreArchivo){
  
  Usuario.findById(id, (err, usuarioDB) => {
    
    if(err){

      borrarArchivo(nombreArchivo, 'usuarios');

      return res.status(500).json({
        ok: false,
        err
      })
    }

    if(!usuarioDB){
      borrarArchivo(nombreArchivo, 'usuarios');
        return res.status(400).json({
          ok: false,
          err:{
            message: 'Usuario no existe'
          }
        })
    }

    borrarArchivo(usuarioDB.img, 'usuarios');

    usuarioDB.img = nombreArchivo;

    usuarioDB.save( (err, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      });
    });

  });
}

function imagenProducto(id, res, nombreArchivo){
  
  Producto.findById(id, (err, productoDB) => {
    
    if(err){

      borrarArchivo(nombreArchivo, 'productos');

      return res.status(500).json({
        ok: false,
        err
      })
    }

    if(!productoDB){
      borrarArchivo(nombreArchivo, 'productos');
        return res.status(400).json({
          ok: false,
          err:{
            message: 'Producto no existe'
          }
        })
    }

    borrarArchivo(productoDB.img, 'productos');

    productoDB.img = nombreArchivo;

    productoDB.save( (err, productoGuardado) => {
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo
      });
    });

  });

}

function borrarArchivo(nombreImagen, ruta){
  //construyo la ruta, usando path.resolve()
  let pathImagen = path.resolve(__dirname, `../../uploads/${ ruta }/${ nombreImagen }`);
    
    //debo confirmar que la ruta existe
    //uso una función síncrona

    if( fs.existsSync(pathImagen) ){
      fs.unlinkSync(pathImagen)
    }
}


module.exports = app;