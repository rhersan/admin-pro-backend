const {response} = require('express');
const contextoMedico = require('../models/medico.model');
const contexHospital = require('../models/hospital.model');
const { borrarImagen } = require('../helpers/actualizar-imagen');


const listadoMedicos = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    try{
        const [medicos,total] = await Promise.all([
            contextoMedico.find({status: {$in:[0,1]}})
                                .populate('usuario', 'nombre')
                                .populate('hospital', 'nombre img')                               
                                .skip(desde)
                                .limit(5),
            contextoMedico.countDocuments({status: {$in:[0,1]}})     
        ]);

        res.json({
            ok: true,
            total,
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

const medicoPorId = async( req, res = response) =>{
    const id = req.params.id;
    console.log(id);
    try{
        const medico = await contextoMedico.findById(id)
                                .populate('usuario', 'nombre')
                                .populate('hospital', 'nombre img');

        res.json({
            ok: true,
            medico
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
    const { nombre, hospital } =  req.body;
    try{

        // Validar si existe duplicado.
        const existHospital = await contexHospital.findOne({ _id: hospital , status: {$in: [0,1]}});

        if(!existHospital){
            return res.status(404).json({
                ok: true,
                msg: 'El hospital id no existe en la base de datos.'
            });
        }
        
        const existMedico = await contextoMedico.findOne({nombre, hospital: hospital , status: {$in: [0,1]}});
        if(existMedico){
            return res.status(404).json({
                ok: true,
                msg: 'Ya existe un registro con el mismo medico y hospital asignado'
            });
        }

        const medico = new contextoMedico({
            usuario: uid,
            hospital: hospital,
            ...req.body
        });

        const medicoDB = await medico.save();

        return res.json({
            ok: true,
            msg: `Médico: ${medicoDB.nombre} ha sido creado!`,
            medico: medicoDB
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
        const hospital = req.body.hospital;

        const medicoDB = await contextoMedico.findOne({status: {$in:[0,1]}, _id: idMedico});

        if(!medicoDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un medico con el id'
            });
        }

        const hospitalDB = await contexHospital.findOne({status: {$in:[0,1]}  ,_id: hospital});

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
            msg: `Médico: ${medicoActualizado.nombre} actualizado!`,
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
        // Eliminar foto
        if(medicoDB.img && !medicoDB.img.includes('https')){
            const path = `./uploads/medicos/${medicoDB.img}`;
            await borrarImagen(path);
        }

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
    medicoPorId,
    crearMedicos,
    actualizarMedicos,
    eliminarMedicos
}