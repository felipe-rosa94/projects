const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors({origin: '*'}))
app.use(express.json({type: ['application/json', 'text/plain']}))

const url = 'mongodb://whiledev01:LiPe0310@mongodb.whiledev.com.br:27017/whiledev01'

mongoose.connect(url, {useNewUrlParser: true})
const con = mongoose.connection

con.on('open', () => {
    console.log('conectado')
})

const index = require('./routes/index-route')
app.use('/', index)

const db = require('./routes/db-route')
app.use('/db', db)

module.exports = app
