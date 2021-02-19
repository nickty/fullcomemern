import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import {productsReducer, productDetailsReducer} from './reducers/productReducers'
import {userReducer, updateReducer} from './reducers/userReducers'

const reducer = combineReducers({
    products : productsReducer, 
    productDetails : productDetailsReducer, 
    user: userReducer, 
    update: updateReducer
})

let initialState = {}

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store 