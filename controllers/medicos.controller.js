const {response} = require('express');
const contextoMedico = require('../models/medico.model');
const contexHospital = require('../models/hospital.model');
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
        const uid = req.uid;
        const idMedico = req.params.id;
        const idHospital = req.body.idHospital;

        const medicoDB = await contextoMedico.findOne({status: {$in:[0,1]}, _id: idMedico});

        if(!medicoDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un medico con el id'
            });
        }

        const hospitalDB = await contexHospital.findOne({status: {$in:[0,1]}  ,_id: idHospital});

        if(!hospitalDB){
            return res.status(404).json({
                ok: false,
                msg: 'El hospital id no existe'
            });
        }
        
        const cambiosMedico = {
            ... req.body,
            usuario: uid
            }
        const medicoActualizado = await contextoMedico.findByIdAndUpdate({_id:idMedico}, cambiosMedico, {new: true});

        return res.json({
            ok: true,
            msg: 'actualizarMedicos',
            medico: medicoActualizado
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const eliminarMedicos = async(req, res = response) => {
    try{

        const uid = req.uid;
        const idMedico = req.params.id;

        const medicoDB = await contextoMedico.findOne({status: {$in:[0,1]}, _id: idMedico});
        
        if(!medicoDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un medico con el id'
            });
        }
        const cambiosMedico = {
            usuario: uid,
            status: 5
            }
        const medicoActualizado = await contextoMedico.findByIdAndUpdate( {_id: idMedico }, cambiosMedico, {new: true});

        return res.json({
            ok: true,
            msg: 'Registro Eliminado correctamente!',
            medico: medicoActualizado
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