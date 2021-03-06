import React from 'react'
import {Link} from 'react-router-dom'

import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'

import {useAlert} from 'react-alert'

import {useDispatch, useSelector} from 'react-redux'
import {addItemToCart, removeItemFromCart} from '../../actions/cartActions'
import { Fragment } from 'react'


const Cart = ({history}) => {

    const dispatch = useDispatch()
    const {cartItems} = useSelector(state => state.cart)

    const removeItemFromCartHanlder = (id) => {
        dispatch(removeItemFromCart(id))
    }

    const increaseQty = (id, qty, stock) => {
        const newQty = qty + 1;

        if(newQty > stock) return;

        dispatch(addItemToCart(id, newQty))
    }

    const decreaseQty = (id, qty) => {

        const newQty = qty - 1;

        if(newQty <= 0) return;

        dispatch(addItemToCart(id, newQty))
    }

    const checkoutHandler = () => {
        history.push('./login?redirect=shipping')
    }

    return (
        <Fragment>
             <MetaData title={'Your Card'} />
            {cartItems.length === 0 ? <h2 classNameName="mt-5">Your Cart is empty</h2> : (
                <Fragment>
                   <h2 className="mt-5">Your Cart: <b>{cartItems.length} items</b></h2>
        
        <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8">
                {cartItems.map(item => (
                    <Fragment>
                        <hr />

                        <div className="cart-item" key={item.product}>
                    <div className="row">
                        <div className="col-4 col-lg-3">
                            <img src={item.image} alt="Laptop" height="90" width="115" />
                        </div>

                        <div className="col-5 col-lg-3">
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </div>


                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                            <p id="card_item_price">{item.price}</p>
                        </div>

                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                            <div className="stockCounter d-inline">
                                <span className="btn btn-danger minus" onClick={ () => decreaseQty(item.product, item.qty)}>-</span>
                                <input type="number" className="form-control count d-inline" value={item.qty} readOnly />

								<span className="btn btn-primary plus" onClick = {() => increaseQty(item.product, item.qty, item.stock)}>+</span>
                            </div>
                        </div>

                        <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                            <i id="delete_cart_item" className="fa fa-trash btn btn-danger" onClick={()=> removeItemFromCartHanlder(item.product)}></i>
                        </div>

                    </div>
                </div>

                    </Fragment>
                ))}
                
                <hr />
            </div>

            <div className="col-12 col-lg-3 my-4">
                <div id="order_summary">
                    <h4>Order Summary</h4>
                    <hr />
                    <p>Subtotal:  <span className="order-summary-values"> {cartItems.reduce((acc, item) => acc + (Number(item.qty)), 0)} (Units)</span></p>
                    <p>Est. total: <span className="order-summary-values">{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span></p>
    
                    <hr />
                    <button id="checkout_btn" className="btn btn-primary btn-block" onClick={checkoutHandler}>Check out</button>
                </div>
            </div>
        </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Cart
