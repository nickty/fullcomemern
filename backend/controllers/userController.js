const User = require('../models/user')

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

const cloudinary = require('cloudinary')

//Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors (async (req, res, next) =>{

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: "scale"
    })

    const {name, email, password} = req.body

    const user = await User.create({
        name, 
        email,
        password, 
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    

    const token = user.getJwtToken()

    // res.status(201).json({
    //     success: true, 
    //     token
    // })

    sendToken(user, 200, res)
})

//Login user => /api/v1/login
exports.loginUser = catchAsyncErrors (async (req, res, next) => {
    const {email, password} = req.body

    //Check if email and password is entered by user 
    if(!email || !password){
        return next(new ErrorHandler('Please enter email and password!', 404))

    }

    //Find user in database
    const user = await User.findOne({email}).select('+password')

    if(!user) {
        return next(new ErrorHandler('Invalied email or password', 401)) // 401 = un authenticated user
    }

    //Check if password matched or not 
    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalied or password', 401))
    }

    // const token = user.getJwtToken()

    // res.status(200).json({
    //     success: true,
    //     token
    // })

    sendToken(user, 200, res)
})

//Logout user  => /api/v1/logout
exports.logoutUser = catchAsyncErrors (async (req, res, next) => {
    res.cookie('token', null, {
        exppires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logout Out'
    })
})

//Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors (async (req, res, next) => {
    const user = await User.findOne({email: req.body.email})

    if(!user){
        return next(new ErrorHandler('User not found with this email', 404))
    }

    //Get reset token 
    const resetToken = user.getResetPasswordToken()

    await user.save({validateBeforeSave: false})

    //create reset password url
    //const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`

    const message = `Your password reset token is as follow :\n\n${resetUrl}\n\n if you have not requested this email, then ignore it`

    try {

        await sendEmail({
            email: user.email,
            subject: 'Ecommerce password recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to : ${user.email}`
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined; 
        user.resetPasswordExpire = undefined

        await user.save({validateBeforeSave: false})

        return next(new ErrorHandler(error.message, 500)) // 500 = Internal server error
    }
})

//Reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors (async (req, res, next) => {
    //Hash url token 
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt: Date.now()}
    })

    if(!user){
        return next(new ErrorHandler('Password reset token in invalied or has been expired', 400))
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    //Setup new password
    user.password = req.body.password

    user.resetPasswordToken = undefined; 
    user.resetPasswordExpire = undefined;

    await user.save()

    sendToken(user, 200, res)
})

//Get currently logged in user => /api/v1/me
exports.getUserProfile = catchAsyncErrors (async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })
})

//Update / Change password => /api/v1/password/update
exports.UpdatePassword = catchAsyncErrors (async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password')
    
    //Check previous user password 
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if(!isMatched){
        return next(new ErrorHandler('Old password is incorrect'))
    }
    user.password = req.body.password
    await user.save()

    sendToken(user, 200, res)
})

//Update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors (async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,

    }

    //Update avatar 

    if(req.body.avatar !== ''){
        const user = await User.findById(req.user.id)

        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id)

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        })

        newUserData.avatar = {
            public_id: result.public_id, 
            url: result.secure_url
        }
    
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true, 
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
    })
})

//admin route
//get all users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors (async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        success: true,
        users
    })
})

//Get user details => /api/v1/user/:id
exports.getUserDetails = catchAsyncErrors (async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User does not found with that id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})

//Update user profile => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors (async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

//Delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors (async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    //remove picture todo

    await user.remove()

    res.status(200).json({
        success: true
    })
})