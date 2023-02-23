const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const contextoUsuario = require('../models/usuario.model');

const validarJWT = async (req = request, res = response, next) => {
    // leer JWT
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {

        const {uid} = await jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        next();
        
    } catch (error) {
        return res.status(401).json({
            ok: true,
            msg: 'Token no válido'
        });
    }



}

const validarADMIN_ROLE = async (req = request, res =response, next) =>{
    const uid = req.uid;

    try{
        const usuarioDB = await contextoUsuario.findById(uid);
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }
        if(usuarioDB.role !== 'ADMIN_ROLE'){
            return res.status(403).json({
                ok: false,
                msg: 'No tiene suficientes permisos'
            });
        }
        next();
    }catch(error){
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const validarADMIN_ROLE_o_MismoUsuario = async (req = request, res =response, next) =>{
    const uid = req.uid;
    const id = req.params.id;
    try{
        const usuarioDB = await contextoUsuario.findById(uid);
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }
        if(usuarioDB.role === 'ADMIN_ROLE' || uid === id){
            next();
        }else{
            return res.status(403).json({
                ok: false,
                msg: 'No tiene suficientes permisos'
            });
        }

    }catch(error){
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario
}