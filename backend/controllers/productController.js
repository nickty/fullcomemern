const { baseModelName } = require("../models/product")

const Product = require('../models/product')

//Create New product => /api/v1/product/new
exports.newProduct = async (req, res, next) => {

    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
}

exports.getProduct = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'this route will show all product in database'
    })
}