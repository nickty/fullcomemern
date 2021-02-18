const express = require('express')
const app = express()

const errorMiddleware = require('./middlewares/errors')
const cookieParser = require('cookie-parser')
const cloudinary = require('cloudinary')


app.use(express.json())
app.use(cookieParser())

//Setting cloudinary
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const products = require('./routes/product')
const users = require('./routes/user')
const order = require('./routes/order')

app.use('/api/v1', products)
app.use('/api/v1', users)
app.use('/api/v1', order)

//Middlewares to handle error
app.use(errorMiddleware)

module.exports = app