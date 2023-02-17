const jwt = require('jsonwebtoken');

const generarJWT = (uid, name) => {

    const payload = { uid, name };

    return new Promise( (resolve, reject) => {

        jwt.sign(payload, process.env.JWT_SECRET , {
            expiresIn: '12h'
        }, (error, token) => {
            if(error){
                // TODO MAL
                console.log(error);
                reject(error);
            }else{
                // TODO BIEN
                resolve(token);
                
            }
        });

        
    });


}

module.exports = {
    generarJWT,
}