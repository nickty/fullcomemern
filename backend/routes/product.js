const express = require('express')
const { getProduct, newProduct, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/productController')
const { isAuthenticatedUser } = require('../middlewares/auth')

const router = express.Router()


router.route('/product/new').post(newProduct)

router.route('/products').get(isAuthenticatedUser, getProduct)

router.route('/product/:id').get(getSingleProduct)

router.route('/product/:id').put(updateProduct)

router.route('/product/:id').delete(deleteProduct)


module.exports = router