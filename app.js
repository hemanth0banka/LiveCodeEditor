const dotenv = require('dotenv').config();
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const signInUp = require('./routes/signIn&UP.js');
const userProjects = require('./routes/userProjects.js');
const document = require('./routes/document.js')
const ai = require('./routes/ai.js')
const tokenValidator = require('./middlewares/tokenValidator.js');
const errorHandler = require('./middlewares/errorHandler');
const io = require('./service/socketConnection.js')
const port = process.env.port || 3000;
app.use(express.json());
app.use(cors({
    origin: '*'
}))
app.use(express.static(path.join(__dirname, 'public')));
io(server)
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'public', 'pages', 'login.html'))
});
app.use('/user', signInUp);
app.get('/home', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'public', 'pages', 'home.html'))
});
app.use(tokenValidator);
app.use('/ai', ai)
app.use('/user', userProjects);
app.use('/document', document);
app.use((req, res, next) => {
    const err = new Error('Page not found ...')
    err.statusCode = 404
    next(err)
});
app.use(errorHandler);
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('DataBase Connected ...')
        server.listen(port, () => {
            console.log(`Server Listening at http://localhost:${port}/`)
        })
    }
    catch (e) {
        console.log(e)
    }
})()