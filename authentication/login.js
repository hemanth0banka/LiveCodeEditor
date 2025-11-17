const users = require('../models/users.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authenticate = async (email, password) => {
    try {
        const user = await users.findOne({ email })
        if (!user) {
            const err = new Error('user not found')
            err.statusCode = 404
            throw err
        }
        const r = await bcrypt.compare(password, user.password)
        if (!r) {
            const err = new Error('Invalid Password')
            err.statusCode = 400
            throw err
        }
        const token = jwt.sign({
            userId: user._id,
            username: user.username,
            email: user.email
        }, process.env.securitykey, { expiresIn: '1h' })
        return token
    }
    catch (e) {
        throw e
    }
}
module.exports = authenticate