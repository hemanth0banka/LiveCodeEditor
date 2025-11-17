const users = require('../models/users.js')
const bcrypt = require('bcrypt')
const req = require('../models/request.js')
const Sib = require('sib-api-v3-sdk');
const expire = 1000 * 60 * 5;
const registration = async (username, email, phone, password) => {
    try {
        const user = await users.findOne({ email })
        if (user) {
            const err = new Error('user Found')
            err.statusCode = 400
            throw err
        }
        const hashed = await bcrypt.hash(password, Number(process.env.salt))
        const document = await new users({ username, email, phone, password: hashed })
        await document.save()
        return document
    }
    catch (e) {
        throw e
    }
}

const forgot = async (email) => {
    try {
        const user = await users.findOne({ email })
        const request = await new req({ userUserId: user._id })
        await request.save()
        const id = request._id
        const link = `http://localhost:1000/user/forgot/${id}`
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.SibapiKey;
        const emailapi = new Sib.TransactionalEmailsApi()

        const sender = {
            email: process.env.SIB_SENDER_EMAIL,
        }
        const receivers = [
            {
                email: email
            }
        ]
        let info = await emailapi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'password Reset Link',
            textContent: `click  this ${link} link to reset your password`
        })
        return
    }
    catch (e) {
        throw e
    }
}


const linkvalidate = async (id) => {
    try {
        const r = await req.findById(id)
        if (!r.active) return 'link expired'
        if (new Date(r.createdAt) < new Date(Date.now() - expire)) return 'link expired'
        r.active = false
        await r.save()
        return 'ok'
    }
    catch (e) {
        throw e
    }
}

const updatePassword = async (id, p) => {
    try {
        const r = await req.findById(id)
        const user = await users.findById(r.userUserId)
        const hash = await bcrypt.hash(p, Number(process.env.salt))
        user.password = hash
        await user.save()
        return 'updated'
    }
    catch (e) {
        throw e
    }
}

module.exports = { registration, forgot, linkvalidate, updatePassword }