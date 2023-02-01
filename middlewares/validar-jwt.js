const { request, response } = require('express');
const jwt = require('jsonwebtoken');


const validarJWT = async (req = request, res = response, next) => {
    // leer JWT
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {

        const {uid} = await jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        next();
        
    } catch (error) {
        return res.status(401).json({
            ok: true,
            msg: 'Token no válido'
        });
    }



}

module.exports = {
    validarJWT,
}