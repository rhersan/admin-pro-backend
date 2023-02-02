/*
    Ruta: api/uploads
*/
const {Router} =  require('express');
const expressFileUpload = require('express-fileupload');
const { fileUpload, getImagen } = require('../controllers/uploads.controller');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.use(expressFileUpload()
);


router.put('/:tipo/:id',validarJWT,fileUpload);
router.get('/:tipo/:filename',validarJWT,getImagen);


module.exports = router;