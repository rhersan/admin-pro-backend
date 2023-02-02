/**
        Medicos
        ruta: '/api/medico'
 */

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} =  require('../middlewares/validar-jwt');
const {
    listadoMedicos,
    crearMedicos,
    actualizarMedicos,
    eliminarMedicos
} = require('../controllers/medicos.controller');

const route =  Router();


route.get('/',validarJWT, listadoMedicos);

route.post('/',[
        validarJWT,
        check('nombre','El nombre es obligatorio').not().notEmpty(),
        check('img', 'La imagen es obligatorio').not().notEmpty(),
        check('idHospital','El hospital id debe ser válido').isMongoId(),
        validarCampos
    ], crearMedicos);

route.put('/:id',[
        validarJWT,
        check('nombre','El nombre es obligatorio').not().notEmpty(),
        check('img', 'La imagen es obligatorio').not().notEmpty(),
        check('idHospital','El hospital id debe ser válido').isMongoId(),
        validarCampos
    ], actualizarMedicos);


    
route.delete('/:id',validarJWT, eliminarMedicos);

module.exports = route;