const axios = require('axios')
const firebase = require('./firebase')
const util = require('./util')

exports.createPayment = (req, res) => {
    const {token, delivery: {tipo}, total, order, client: {email, nome, telefone}, flag} = req.body

    let acess_token = 'TEST-8221416026817177-012421-8975d759e0d59a673ff260d7b98408b6-196207284'

    let payment = {
        token: token,
        installments: 1,
        transaction_amount: total,
        payment_method_id: flag,
        description: 'FB Suportes',
        payer: {
            email: email
        }
    }

    let config = {
        method: 'post',
        url: 'https://api.mercadopago.com/v1/payments',
        headers: {
            Authorization: `Bearer ${acess_token}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(payment)
    }

    axios(config)
        .then(function (response) {
            if (response.data.status === 'approved') {

                let mail = {
                    body: {
                        to: 'felipe@bitbar.com.br',
                        subject: 'Compra feita pelo site',
                        text: `Uma compra acaba de ser feita no site no valor total de ${total}                                     
                    \nCliente: ${nome}
                    \nE-mail: ${email}
                    \nTelefone: ${telefone}
                    \nTipo de entrega: ${tipo}`
                    }
                }

                util.mail(mail)
                recordFirebase(order)
                res.status(200).send({returnCode: 1, message: 'Compra aprovada com sucesso.'})
            }
        })
        .catch(function (error) {
            res.status(400).send(error.response.data)
        })
}

const id = () => {
    let key = new Date()
    return `${key.getTime() - 999}${Math.floor(Math.random() * 999)}`
}

const recordFirebase = order => {
    try {
        let json = {
            id: id(),
            pedido: order
        }
        firebase
            .database()
            .ref(`pedidos/${json.id}`)
            .set(json)
            .then((data) => {

            })
    } catch (e) {

    }
}
