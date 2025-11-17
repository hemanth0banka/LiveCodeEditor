const mongoose = require('mongoose');
const { Schema } = mongoose;
const schema = new Schema({
    active: {
        type: Boolean,
        default: true
    },
    userUserId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })
module.exports = mongoose.model('request', schema)