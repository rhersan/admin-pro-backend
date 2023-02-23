const { response } = require('express');
const contextUsuario = require('../models/usuario.model');
const contextMedico = require('../models/medico.model');
const contextHospital = require('../models/hospital.model');


const buscadorGlobal = async (req, res = response) => {
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');


    try {

        const [
            usuarios,
            medicos,
            hospitales
        ] = await Promise.all([
            contextUsuario.find({ status: { $in: [0, 1] }, nombre: regex }),
            contextMedico.find({ status: { $in: [0, 1] }, nombre: regex }),
            contextHospital.find({ status: { $in: [0, 1] }, nombre: regex })
        ]);

        res.json({
            ok: true,
            usuarios,
            medicos,
            hospitales
        });
    } catch (error) {
        console.log(error);
        res.status().json({
            ok: false,
            smg: 'Llame al Administrador'
        });

    }
}

const buscadorPorColeccion = async (req, res = response) => {

    const coleccion = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');
    
    try {
        
        let dataResult = [];

        switch (coleccion) {
            case "hospitales":
                dataResult = await contextHospital.find({ status: { $in: [0, 1] }, nombre: regex })
                                                  .populate('usuario', 'nombre');

                break;
            case "medicos":
                dataResult = await contextMedico.find({ status: { $in: [0, 1] }, nombre: regex })
                                                 .populate('usuario', 'nombre')
                                                 .populate('hospital', 'nombre img');
                break;
            case "usuarios":
                dataResult = await contextUsuario.find({ status: { $in: [0, 1] }, nombre: regex })

                break;
            default:
                return res.status(404).json({
                    ok: false,
                    msg: 'La colección tiene que ser usuarios/medicos/hospitales'
                });
        }

        res.json({
            ok: true,
            resultados: dataResult
        });

    } catch (error) {
        console.log(error);
        res.status().json({
            ok: false,
            smg: 'Llame al Administrador'
        });

    }
}



module.exports = {
    buscadorGlobal,
    buscadorPorColeccion
}