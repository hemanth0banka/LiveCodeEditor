const document = require('../models/documents.js')
const projects = (io) => {
    io.on('connection', (socket) => {

        socket.on('content-change', ({ roomId, data }) => {
            try {
                socket.to(roomId).emit('content-change', { roomId, data, name: socket.user.username })
            }
            catch (e) {
                console.log(e)
            }
        })

        socket.on('create-document', async (obj) => {
            try {
                const { documentName, type } = obj
                console.log(socket.user)
                const admin = socket.user._id
                const doc = new document({ documentName, type, admin })
                await doc.save()
                socket.join(doc._id)
                socket.emit('join-room', doc)
            }
            catch (e) {
                console.log(e)
            }
        })

        socket.on('waiting', ({ roomId }) => {
            socket.join(roomId)
        })

        socket.on('join-room', async ({ roomId }) => {
            socket.join(roomId)
        })

        socket.on('leave-room', async ({ roomId }) => {
            socket.leave(roomId)
        })

        socket.on('member', async ({ roomId, documentName, userId, type }) => {
            socket.to(roomId).emit('waiting', { roomId, documentName, id: userId, type })
        })

        socket.on('member-removed', async ({ documentId, userId }) => {
            try {
                const doc = await document.findById(documentId)
                const arr = []
                for (let x of doc.members) {
                    if (x != userId) {
                        arr.push(x)
                    }
                }
                doc.members = arr
                await doc.save()
                socket.to(documentId).emit('member-removed', { documentId, id: userId, name: doc.documentName })
            }
            catch (e) {
                console.log(e)
            }
        })

        socket.on('del-doc', async ({ id }) => {
            try {
                const doc = await document.findByIdAndDelete(id)
                io.to(id).emit('del-doc',{id})
            }
            catch (e) {
                console.log(e)
            }
        })
    })
}
module.exports = projects