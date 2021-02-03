const util = require('../util')

exports.get = ('/', (req, res, next) => {
    res.status(200).send({returnCode: 1, message: 'servidor de email'})
})

exports.post = ('/', (req, res, next) => {
    util.mail(req, res)
})




