const express = require('express')

let { verificaToken, isAdmin} = require('../middelwares/autenticacion');

let app = express();

const Categoria = require('../models/categoria');

const _ = require('underscore');


//============================
//mostrar todas las categorias
//============================

app.get('/categoria', verificaToken, (req, res) => {
    
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec( (err, categorias) => {
        
        if (err){
            return res.status(400).json({
                ok: false,
                err
            })
        }        
        
        Categoria.countDocuments( (err, cantidad) => {
            res.json({
                ok: true,
                categorias,
                cantidad
            })
        });
    })
    
});

//============================
//mostrar una categoria por ID
//============================

app.get('/categoria/:id', (req, res) => {
    

    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        
        if (err){
            return res.status(400).json({
                ok: false,
                err
            })
        }        
        
        if(!categoria){
            res.json({
                ok: true,
                err: {
                    message: 'No existe la categoría'
                }
            });
        }
        
        res.json({
            ok: true,
            categoria,
        });
        
    })
});


app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    //return res.json({categoria});


    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });
});
 
//============================
//actualizar una categoria
//============================

app.put('/categoria/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre']);
    
    Categoria.findByIdAndUpdate(id, body, {new: true}, (err, categoriaDB) =>{
        
        if (err){
            return res.status(400).json({
              ok: false,
              err
            });
        }
        
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

//============================
//eliminar categoria
//============================

app.delete('/categoria/:id', [verificaToken, isAdmin], (req, res) => {
    let id = req.params.id;
    
    //return res.json({ok: 'eliminada'});
    
    Categoria.findByIdAndRemove(id, (err, categoriaEliminada) => {
        
        if (err){
          return res.status(400).json({
            ok: false,
            err
          })
        }
  
        if(!categoriaEliminada){
          return res.status(400).json({
            ok: false,
            err: {
              message: 'Categoria no encontrada'
            }
          })
        }
        res.json({
          ok:true,
          categoria: categoriaEliminada
        })
  
      });
});



module.exports = app;