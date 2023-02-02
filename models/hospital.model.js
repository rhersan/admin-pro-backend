const {Schema, model} = require('mongoose');

const HospitalSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },

    usuario:{
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },

    status: {
        type: Number,
        default: 1
    }

},{collection: 'hospitales'});

HospitalSchema.method('toJSON', function(){
    const {__v, ...object} = this.toObject();
    return object;
});


module.exports = model('Hospital', HospitalSchema);