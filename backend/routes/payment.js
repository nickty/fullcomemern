const express = require('express')
const router = express.Router()

const {
    processPayment
} = require('../controllers/payment_controller')

const { isAuthenticatedUser } = require('../middlewares/auth')

router.route('/payment/process').post(isAuthenticatedUser, processPayment)

module.exports = router