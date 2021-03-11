const express = require('express')
const router = express.Router()
const controller = require('../controllers/db-controller')

router.get('/:id', controller.get)

router.post('/:id', controller.post)

router.put('/:id', controller.put)

router.delete('/:id', controller.delete)

module.exports = router
