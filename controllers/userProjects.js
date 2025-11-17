const documents = require('../models/documents.js')
const users = require('../models/users.js')
//const request 
const userProjects = async (req, res, next) => {
    try {
        userid = req.user.userId
        const data = await documents.find({ admin: req.user.userId })
        const projects = await documents.find({
            members: userid
        })
        const waitings = await documents.find({
            waiting: userid
        })
        res.status(200).json({
            success: true,
            message: 'List of all user projects',
            data: [req.user, data, projects, waitings]
        })
    }
    catch (e) {
        next(e)
    }
}
const accounDelete = async (req, res, next) => {
    try {
        const id = req.user.userId
        const doc = await documents.find({ admin: id })
        const projects = await documents.find({
            members: userid
        })
        const waitings = await documents.find({
            waiting: userid
        })
        for (let x of doc) {
            await documents.findByIdAndDelete(x._id)
        }
        for (let x of projects) {
            const r = await document.findById(x.id)
            const arr = []
            for (let y of r.members) {
                if (y != id) {
                    arr.push(y)
                }
            }
            r.members = arr
            await r.save()
        }
        for (let x of waitings) {
            const r = await document.findById(x.id)
            const arr = []
            for (let y of r.waiting) {
                if (y != id) {
                    arr.push(y)
                }
            }
            r.members = arr
            await r.save()
        }
        const u = await users.findByIdAndDelete(id)
        res.status(200).send('ok')
    }
    catch (e) {
        next(e)
    }
}
module.exports = { userProjects, accounDelete }