const express = require('express')
const router = express.Router()
const controller = require('../controllers/db-controller')

router.post('/', controller.post)

router.get('/', controller.get)

router.patch('/:id', controller.patch)

router.delete('/:id', controller.delete)

module.exports = router
