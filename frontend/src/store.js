import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import {productsReducer, productDetailsReducer, newReviewReducer, newProductReducer, productReducer} from './reducers/productReducers'
import {userReducer, updateReducer, forgotPasswordReducer, allUsersReducer, userDetailsReducer} from './reducers/userReducers'
import {cartReducer} from './reducers/cartReducers'
import { newOrderReducer, myOrderReducer, orderDetailsReducer, allOrdersReducer, orderReducer} from './reducers/orderReducers'

const reducer = combineReducers({
    products : productsReducer, 
    productDetails : productDetailsReducer, 
    auth: userReducer, 
    user: updateReducer, 
    forgotPasswordReducer: forgotPasswordReducer, 
    cart: cartReducer, 
    newOrder: newOrderReducer,
    myOrders: myOrderReducer,
    orderDetails: orderDetailsReducer, 
    newReview : newReviewReducer,
    newProduct : newProductReducer,
    product: productReducer,
    allOrders: allOrdersReducer,
    order: orderReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer
})

let initialState = {
    cart: {
        cartItems : localStorage.getItem('cartItems') 
            ? JSON.parse(localStorage.getItem('cartItems')) : [],
        shippingInfo: localStorage.getItem('shippingInfo')
            ? JSON.parse(localStorage.getItem('shippingInfo')) : {}
    }
}

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store 