import React from 'react'
import { useContextauth } from './useContextauth'

export function useLogout() {
    const {dispatch} = useContextauth()
    const Logout = () => {
        console.log('boooooooooooooo')
        localStorage.removeItem('data')
        dispatch({type : 'LOGOUT'})
    }
  return (
    Logout
  )
}

export default useLogout