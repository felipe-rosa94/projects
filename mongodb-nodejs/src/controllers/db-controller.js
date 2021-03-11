const mongoose = require('mongoose')
let ObjectID = require('mongodb').ObjectID

exports.get = ('/:id', (req, res) => {
    getTable(req, res)
})

exports.post = ('/:id', (req, res) => {
    register(req, res)
})

exports.put = ('/:id', (req, res) => {
    update(req, res)
})

exports.delete = ('/:id', (req, res) => {
    remove(req, res)
})

const getTable = async (req, res) => {
    try {
        const {params: {id}, query} = req
        const database = mongoose.connection.collection(id)
        const response = await database.find(query).toArray()
        res.status(200).send({returnCode: 1, message: 'Obtido', data: response})
    } catch (e) {
        res.status(500).send({returnCode: 0, message: e.message})
    }
}

const register = (req, res) => {
    try {
        const {body, params: {id}} = req
        const database = mongoose.connection.collection(id)
        database
            .insertOne(body)
            .then((response) => {
                res.status(200).send({returnCode: 1, message: 'Gravado'})
            })
            .catch((error) => {
                res.status(400).send({returnCode: 0, message: error})
            })
    } catch (e) {
        res.status(500).send({returnCode: 0, message: e.message})
    }
}

const update = (req, res) => {
    try {
        const {body, params: {id}, query} = req
        const database = mongoose.connection.collection(id)
        const _id = new ObjectID(query.id)
        database
            .updateOne({_id: _id}, {$set: body}, {upsert: true})
            .then((response) => {
                res.status(200).send({returnCode: 1, message: 'Alterado'})
            })
            .catch((error) => {
                res.status(400).send({returnCode: 0, message: error})
            })
    } catch (e) {
        res.status(500).send({returnCode: 0, message: e.message})
    }
}

const remove = (req, res) => {
    try {
        const {params: {id}, query} = req
        const database = mongoose.connection.collection(id)
        const _id = new ObjectID(query.id)
        database
            .deleteOne({_id: _id})
            .then((response) => {
                res.status(200).send({returnCode: 1, message: 'Deletado'})
            })
            .catch((error) => {
                res.status(400).send({returnCode: 0, message: error})
            })
    } catch (e) {
        res.status(500).send({returnCode: 0, message: e.message})
    }
}
