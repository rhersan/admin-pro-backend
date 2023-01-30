
const mongoose = require('mongoose'); // getting-started.js

const dbConnection = async() => {
    try{
        mongoose.set('strictQuery', false);        
        // User: mean_user
        // pass: I2tfv8foqqEE72KC
        await mongoose.connect(process.env.DB_CNN);

        console.log('DB Online');
    }catch(error){
        console.log(error);
        throw new Error(' Error a la hora de iniciar la DB.');
    }
}

module.exports = {
    dbConnection: dbConnection   
}