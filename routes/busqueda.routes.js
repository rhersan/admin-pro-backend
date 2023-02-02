/*
    RUTA: api/todo/:busqueda
*/


const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');
const route = Router();
const {buscadorGlobal,buscadorPorColeccion} = require('../controllers/buscador.controller');


route.get('/:busqueda',validarJWT, buscadorGlobal);
route.get('/coleccion/:tabla/:busqueda',validarJWT,buscadorPorColeccion);



module.exports = route;