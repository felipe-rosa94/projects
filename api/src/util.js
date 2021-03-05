const nodemailer = require('nodemailer')

exports.mail = (req, res = null) => {
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
        if (res) res.status(400).send({returnCode: 0, message: 'Erro! envie os dados corretamente.'})
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
            if (res) res.status(400).send({returnCode: 0, message: error})
        } else {
            if (res) res.status(200).send({returnCode: 1, message: 'Email enviado com sucesso.'})
        }
    })
}
