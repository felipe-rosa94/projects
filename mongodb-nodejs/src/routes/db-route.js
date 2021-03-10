const express = require('express')
const router = express.Router()
const controller = require('../controllers/db-controller')

router.post('/:id', controller.post)

router.get('/:id', controller.get)

router.delete('/:id', controller.delete)

module.exports = router
