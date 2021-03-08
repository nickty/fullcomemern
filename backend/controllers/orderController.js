const Order = require('../models/order')
const Product = require('../models/product')

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')


//Create a new order => /api/v1/order/new
exports.newOrder = catchAsyncErrors (async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo, 
        paidAt: Date.now(), 
        user: req.user.id
    })

       order.orderItems.forEach(item => {
       updateStock(item.product, item.qty)
   })

    res.status(200).json({
        success: true,
        order
    })
})

const updateStock = async (id, quantity) => {
    const product = await Product.findById(id)

    product.stock -= quantity

    await product.save({validateBeforeSave: false})
}

//Get Signle orlder => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors (async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name')

    if(!order){
        return next(new ErrorHandler('No order found with this id', 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})

//Get logged in user orders => /api/v1/orders/me
exports.myOrders = catchAsyncErrors (async (req, res, next) => {
    const orders = await Order.find({user: req.user.id})

    res.status(200).json({
        success: true,
        orders
    })
})

//Get all orders => /api/v1/admin/orders
exports.allOrders = catchAsyncErrors (async (req, res, next) => {
    const orders = await Order.find()

    let totalAmount = 0

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})


//update / process order => /api/v1/admin/order/:id
exports.UpdateOrder = catchAsyncErrors (async (req, res, next) => {
    
    const order = await Order.findById(req.params.id)

    if(order.orderStatus === 'Delivered'){
       return next(new ErrorHandler('Your have already delivered this product', 400))
     }

   order.orderStatus = req.body.status, 
   order.deliveredAt = Date.now()

   await order.save()

    res.status(200).json({
        success: true
    })
})



//Delete order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors (async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler('No Order found with that id', 404))
    }

    await order.remove()

    res.status(200).json({
        success: true
    })
})