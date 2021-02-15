const express = require('express')
const { getProduct, newProduct, getSingleProduct, updateProduct, deleteProduct, createProductReview } = require('../controllers/productController')
const { isAuthenticatedUser, authorizeRole } = require('../middlewares/auth')

const router = express.Router()


router.route('/product/new').post(isAuthenticatedUser, authorizeRole('admin'), newProduct)

router.route('/products').get(getProduct)

router.route('/product/:id').get(getSingleProduct)

router.route('/product/:id').put(isAuthenticatedUser, authorizeRole('admin'), updateProduct)

router.route('/product/:id').delete(isAuthenticatedUser, authorizeRole('admin'), deleteProduct)

router.route('/review').post(isAuthenticatedUser, createProductReview)


module.exports = router