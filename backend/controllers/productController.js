const { baseModelName } = require("../models/product")

const Product = require('../models/product')
const User = require('../models/user')

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')

//Create New product => /api/v1/product/new
exports.newProduct = catchAsyncErrors( async (req, res, next) => {

    req.body.user = req.user.id

    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
})

//Get all product => /api/v1/products

exports.getProduct = catchAsyncErrors (async (req, res, next) => {

    //return next(new ErrorHandler('Customer error', 400))

    const resPerPage = 8;

    const productsCount = await Product.countDocuments()

    const apiFeatures = new APIFeatures (Product.find(), req.query)
                        .search()
                        .filter()
                        .pagnation(resPerPage)                

    const products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        productsCount,
        products
    })
})

//get signle product details => /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors (async (req, res, next) => {

    const product = await Product.findById(req.params.id)

    if(!product){
        // return res.status(404).json({
        //     success: false, 
        //     message: 'product not found'
        // })

        return next(new ErrorHandler('Product not found!', 404))
    }

    res.status(200).json({
        success: true, 
        product
    })
})

//Update product = > /api/v1/product/:id
exports.updateProduct = catchAsyncErrors (async (req, res, next) => {
    let product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler('Product not found!', 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
})

//Delete Product => /api/v1/product/:id
exports.deleteProduct = catchAsyncErrors (async (req, res, next) => {

    let product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler('Product not found!', 404))
    }    

    await Product.remove()

    
    res.status(200).json({
        success: true,
        message: 'Product is removed'
    })
            
})    


//Create new review => /api/v1/review
exports.createProductReview = catchAsyncErrors (async (req, res, next) => {
    const {rating, comment, productId} = req.body

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId)

    const isReviewed = product.reviews.find(
        r => r.user.toString === req.user._id.toString()
    )

    if(isReviewed) {

        product.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment
                review.rating = rating
            }
        })

    } else {
        product.reviews.push(review)
        product.numberOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({validateBeforeSave: false})

    res.status(200).json({
        success: true
    })
})

// Get product Reviews => /api/v1/reviews 
exports.getProductReviews = catchAsyncErrors (async (req, res, next) => {
    const product = await Product.findById(req.query.id)

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// Delete Reviews => /api/v1/reviews 
exports.deleteReviews = catchAsyncErrors (async (req, res, next) => {
    const product = await Product.findById(req.query.productId)

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString())

    const numberOfReviews = reviews.length

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews, ratings, 
        numberOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})