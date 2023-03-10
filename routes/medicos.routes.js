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
    eliminarMedicos,
    medicoPorId
} = require('../controllers/medicos.controller');

const router =  Router();


router.get('/',validarJWT, listadoMedicos);
router.get('/:id',validarJWT, medicoPorId);

router.post('/',[
        validarJWT,
        check('nombre','El nombre es obligatorio').not().notEmpty(),
        check('hospital','El hospital id debe ser válido').isMongoId(),
        validarCampos
    ], crearMedicos);

router.put('/:id',[
        validarJWT,
        check('nombre','El nombre es obligatorio').not().notEmpty(),
        check('hospital','El hospital id debe ser válido').isMongoId(),
        validarCampos
    ], actualizarMedicos);


    
router.delete('/:id',validarJWT, eliminarMedicos);


module.exports = router;