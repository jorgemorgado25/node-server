const express = require('express')

const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

//importo el middleware de verificar token
const { verificaToken, isAdmin } = require('../middelwares/autenticacion');

const app = express();


                    //uso aquí
app.get('/usuario', verificaToken, (req, res) => {
    

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    limite = Number(limite);
    desde = Number(desde);


                                  //excluir campos
    Usuario.find({estado: true}, 'nombre email img')

      .skip(desde)
      .limit(limite)
      .exec( (err, usuarios) => {

          if (err){
            return res.status(400).json({
              ok: false,
              err
            })
          }

          Usuario.countDocuments({estado: true}, (err, conteo) =>{

            //Inserto la respuesta dentro

              res.json({
                ok: true,
                usuarios,
                cantidad: conteo
              });
          
          })        
      });

  })
  
  app.post('/usuario',(req, res) =>{
    
    let body = req.body;

    let usuario = new Usuario({
      nombre: body.nombre,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
      role: body.role,
      img: body.img
    });

    usuario.save(  (err, usuarioDB) =>  {
        if (err){
          return res.status(400).json({
            ok: false,
            err
          })
        }

        res.json({
          ok: true,
          usuario: usuarioDB
        });

    });
  
    /*if (body.nombre === undefined){
        res.status(400).json({
          ok: false,
          mensaje: 'El nombre es necesario'
        });
    }else{
      res.json({ 
        persona: body
       });
    } */   
  })
  
  app.put('/usuario/:id', [verificaToken, isAdmin], (req, res) => {
    let id = req.params.id;
    //let body = req.body;

    //delete body.password; eliminar propiedades del body
    //delete body.google;

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //paso new true para que devuelva la nueva información del usuario actualizado
    //run validatos para ejecutar las valaciones del modelo (esquema)
    Usuario.findByIdAndUpdate( id, body, {new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
      if (err){
        return res.status(400).json({
          ok: false,
          err
        })
      }

      res.json({
        ok:true,
        usuario: usuarioDB
      })

    });
  })
  
  app.delete('/usuario/:id', [verificaToken, isAdmin], (req, res) => {
    
    let id = req.params.id;

    let campo = {estado: false};

    Usuario.findByIdAndUpdate( id, campo, {new: true}, (err, usuarioDB) => {
      if (err){
        return res.status(400).json({
          ok: false,
          err
        })
      }

      res.json({
        ok:true,
        usuario: usuarioDB
      })

    });
    
    /*Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
      if (err){
        return res.status(400).json({
          ok: false,
          err
        })
      }

      if(!usuarioEliminado){
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Usuario no encontrado'
          }
        })
      }
      res.json({
        ok:true,
        usuario: usuarioEliminado
      })

    });*/

  })

module.exports = app;