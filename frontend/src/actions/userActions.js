import {LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL, CLEAR_ERRORS, REGISTER_USER_REQUEST, PRODUCT_DETAILS_SUCCESS, REGISTER_USER_FAIL, REGISTER_USER_SUCCESS} from '../constants/userConstants'
import axios from 'axios'

//Login
export const login = (email, password) => async (dispatch) => {
    try {

        dispatch({type:LOGIN_REQUEST})

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const {data} = await axios.post('/api/v1/login', {email, password}, config)

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user
        })
         
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.errMessage
        })
    }
}

//register user 
export const register = (userData) => async (dispatch) => {

    try {

        dispatch({type:REGISTER_USER_REQUEST})

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const {data} = await axios.post('/api/v1/register', {userData}, config)

        console.log(data)

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user
        })
         
    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.errMessage
        })
    }
}



//Clear Errors 
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}