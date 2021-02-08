const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({origin: '*'}))

app.use(express.json({type: ['application/json', 'text/plain']}))

const index = require('./routes/index-route')
app.use('/', index)

const mail = require('./routes/mail-route')
app.use('/mail', mail)

const mercadoPago = require('./routes/mercadoPago-route')
app.use('/mercadoPago', mercadoPago)

const calculaFrete = require('./routes/calculaFrete-route')
app.use('/calculaFrete', calculaFrete)

module.exports = app
