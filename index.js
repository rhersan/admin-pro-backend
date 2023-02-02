require('dotenv').config();
const express = require('express');
var cors = require('cors')
const {dbConnection} = require('./database/config');


// crear el servidor de express 
const app = express(); 


// Carpeta publica
app.use(express.static('public'));

// Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();

// Rutas
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/hospitales', require('./routes/hospitales.routes'));
app.use('/api/medicos', require('./routes/medicos.routes'));
app.use('/api/todo', require('./routes/busqueda.routes'));
app.use('/api/upload', require('./routes/uploads.routes'));


app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto: ${process.env.PORT}`);
});