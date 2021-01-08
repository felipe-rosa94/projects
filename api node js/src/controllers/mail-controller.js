const nodemailer = require('nodemailer')

let remetente = nodemailer.createTransport({
    host: 'smtp.live.com',
    service: 'Hotmail',
    port: 465,
    auth: {
        user: 'naoresponda.whiledev@hotmail.com',
        pass: 'Whiledev2020'
    }
})

exports.get = ('/', (req, res, next) => {
    res.status(200).send({returnCode: 0, message: 'servidor de email'})
})

exports.post = ('/', (req, res, next) => {
    const {to, subject, text} = req.body

    if (!to || !text) {
        res.status(400).send({returnCode: 1, message: 'Erro! envie os dados corretamente.'})
        return
    }

    let email = {
        from: 'naoresponda.whiledev@hotmail.com',
        to: to,
        subject: subject,
        text: text,
    }

    remetente.sendMail(email, function (error) {
        if (error) {
            res.status(400).send({returnCode: 1, message: error})
        } else {
            res.status(200).send({returnCode: 0, message: 'Email enviado com sucesso.'})
        }
    })
})



