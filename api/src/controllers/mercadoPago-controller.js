const mercadopago = require('../mercadopago')

exports.get = ('/', (req, res, next) => {
    res.status(200).send({returnCode: 1, message: 'servidor de email'})
})

exports.post = ('/', (req, res, next) => {
    mercadopago.createPayment(req, res)
})



