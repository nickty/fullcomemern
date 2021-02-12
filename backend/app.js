const express = require('express')
const app = express()

const errorMiddleware = require('./middlewares/errors')

app.use(express.json())

const products = require('./routes/product')
const users = require('./routes/user')

app.use('/api/v1', products)
app.use('/api/v1', users)

//Middlewares to handle error
app.use(errorMiddleware)

module.exports = app