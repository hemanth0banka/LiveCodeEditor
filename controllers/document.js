const documents = require('../models/documents.js')
const users = require('../models/users.js')

const getContent = async (req, res, next) => {
    try {
        const { id } = req.params
        const doc = await documents.findById(id).populate('admin')
        res.status(200).send(doc)
    }
    catch (e) {
        next(e)
    }
}

const member = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await users.findById(id)
        res.status(200).json({
            data: user
        })
    }
    catch (e) {
        next(e)
    }
}

const joinrequest = async (req, res, next) => {
    try {
        const { id } = req.body
        const doc = await documents.findById(id)
        if (!doc) {
            const err = new Error('No Document Found')
            err.statusCode = 404
            return next(err)
        }
        const waiting = [...doc.waiting]
        waiting.push(req.user.userId)
        doc.waiting = waiting
        await doc.save()
        res.status(200).send({
            success: true,
            message: 'joinrequest sent',
            data: doc
        })
    }
    catch (e) {
        next(e)
    }
}

const accept = async (req, res, next) => {
    try {
        const { documentid, userId } = req.body
        const doc = await documents.findById(documentid)
        let arr = []
        for (let x of doc.waiting) {
            if (x != userId) {
                arr.push(x)
            }
        }
        doc.waiting = arr
        let mem = [...doc.members]
        mem.push(userId)
        doc.members = mem
        await doc.save()
        res.status(200).send('ok')
    }
    catch (e) {
        next(e)
    }
}

const reject = async (req, res, next) => {
    try {
        const { documentid, userId } = req.body
        const doc = await documents.findById(documentid)
        let arr = []
        for (let x of doc.waiting) {
            if (x != userId) {
                arr.push(x)
            }
        }
        doc.waiting = arr
        await doc.save()
        res.status(200).send('ok')
    }
    catch (e) {
        next(e)
    }
}

const saveContent = async (req, res, next) => {
    try {
        const { id, content } = req.body
        const doc = await documents.findById(id)
        doc.content = content
        await doc.save()
        res.status(200).json({
            success: true,
            message: 'changes are saved'
        })
    }
    catch (e) {
        next(e)
    }
}

const exit = async (req, res, next) => {
    try {
        const { documentId } = req.body
        const doc = await documents.findById(documentId)
        let arr = []
        for (let x of doc.members) {
            if (x != req.user.userId) {
                arr.push(x)
            }
        }
        doc.members = arr
        await doc.save()
        res.status(200).send('ok')
    }
    catch (e) {
        next(e)
    }
}

module.exports = { getContent, joinrequest, member, saveContent, accept, reject, exit }