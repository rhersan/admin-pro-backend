const fs = require('fs');
const contextUsuario = require('../models/usuario.model');
const contextHospital = require('../models/hospital.model');
const contextMedico = require('../models/medico.model');

const actualizarImagen = async (coleccion, id, fileName) => {

    const filter = { _id: id };
    const update = { img: fileName };

    let pathViejo = '';
    switch (coleccion) {
        case 'usuarios':

            const usuarioDB = await contextUsuario.findById(id);
            if (!usuarioDB) {
                console.log('No se encontro un usuario por id');
                return false;
            }
            await contextUsuario.findOneAndUpdate(filter, update);
            pathViejo = `./uploads/usuarios/${usuarioDB.img}`;
            await borrarImagen(pathViejo);

            break;
        case 'hospitales':

            const hospitalDB = await contextHospital.findById(id);
            if (!hospitalDB) {
                console.log('No se encontro un hospital por id');
                return false;
            }
            await contextHospital.findOneAndUpdate(filter, update);
            pathViejo = `./uploads/hospitales/${hospitalDB.img}`;
            await borrarImagen(pathViejo);

            break;
        case 'medicos':

            const medicosDB = await contextMedico.findById(id);
            if (!medicosDB) {
                console.log('No se encontro un medico por id');
                return false;
            }
            await contextMedico.findOneAndUpdate(filter, update);
            pathViejo = `./uploads/medicos/${medicosDB.img}`;
            await borrarImagen(pathViejo);

            break;
    }
    return true;
}

const borrarImagen = async (path) => {
    if (fs.existsSync(path)) {
        // Borrar imagen anterior
        fs.unlinkSync(path);
        console.log('imagen borrado: ',path);
    }
}

module.exports = {
    actualizarImagen,
    borrarImagen
}