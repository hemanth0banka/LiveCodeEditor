const mongoose = require('mongoose')
const { Schema } = mongoose
const schema = new Schema({
    documentName: {
        type: String,
        required: true
    },
    type : {
        type : String,
        required:true
    },
    content : {
        type : String,
        default : "//Hello world ...!"
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    members: {
        type: Array
    },
    waiting : {
        type: Array
    }
}, { timestamps: true })
module.exports = mongoose.model('document', schema)