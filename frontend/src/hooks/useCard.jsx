import React from 'react'
import { useState } from 'react'
import {toast} from 'react-hot-toast'
import { useContextauth } from './useContextauth'

function useCard() {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const { dispatch, cart } = useContextauth()

    const addTocard = async (productId) => {
        try{
            setError(null)
            setLoading(true)
            const response = await fetch('http://localhost:4000/addcart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('data')).token}`
                },
                body: JSON.stringify({productId})
            })
            const data = await response.json()
            if(!response.ok){
                setLoading(false)
                setError(data.error)
                throw Error(data.error)
            }
            if(response.ok){
                setLoading(false)
                setError(null)
                console.log('this is my cart', cart)
                console.log('this is my data', data.quantity)
                // dispatch({type : 'ADD_TO_CARD' , payload : data})
                const existing = cart.find(item =>{
                    // console.log("lalallal", item._id)
                    // console.log("lalallal", productId)
                    return(
                        item._id == data._id
                    )
                    // item._id == productId
                })
                // console.log("i found it", existing)

                if(existing){
                    console.log(existing)
                    const updatedCart = cart.map(item =>
                        item._id === existing._id ? { ...item, quantity: existing.quantity + 1 } : item
                    )
                    dispatch({type: 'UPDATE_CART', payload: updatedCart})
                }else{
                    dispatch({type: 'ADD_TO_CART', payload: data})
                }

                    // console.log(item)
                    // console.log("seeing", item.quantity)
                    // console.log("if we have product", item._doc)
                    // if(item._doc._id == productId){
                // })
                // console.log("this is my cart", cart)
            }
        }catch(error){
            toast.error(error)
        }
    }
    const getCart = async () => {
        try{
            const response = await fetch('http://localhost:4000/getCarts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('data')).token}`
                }
            })
            const data = await response.json()
            console.log('this is my data', data)
            if(!response.ok){
                setLoading(false)
                setError(data.error)
                throw Error(data.error)
            }
            if(response.ok){
                setLoading(false)
                setError(null)
                dispatch({type : 'GET_CART' , payload : data})
            }
        }catch(error){
            toast.error(error)
        }
    }
  return {
    error,
    loading,
    addTocard,
    getCart
  }
}

export default useCard