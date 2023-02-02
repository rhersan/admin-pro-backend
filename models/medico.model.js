const {Schema,model} = require('mongoose');

const MedicoSchema =new Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    idHospital: {
        type: Schema.ObjectId,
        ref: 'Hospital',
        required: true,
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },

    status: {
        type: Number,
        default: 1
    }
});


MedicoSchema.method('toJSON', function(){
    const {__v, ...object} = this.toObject();
    return object;
});



module.exports = model('Medico',MedicoSchema);