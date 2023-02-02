/*
    RUTA: api/todo/:busqueda
*/


const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');
const router = Router();
const {buscadorGlobal,buscadorPorColeccion} = require('../controllers/buscador.controller');


router.get('/:busqueda',validarJWT, buscadorGlobal);
router.get('/coleccion/:tabla/:busqueda',validarJWT,buscadorPorColeccion);



module.exports = router;