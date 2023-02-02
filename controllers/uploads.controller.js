
const _path = require('path');
const fs = require('fs');
const {response} = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen, borrarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = async(req, res = response) => {

    const {tipo,id} = req.params;

    const tiposValidos = ['hospitales','medicos', 'usuarios'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'Tipos validos' + tiposValidos.join()
        });
    }

    // Valida que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        });
    }

    try{
        // Procesar imagen...

        // files es el middleware que se estableció en uploads.routes.js
        const file = req.files.imagen;
        const extencionArchivo = file.mimetype.split('/')[1];

        //validar extencion
        const extencionesValidas = ['png','jpg','jpeg','gif']
        if(!extencionesValidas.includes(extencionArchivo)){
            return res.status(400).json({
                ok: false,
                msg: 'Solo se permite los siguientes formatos: ' + extencionesValidas.join()
            });
        }

        // Generar nombre del archivo
        const fileName = `${uuidv4()}.${extencionArchivo}`;

        // Path para guardar la imagen
        const path = `./uploads/${tipo}/${fileName}`;

        // Mover la imagen
        file.mv(path,async (error) => {

            if (error) {
                console.log(error);
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al mover la imagen'
                });
            }

            // actualizar base de datos
            var resp = await actualizarImagen(tipo,id,fileName);
            if (!resp) {
                console.log(false);
                await borrarImagen(path);
                return res.status(404).json({
                    ok: false,
                    msg: 'Error al actualizar imagen'
                });
            }
            

            res.json({
                ok: true,
                msg: 'Archivo subido',
                path
            });
        });
        

        // validar peso
        const peso = file.size;


    }catch(error){
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Consulte al Adeministrador'
        });
    }
}
const getImagen = async (req, res = response)=>{

    const tipo = req.params.tipo;
    const fileName = req.params.filename;

    const pathImg = _path.join(__dirname,`../uploads/${tipo}/${fileName}`);


    try{
        

        if(fs.existsSync(pathImg)){
            res.sendFile(pathImg);
        }else{            
            const noimage= _path.join(__dirname,'../assets/img/noimage.png');
            console.log(noimage);
            res.sendFile(noimage);
        }
        
    }catch(error){
        console.log(error);
        resp.status(400).status({
            ok: false,
            msg: 'Contacte al Administrador'
        });
    }
}

module.exports = {
    fileUpload,
    getImagen
}