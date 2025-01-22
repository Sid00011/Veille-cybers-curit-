import { useContextauth } from './useContextauth'
import { useEffect, useState } from 'react'
export function useLogin() {
    const [loading , setLoading] = useState(false)
    const [error , setError] = useState(null)
    const { dispatch, user } = useContextauth()
    const Login = async ( email , password) => {
    setLoading(true)
    setError(null)  
        const response = await fetch('http://localhost:8000/api/signin/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();


        if(response.ok){
            localStorage.setItem('data' , JSON.stringify(data))
            setLoading(false)
            setError(null)
            dispatch({type : 'LOGIN' , payload : data})
            console.log("this is my data", data)
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
        Login, loading , error
    }
  )
}
export default useLogin