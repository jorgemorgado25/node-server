const express = require('express');

let { verificaToken } = require('../middelwares/autenticacion');

let app = express();
const _ = require('underscore');
const Producto = require('../models/producto');


// ===========================
// Obtener todos los productos
// ===========================
app.get('/productos', (req, res) => {
    //trae todos los productos
    //populate: usuario y categoria
    //paginado

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    limite = Number(limite);
    desde = Number(desde);

    Producto.find({disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec( (err, productos) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments( (err, cantidad) => {
                res.json({
                    ok: true,
                    productos,
                    cantidad
                })
            })
        })
});

// ===========================
// Obtener un producto por ID
// ===========================
app.get('/productos/:id', (req, res) =>{
    //populate: usuario y categoria
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec( (err, producto) => {
            if (err){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }
            res.json({
                ok: true,
                producto
            })
        })
});


// ===========================
// Crear un nuevo producto
// ===========================
app.post('/producto', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoría del listado

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save( (err, productoDB) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// ===========================
// buscar un producto
// ===========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    
    let termino = req.params.termino;
    
    //creo una expresion regular, pasar "i" para que no sea sensible a may-min
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec( (err, productos) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        })
});

// ===========================
// Actualizar un producto
// ===========================
app.put('/productos/:id', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoría del listado

    /*if(!req.params.id){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El id es requerido'
            }
        })
    }*/

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'descripcion', 'precioUni', 'categoria']);

    Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, productoDB) => {
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    });
});

// ===========================
// Borrar un producto
// ===========================
app.delete('/productos/:id', verificaToken, (req, res) => {
    //disponible pasar a falso

    let id = req.params.id;

    let campo = {disponible: false};

    Producto.findByIdAndUpdate( id, campo, {new: true}, (err, productoDB) => {
      if (err){
        return res.status(400).json({
          ok: false,
          err
        })
      }

      res.json({
        ok:true,
        producto: productoDB
      })

    });
});


module.exports = app;

