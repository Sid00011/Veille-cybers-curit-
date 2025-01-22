import React from 'react'
import { useState } from 'react'
import {toast} from 'react-hot-toast'
import { useContextauth } from './useContextauth'
function useProduct() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { dispatch } = useContextauth()
  const CreateProduct = async (name, description, price, category, image) => {
    try{
      // console.log("this is my image", image)
      setError(null)
      const response = await fetch('http://localhost:4000/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('data')).token}`,
        },
        body: JSON.stringify({name , description , price, category , image}),
      })
  
      const data = await response.json()
      console.log("this is my created data", data)
      if (!response.ok) {
        setLoading(false)
        setError(data.error)
        throw Error(data.error)
    }
    if(response.ok){
      setLoading(false)
      setError(null)
      dispatch({type: 'ADD_PRODUCT', payload: data.product})
    }
    }catch(error){
    toast.error(error)
    console.log(error)
    }
   
}

const getAllProducts = async () => {
  const response = await fetch('http://localhost:4000/getAllProducts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('data')).token}`,
    },
  })
  const data = await response.json()
  console.log("this is data", data)
  if (!response.ok) {
    setLoading(false)
    setError(data.error)
    throw Error(data.error)
  }
  if(response.ok){
    setLoading(false)
    setError(null)
    dispatch({type : 'GET_PRODUCTS' , payload : data})
  }
}

const toggleFeaturedProduct = async (productId) => {
  try{
    const response = await fetch(`http://localhost:4000/toggleFeaturedProduct`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('data')).token}`,
      },
      body: JSON.stringify({productId}),
    })
    const data = await response.json()
    dispatch({type:'UPDATE_PRODUCT', payload : data})
  }catch(error){
    toast.error(error.message)
  }
}
const deleteProduct = async (productId) => {
try{
  const response = await fetch('http://localhost:4000/deleteProduct', {
    method: 'DELETE',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('data')).token}`,
    },
    body: JSON.stringify({productId}),
  })

  const data = await response.json()
  // console.log("this is my data", data)
  if(response.ok){
    setLoading(false)
    setError(null)
    dispatch({type : 'DELETE_PRODUCT' , payload : data._id})
  }
  if(!response.ok){
    setError(data.error)
    throw Error(data.error)
  }
}catch(error){
  toast.error(error.message)
  console.log(error)
}
}

const getCategory = async (category) => {
  try{
    setLoading(true)
    const response = await fetch(`http://localhost:4000/getCategoryProducts/${category}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('data')).token}`,
      },
    })
    const data = await response.json()
    console.log("this is my data", data)
    if (!response.ok){
      setLoading(false)
      setError(data.error)
      throw Error(data.error)
    }
    if(response.ok){
      setError(null)
      setLoading(false)
      dispatch({type : 'GET_PRODUCTS' , payload : data})
    }
  }catch(error){
      toast.error(error)
  }
}

  return {
    CreateProduct,
    getAllProducts,
    toggleFeaturedProduct,
    deleteProduct,
    getCategory,
    error,
    loading
  }
}

export default useProduct