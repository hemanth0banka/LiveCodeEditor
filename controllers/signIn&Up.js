const register = require('../authentication/registration.js')
const authenticate = require('../authentication/login.js')
const path = require('path')
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const token = await authenticate(email, password)
        res.status(200).send({
            success: true,
            message: 'login success',
            data: token
        })
    }
    catch (e) {
        next(e)
    }
}
const signUp = async (req, res, next) => {
    try {
        const { username, email, phone, password } = req.body
        const document = await register.registration(username, email, phone, password)
        res.status(201).json({
            success: true,
            message: 'registered succesfully'
        })
    }
    catch (e) {
        next(e)
    }
}

const forgot = async (req, res, next) => {
    try {
        const email = req.body.email
        const r = await register.forgot(email)
        return res.status(200).send('reset link sent')
    }
    catch (e) {
        next(e)
    }
}


const linkvalidation = async (req, res, next) => {
    try {
        const id = req.params.id
        const r = await register.linkvalidate(id)
        if (r === 'link expired') {
            const error = new Error('link expired')
            error.statusCode = 400
            next(error)
        }
        res.status(200).sendFile(path.join(__dirname, '../views/reset.html'))
    }
    catch (e) {
        next(e)
    }
}
const updatePassword = async (req, res, next) => {
    try {
        const { password } = req.body
        const { id } = req.params
        const r = await register.updatePassword(id, password)
        res.status(200).send('password updated')
    }
    catch (e) {
        next(e)
    }
}

module.exports = { login, signUp, forgot, linkvalidation, updatePassword }