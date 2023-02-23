const { response } = require('express');
const bcrypt = require('bcryptjs');
const contextUsuario = require('../models/usuario.model');
const {generarJWT} =  require('../helpers/jwt');
const {googleVerify} = require('../helpers/google-verify');
const { getMenuFrondEnd } = require('../helpers/menu-forntend');


const login= async(req, res = response)=>{
    
    const {email, password} = req.body;

    try{

        
        const userDB = await contextUsuario.findOne({email, status: {$in:[0,1]}}, '_id email password nombre role');

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
            token,
            menu: getMenuFrondEnd(userDB.role)
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const googleSingIn = async(req, res = response) =>{

    try{


        const { email, family_name, given_name, picture}  = await googleVerify(req.body.token);
        
        const usuariosDB = await contextUsuario.findOne({status: {$in:[0,1]}, email});

        let usuario;

        if (!usuariosDB) {
            usuario = new contextUsuario({
                nombre: `${given_name} ${family_name}`,
                email,
                img: picture,
                password: '@@',
                google: true
            });
        } else {
            usuario = usuariosDB;
            usuario.google = true;
        }

        // Guardar Usuario
        await usuario.save();

        // Generar Token - JWT
        const token = await generarJWT(usuario._id,usuario.nombre);
        
        res.json({
            ok: true,
            msg: 'sing-in Google',
            usuario,
            token,
            menu: getMenuFrondEnd(usuario.role)
        });
        
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Token de google no es correcto'
        });
    }
}

const renewToken = async(req, res = response) => {

    try{
        
        const uid =  req.uid;
        // Generar el TOKEN - JWT
        const token = await  generarJWT(uid);
        const usuarioDB =await  contextUsuario.findById(uid);


        res.json({
            ok: true,
            usuario: usuarioDB,
            token,
            menu: getMenuFrondEnd(usuarioDB.role)
        });

    }catch(error){
        res.status(500).json({
            ok: false
        });
    }
}


module.exports = {
    login,
    googleSingIn,
    renewToken
}