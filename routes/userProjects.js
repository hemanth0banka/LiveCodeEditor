const controller = require('../controllers/userProjects.js')
const express = require('express')
const route = express.Router()
route.get('/documents', controller.userProjects)
route.delete('/delete', controller.accounDelete)
module.exports = route