const {response} = require('express');
const contextoMedico = require('../models/medico.model');

const listadoMedicos = async(req, res = response) => {
    try{
        const medicos = await contextoMedico.find({status: {$in:[0,1]}})
                                .populate('usuario', 'nombre')
                                .populate('idHospital', 'nombre img');
        res.json({
            ok: true,
            medicos
        });
    }catch(error){
        console.log(error);
        res.status(404).json({
            ok: true,
            msg: 'Error inesperado'
        });
    }
}

const crearMedicos = async(req, res = response) => {

    const uid = req.uid;
    const { nombre, idHospital } =  req.body;

    try{

        // Validar si existe duplicado.
        const existHospital = await contextoMedico.findOne({idHospital , status: {$in: [0,1]}});
        if(!existHospital){
            return res.status(404).json({
                ok: true,
                msg: 'El hospital id no existe en la base de datos.'
            });
        }

        const existMedico = await contextoMedico.findOne({nombre,idHospital , status: {$in: [0,1]}});
        if(existMedico){
            return res.status(404).json({
                ok: true,
                msg: 'Ya existe un registro con el mismo medico y hospital asignado'
            });
        }

        const medico = new contextoMedico({
            usuario: uid,
            ...req.body
        });

        const medicoDB = await medico.save();

        return res.json({
            ok: true,
            medicoDB
        });
    }catch(error){
        console.log(error);
        res.status(404).json({
            ok: true,
            msg: 'Error inesperado'
        });
    }
}

const actualizarMedicos = async(req, res = response) => {
    try{


        
        return res.json({
            ok: true,
            msg: 'actualizarMedicos'
        });
    }catch(error){
        console.log(error);
        res.status(404).json({
            ok: true,
            msg: 'Error inesperado'
        });
    }
}

const eliminarMedicos = async(req, res = response) => {
    try{
        return res.json({
            ok: true,
            msg: 'eliminarMedicos'
        });
    }catch(error){
        console.log(error);
        res.status(404).json({
            ok: true,
            msg: 'Error inesperado'
        });
    }
}


module.exports = {
    listadoMedicos,
    crearMedicos,
    actualizarMedicos,
    eliminarMedicos
}