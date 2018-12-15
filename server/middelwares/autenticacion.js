const jwt = require('jsonwebtoken');

//Verificar token
//Nota: el token está dentro de un header personalizado

let verificaToken = (req, res, next) => {
    let token = req.get('token'); //Authorization

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        //Si no es válido o ya expiró
        if (err){
            return res.status(401).json({
                ok: false,
                err:{
                    name: 'JWT Error',
                    message: 'Token Inválido'
                }
            });
        }

        //creo una nueva propiedad en el request, AQUÍ HAGO DISPONIBLE PARA TODOS
        req.usuario = decoded.usuario;
        next();
    });
}

let isAdmin = (req, res, next) =>{
    let usuario = req.usuario;

    if(usuario.role != 'ADMIN_ROLE'){
        return res.status(401).json({
            ok:false,
            err:{
                message: 'No tiene permisos suficientes'
            }
        });
    }
    next();
};

let protejerImagenToken = (req, res, next) => {
    token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        //Si no es válido o ya expiró
        if (err){
            return res.status(401).json({
                ok: false,
                err:{
                    name: 'JWT Error',
                    message: 'Token Inválido'
                }
            });
        }

        //creo una nueva propiedad en el request, AQUÍ HAGO DISPONIBLE PARA TODOS
        req.usuario = decoded.usuario;
        next();
    });
}

module.exports = {
    verificaToken,
    isAdmin,
    protejerImagenToken
}