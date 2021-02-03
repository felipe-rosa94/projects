const nodemailer = require('nodemailer')
const axios = require('axios')

exports.mail = (req, res) => {
    let remetente = nodemailer.createTransport({
        host: 'smtp.live.com',
        service: 'Hotmail',
        port: 465,
        auth: {
            user: 'naoresponda.whiledev@hotmail.com',
            pass: 'Whiledev2020'
        }
    })

    const {to, subject, text} = req.body

    if (!to || !text) {
        res.status(400).send({returnCode: 0, message: 'Erro! envie os dados corretamente.'})
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
            res.status(400).send({returnCode: 0, message: error})
        } else {
            res.status(200).send({returnCode: 1, message: 'Email enviado com sucesso.'})
        }
    })
}
