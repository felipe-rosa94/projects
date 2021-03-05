const Client = require('../models/client')

exports.get = ('/', async (req, res) => {
    try {
        const client = await Client.find()
        res.json(client)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

exports.patch = ('/:id', async (req, res) => {
    try {
        const {params: {id}} = req
        const client = await Client.findById(id)
        res.json(client)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

exports.post = ('/', async (req, res) => {
    const {name, email, anddres} = req.body

    const client = new Client({
        name: name,
        email: email,
        anddres: anddres
    })

    try {
        const object = await client.save()
        res.json(object)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

exports.delete = ('/:id', async (req, res) => {
    const {params: {id}} = req
    try {
        const client = await Client.remove({"_id": id})
        res.json(client)
    } catch (e) {
        res.status(500).send(e.message)
    }
})
