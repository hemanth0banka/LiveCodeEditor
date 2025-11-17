const handler = require('./handler.js')
const middlewares = require('./middleware.js')
const { Server } = require('socket.io')
const connection = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*'
        }
    });
    io.use(middlewares.auth);
    handler(io);
}
module.exports = connection