const {response} = require('express');
const contextHospital    = require('../models/hospital.model');

const listaHospitales = async(req, res= response) => {
    const desde = Number(req.query.desde) || 0;
    try{

            // cuando hay mas de 1 await 
        const [hospitales, total] =  await Promise.all([
            contextHospital.find({ status: {$in:[0,1]} }, 'usuario nombre img status')
            .skip(desde)
            .limit(5),
            contextHospital.countDocuments({status: {$in:[0,1]}})
        ]);
        return res.json({
            ok: true,
            total,
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

const hospitales = async (req, res = response) =>{
    try {
        const hospitales = await contextHospital.find({ status: { $in: [0, 1] } }, 'nombre img');
        return res.json({
            ok: true,
            hospitales
        });
    } catch (error) {
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
            hospital: hospitalDB
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

    try{
        const uid = req.uid;
        const idHospital = req.params.id;

        const hospitalDB = await contextHospital.findOne({status: {$in:[0,1]}, _id: idHospital});
        if(!hospitalDB){
            return res.status(404).json({
                ok: false,
                msg: 'No hay algun hospital con el id'
            });
        }
        const cambiosHospitales = {
            ... req.body,
            usuario: uid
        }
        
        const HospitalActualizado = await contextHospital.findByIdAndUpdate({_id: idHospital},cambiosHospitales, {new: true});

        res.json({
            ok: true,
            msg: 'actualizarHospital',
            idHospital,
            hospital: HospitalActualizado
        });

    }catch(error){
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Consulte el Administrador'
        });
    }
}

const eliminarHospital = async(req,res = response)=> {

    try{
        const uid = req.uid;
        const idHospita = req.params.id;

        const hospitalDB = await contextHospital.findOne({status: {$in:[0,1]}, _id: idHospita});
        if(!hospitalDB){
            return res.status(404).json({
                ok: false,
                msg: 'No hay algun hospital con el id'
            });
        }

        const cambiosHospitales = {
            usuario: uid,
            status: 5
        }

        const HospitalActualizado = await contextHospital.findByIdAndUpdate({_id: idHospita},cambiosHospitales, {new: true});

        res.json({
            ok: true,
            msg: 'Registro eliminado correctamente!',
            hospital: HospitalActualizado
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Consulte el Adminstrador'
        });
    }
}

module.exports = {
    listaHospitales,
    hospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}