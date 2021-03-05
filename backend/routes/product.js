const express = require('express')
const { getProduct, newProduct, getSingleProduct, updateProduct, deleteProduct, createProductReview, getProductReviews, deleteReviews, getAdminProducts } = require('../controllers/productController')
const { isAuthenticatedUser, authorizeRole } = require('../middlewares/auth')

const router = express.Router()


router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRole('admin'), newProduct)

router.route('/products').get(getProduct)
router.route('/admin/products').get(getAdminProducts)

router.route('/product/:id').get(getSingleProduct)

router.route('/product/:id').put(isAuthenticatedUser, authorizeRole('admin'), updateProduct)

router.route('/admin/product/:id').delete(isAuthenticatedUser, authorizeRole('admin'), deleteProduct)

router.route('/review').put(isAuthenticatedUser, createProductReview)
router.route('/reviews').get(isAuthenticatedUser, getProductReviews)
router.route('/reviews').delete(isAuthenticatedUser, deleteReviews)


module.exports = router