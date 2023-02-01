require('dotenv').config();
const express = require('express');
var cors = require('cors')
const {dbConnection} = require('./database/config');


// crear el servidor de express 
const app = express(); 

// Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();

// Rutas

app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/auth', require('./routes/auth.routes'));


app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto: ${process.env.PORT}`);
});