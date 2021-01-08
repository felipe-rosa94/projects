const firebase = require('../firebase')

exports.get = ('/', (req, res, next) => {
    const query = req.query
    if (isEmpty(query)) {
        firebase
            .database()
            .ref(`user`)
            .once('value')
            .then(function (snapshot) {
                let value = snapshot.val()
                res.status(200).send({returnCode: 0, users: value !== null ? Object.values(value) : []})
            })
            .catch(e => {
                res.status(200).send({returnCode: 1, message: 'Erro ao gravar'})
            })
    } else {
        let orderByChild = Object.keys(query)[0]
        let equalTo = query[orderByChild]
        firebase
            .database()
            .ref(`user`)
            .orderByChild(orderByChild)
            .equalTo(equalTo)
            .on("child_added", function (snapshot) {
                let value = snapshot.val()
                res.status(200).send({returnCode: 0, users: value !== null ? value : []})
            })
    }
})

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

exports.post = ('/', (req, res, next) => {
    const {key} = req.body
    firebase
        .database()
        .ref(`user/${key}`)
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

