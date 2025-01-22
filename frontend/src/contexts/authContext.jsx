import { useEffect, useReducer } from "react"
import { createContext } from "react"
export const AuthContext = createContext()

export const Authreducer = (state , action) => {
    switch(action.type){
        case 'LOGIN':
            return {user : action.payload}
        case 'LOGOUT':
            return {user : null}
        case 'ADD_PRODUCT':
            return {
                ...state,
                products : [...state.products , action.payload]
            }
        case 'GET_PRODUCTS':
            return {
                ...state,
                products : action.payload
            }
        case 'DELETE_PRODUCT':
            return {
                ...state,
                products : state.products.filter((product) => product._id !== action.payload)
            }
        case 'UPDATE_PRODUCT':
            return {
                ...state,
                products : state.products.map((product) => product._id === action.payload._id ? action.payload : product)
            }
        case 'GET_CART': 
            return {
                ...state,
                cart : action.payload
            }
        case 'ADD_TO_CARD':
            return {
                ...state,
                cart : [...state.cart , action.payload]
            }
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cart : state.cart.filter((item) => item._id !== action.payload)
            }
        case 'UPDATE_CART':
            return {
                ...state,
                cart : action.payload
            }
        default:
            return state
    }
}
export const AuthProvider = ({ children }) => {
const [state , dispatch] = useReducer(Authreducer , {
    user : null,
    products : [],
    cart : [],
})
useEffect(() => {
    const user = JSON.parse(localStorage.getItem('data'))
    if(user){
        dispatch({type : 'LOGIN' , payload : user})
        console.log('gooooooooooooo', state.products)
    }
}, [])
    return (
        <AuthContext.Provider value={{...state , dispatch}}>{children}</AuthContext.Provider>
    )
}
