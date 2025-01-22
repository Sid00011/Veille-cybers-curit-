import React from 'react'
import axios from 'axios'
import { useContextauth } from './useContextauth'
import { useState } from 'react'
export function useSignup() {
    const [loading , setLoading] = useState(false)
    const [error , setError] = useState(null)
    const { dispatch, user } = useContextauth()
    const Signup = async (username , email , password) => {
    setLoading(true)
    setError(null)
        // const response = await axios.post('http://localhost:4000/api/auth/signup' , {
        //     username , email , password
        // }, {
        //     headers : {
        //         'Content-Type' : 'application/json',
        //     }
        // })


        // console.log(username , email , password)    
        console.log(email , username , password)
        const response = await fetch('http://localhost:8000/api/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, password })
        });

        const data = await response.json();


        if(response.ok){
            localStorage.setItem('data' , JSON.stringify(data))
            setLoading(false)
            setError(null)
            dispatch({type : 'LOGIN' , payload : data})
        }

        if (!response.ok) {
            setLoading(false)
            setError(data.error)
            throw Error(data.error)
            // console.log("from useSignup", data.error)
            // console.log("from useSignup", data.error)
        }
    }

  return (
    {
        Signup, loading , error
    }
  )
}
export default useSignup