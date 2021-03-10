const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors({origin: '*'}))
app.use(express.json({type: ['application/json', 'text/plain']}))

const url = ''

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
