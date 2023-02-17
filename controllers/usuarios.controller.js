const { response, json } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');
const {generarJWT} = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
    // Obtener parametros 
    const desde = Number(req.query.desde) || 0;

    // cuando hay mas de 1 await 
   const [usuarios, total] =  await Promise.all([
        Usuario
        .find({status: {$in:[0,1]}}, 'nombre email role google img status')
        .skip(desde)
        .limit(5),
        Usuario.countDocuments({status: {$in:[0,1]}})
    ]);


    res.json({
        ok: true,
        total: total,
        usuarios,
    });
    
}

const crearUsuario = async (req, res = response) => {
    const { email,password, nombre } = req.body;



    try {
        const userExist = await Usuario.findOne({email: email, status: {$in:[0,1]}});
        
        if(userExist){
            return res.status(404).json({
                ok: false,
                msg: 'Ya existe un usuario con el mismo email!'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Generar Token
        const token = await generarJWT(usuario.id,nombre);

        // Guardar Usuario
        await usuario.save();


        res.json({
            ok: true,
            usuario: usuario,
            token: token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }



}

const actualizarUsuario = async(req, res = response) => {
    // TODO: Validar token y comprobar si el usuario es correcto

    const uid = req.params.id;

    try{
        const usuarioDB = await Usuario.findById(uid);

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el id'
            });
        }
        
        // Actualizaciones
        const {password, google,email, ...campos} = req.body;


        if(usuarioDB.email !== email){

            const existEmail =  await Usuario.findOne({email});

            if(existEmail){
                return res.status(404).json({
                    ok: false,
                    msg: 'Ya existe un usuario con el mismo correo'
                });
            }
        }
        if( !usuarioDB.google )
        {
            campos.email = email;
        }else if( usuarioDB.email !== email){
            return res.status(404).json({
                ok: false,
                msg: 'Usuarios de google no pueden cambiar su correo'
            });
        }
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true})

        
        return res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}

const eliminarUsuario = async(req, res = response)=>{
    try{
        const uid = req.params.id;
        const existUsuario = await Usuario.findOne({_id:uid,  status: {$in:[0,1]} });
        if( !existUsuario ){
            return res.status(404).json({
                ok: true,
                msg: 'No existe algun usuario con el id'
            });
        }

        const resp = await Usuario.findByIdAndUpdate(req.params.id,{status: 5});
        console.log(resp);
        res.json({
            ok: true,
            msg: 'Eliminado correctamente, id: '+uid
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
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
}