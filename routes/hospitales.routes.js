/**
        Hospitales
        ruta: '/api/hospitales'
 */

const {Router} = require('express');
const {check} =  require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {listaHospitales, crearHospital, actualizarHospital, eliminarHospital} = require('../controllers/hospitales.controller');


const route = Router();


route.get('/',validarJWT,listaHospitales);
route.post('/',[
        validarJWT,
        check('nombre','El nombre es obligatorio').not().notEmpty(),
        check('img', 'La imagen es obligatorio').not().notEmpty(),
        validarCampos
    ],
    crearHospital );

route.put('/:id',[
        validarJWT,
        check('nombre','El nombre es obligatorio').not().notEmpty(),
        check('img', 'La imagen es obligatorio').not().notEmpty(),
        validarCampos
    ],
    actualizarHospital );

route.delete('/:id',validarJWT, eliminarHospital);


module.exports =   route;