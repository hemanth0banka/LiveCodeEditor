const ai = require('../controllers/ai.js')
const express = require('express')
const route = express.Router()
route.post('/ask', ai)
module.exports = route