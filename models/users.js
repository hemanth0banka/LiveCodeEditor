const mongoose = require('mongoose')
const { Schema } = mongoose
const schema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true
    }
},{ timestamps : true})
module.exports = mongoose.model('user', schema)