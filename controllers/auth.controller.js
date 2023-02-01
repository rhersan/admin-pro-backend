const { response, json } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');
const { model } = require('mongoose');
const {generarJWT} =  require('../helpers/jwt');


const login= async(req, res = response)=>{
    
    const {email, password} = req.body;

    try{

        
        const userDB = await Usuario.findOne({email, status: {$in:[0,1]}}, '_id email password nombre');

        if(!userDB){
            return res.status(404).json({
                ok: false,
                msg: 'Email no existe'
            });
        }

        // validar si la contraseña hace match
        const validPassword = bcrypt.compareSync(password, userDB.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña invalida'
            });
        }
        // Generar el TOKEN - JWT
        const token = await  generarJWT(userDB._id,userDB.nombre);

        res.json({
            ok: true,
            token
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

module.exports = {
    login
}