const {response} = require('express');
const contextHospital    = require('../models/hospital.model');

const listaHospitales = async(req, res= response) => {
    try{

        const hospitales = await contextHospital.find({ status: {$in:[0,1]} })
                                .populate('usuario','nombre');
        return res.json({
            ok: true,
            hospitales
        });
    }catch(error){
        console.log(error);
        res.status(404).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }
}


const crearHospital = async(req, res = response)=>{
    const uid = req.uid;
    const {nombre} = req.body;
    try{
        
        const existHospital = await contextHospital.findOne({nombre, status: {$in:[0,1]}});                                        
        
        if(existHospital){
            return res.status(404).json({
                ok: false,
                msg: 'Ya existe un registro con el mismo nombre!'
            });
        }

        // Guardar Hospital
        const hospital = new contextHospital({
            usuario: uid,
            ...req.body
        });

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospitalDB
        });

    }catch(error){
        console.log(error);
        res.status(404).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }
}


const actualizarHospital = async(req,res = response)=> {
    res.json({
        ok: true,
        msg: 'actualizarHospital'
    });
}

const eliminarHospital = async(req,res = response)=> {
    res.json({
        ok: true,
        msg: 'eliminarHospital'
    });
}

module.exports = {
    listaHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}