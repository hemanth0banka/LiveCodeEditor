const jwt = require('jsonwebtoken')
const validator = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            const err = new Error('token is missing')
            err.statusCode = 401
            return next(err)
        }
        const decoded = jwt.verify(token, process.env.securitykey)
        if (!decoded) {
            const err = new Error('Invalid token')
            err.statusCode = 401
            return next(err)
        }
        req.user = decoded
        next()
    }
    catch (e) {
        e.statusCode = 401
        next(e)
    }
}
module.exports = validator