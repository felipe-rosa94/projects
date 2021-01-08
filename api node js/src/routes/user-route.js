const express = require('express')
const router = express.Router()
const controller = require('../controllers/user-controller')

//get
router.get('/', controller.get)

//post
router.post('/', controller.post)

//put
router.put('/:id', controller.put)

//delete
router.delete('/:id', controller.delete)

module.exports = router
