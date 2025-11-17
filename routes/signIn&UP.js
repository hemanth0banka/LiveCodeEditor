const controller = require('../controllers/signIn&Up.js')
const express = require('express')
const route = express.Router()
route.post('/login', controller.login)
route.post('/signup', controller.signUp)
route.post('/forgot', controller.forgot)
route.get('/forgot/:id', controller.linkvalidation)
route.put('/forgot/:id', controller.updatePassword)
module.exports = route