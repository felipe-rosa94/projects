const mongoose = require('mongoose')

const anddresSchema = new mongoose.Schema({
    anddres: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    cep: {
        type: String,
        required: true
    }
})

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    anddres: anddresSchema
})

module.exports = mongoose.model('Client', clientSchema)
