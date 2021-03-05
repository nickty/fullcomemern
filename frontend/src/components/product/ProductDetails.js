import React, {useEffect, useState, Fragment} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {getProductsDetails, clearErrors} from '../../actions/productActions'
import {useAlert} from 'react-alert'
import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
import {Carousel} from 'react-bootstrap'

import {addItemToCart} from '../../actions/cartActions'

const ProductDetails = ({match}) => {

    const [qty, setQty] = useState(1)

    const dispatch = useDispatch()
    const alert = useAlert()

    const {loading, error, product} = useSelector(state=>state.productDetails)
    const {user} = useSelector(state => state.user)

    useEffect(()=>{

        dispatch(getProductsDetails(match.params.id))

        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }

    }, [dispatch, alert, error, match.params.id])

    const addToCart = () => {
        dispatch(addItemToCart(match.params.id, qty))
        alert.success('Item Added To Cart')

    }

    const increaseQty = () => {
        const count = document.querySelector('.count')

        if(count.valueAsNumber >= product.stock) return;

        const qty = count.valueAsNumber + 1; 
        setQty(qty)
    }

    const decreaseQty = () => {

        const count = document.querySelector('.count')

        if(count.valueAsNumber <= 1) return;

        const qty = count.valueAsNumber - 1; 
        setQty(qty)
    }

    return (
        <Fragment>
            <MetaData title={product.name} />
        {loading ? <Loader /> : (
            <Fragment>

<div className="row f-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
                <Carousel pause="hover">
                    {product.images && product.images.map(image => (
                        <Carousel.Item key={image.public_id}>
                            <img className="d-block w-100" src={image.url} alt={product.name} />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>

            <div className="col-12 col-lg-5 mt-5">
                <h3>{product.name}</h3>
                <p id="product_id">Product # {product._id}</p>

                <hr />

                <div className="rating-outer">
                <div className="rating-inner" style={{with: `${(product.rating / 5) *100}%`}}></div>
                </div>
                <span id="no_of_reviews">({product.numberOfReviews} Reviews)</span>

                <hr />

                <p id="product_price">${product.price}</p>
                <div className="stockCounter d-inline">
                    <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>

                    <input type="number" className="form-control count d-inline" value={qty} readOnly />

                    <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                </div>
                 <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" disabled={product.stock === 0} onClick={addToCart}>Add to Cart</button>

                <hr />

                <p>Status: <span id="stock_status" className={product.stock > 0 ? 'greenColor' : 'redColor'}>{product.stock > 0 ? 'In Stock' : 'Out Of Stock'}</span></p>

                <hr />

                <h4 className="mt-2">Description:</h4>
                <p>{product.description}</p>
                <hr />
                <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
				
                {user ? <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
                            Submit Your Review
                </button> : <div className="alert alert-danger mt-5" type="alert">Login to post your review</div> 
                }
				
				
				<div className="row mt-2 mb-5">
                    <div className="rating w-50">

                        <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">

                                        <ul className="stars" >
                                            <li className="star"><i className="fa fa-star"></i></li>
                                            <li className="star"><i className="fa fa-star"></i></li>
                                            <li className="star"><i className="fa fa-star"></i></li>
                                            <li className="star"><i className="fa fa-star"></i></li>
                                            <li className="star"><i className="fa fa-star"></i></li>
                                        </ul>

                                        <textarea name="review" id="review" className="form-control mt-3">

                                        </textarea>

                                        <button className="btn my-3 float-right review-btn px-4 text-white" data-dismiss="modal" aria-label="Close">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
						
            </div>

        </div>
        </div>

            </Fragment>
        )}
        </Fragment>
        
    )
}

export default ProductDetails
