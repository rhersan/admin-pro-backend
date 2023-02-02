/*
    Ruta: api/uploads
*/
const {Router} =  require('express');
const expressFileUpload = require('express-fileupload');
const { fileUpload, getImagen } = require('../controllers/uploads.controller');
const { validarJWT } = require('../middlewares/validar-jwt');
const route = Router();

route.use(expressFileUpload()
);


route.put('/:tipo/:id',validarJWT,fileUpload);
route.get('/:tipo/:filename',validarJWT,getImagen);


module.exports = route;