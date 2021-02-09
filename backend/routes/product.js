const express = require('express')
const { getProduct, newProduct } = require('../controllers/productController')

const router = express.Router()


router.route('/product/new').post(newProduct)

router.route('/products').get(getProduct)


module.exports = router