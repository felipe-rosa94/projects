require('./auth')
const express = require('express')
const cors = require('cors')

const app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors())
    next()
})

app.use(express.json({type: ['application/json', 'text/plain']}))

const index = require('./routes/index-route')
app.use('/', index)

const user = require('./routes/user-route')
app.use('/user', user)

const mail = require('./routes/mail-route')
app.use('/mail', mail)

module.exports = app
