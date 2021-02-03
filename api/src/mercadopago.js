const axios = require('axios')

let acess_token = [
    {
        origin: 'localhost:21045',
        token: 'TEST-8221416026817177-012421-8975d759e0d59a673ff260d7b98408b6-196207284'
    }
]

exports.createPayment = (req, res) => {
    const {token} = req.body

    let acess_token = 'TEST-8221416026817177-012421-8975d759e0d59a673ff260d7b98408b6-196207284'

    let payment = {
        token: token,
        installments: 1,
        transaction_amount: 58.80,
        description: "Point Mini a maquininha que dá o dinheiro de suas vendas na hora",
        payment_method_id: "visa",
        external_reference: "MP0001",
        statement_descriptor: "MercadoPago"
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
            res.status(200).send(response.data)
        })
        .catch(function (error) {
            res.status(400).send(error.response.data)
        })
}
