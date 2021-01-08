const firebase = require('../firebase')

exports.get = ('/', (req, res, next) => {
    res.status(200).send({metodo: 'GET'})
})

exports.post = ('/', (req, res, next) => {
    firebase
        .database()
        .ref('teste')
        .set(req.body)
        .then((data) => {
            res.status(201).send({returnCode: 0, message: 'Gravado com sucesso...'})
        })
        .catch(e => {
            res.status(201).send({returnCode: 1, message: 'Erro ao gravar'})
        })
})

exports.put = ('/:id', (req, res, next) => {
    //pega parametro da URL, ex: http://localhost/products/{id}
    const id = req.params.id
    res.status(200).send({
        metodo: 'PUT',
        ID: id
    })
})

exports.delete = ('/', (req, res, next) => {
    res.status(200).send({
        metodo: 'DELETE'
    })
})

