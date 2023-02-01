const { Router } = require('express');
const {check} =  require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {login} = require('../controllers/auth.controller');

const router = Router();

router.get('/',[
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ],login);


module.exports = router;