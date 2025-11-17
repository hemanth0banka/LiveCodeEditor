const errorHandler = (err, req, res, next) => {
    const msg = err.message || 'Internal Server Error'
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        success: false,
        message: msg
    })
}
module.exports = errorHandler