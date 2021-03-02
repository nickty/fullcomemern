import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import {productsReducer, productDetailsReducer} from './reducers/productReducers'
import {userReducer, updateReducer, forgotPasswordReducer} from './reducers/userReducers'
import {cartReducer} from './reducers/cartReducers'
import { newOrderReducer } from './reducers/orderReducers'

const reducer = combineReducers({
    products : productsReducer, 
    productDetails : productDetailsReducer, 
    user: userReducer, 
    update: updateReducer, 
    forgotPasswordReducer: forgotPasswordReducer, 
    cart: cartReducer, 
    newOrder: newOrderReducer
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