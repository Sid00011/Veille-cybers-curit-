import React from 'react'
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import {Link} from 'react-router-dom'
import toast from 'react-hot-toast';
import useLogin  from '../hooks/useSignin'
import { useState } from 'react';
import { useContextauth } from '../hooks/useContextauth';
function Signin() {
  const { user } = useContextauth()
  const {Login , loading , error} = useLogin()
  const handleLogin = async (e) => {
    e.preventDefault()
    try{
      await Login(info.email, info.password)
      console.log("success")
      console.log(user)
    }catch(error){
      console.log(error)
      toast.error(error.message)
    }finally{
      setInfo({email : '' , password : ''})
    }
  }
  const [info , setInfo] = useState({email : '' , password : ''})
  return (
    <div className='w-screen h-screen flex justify-center items-center overflow-hidden flex-col'>
          <h1 className='text-2xl font-bold text-white-400'>Se Connecter</h1>
          <div className='p-2'></div>
 <div className='flex flex-col items-center justify-center overflow-hidden p-8 space-y-2 w-full sm:w-1/2 lg:w-1/4 bg-gray-800 rounded-lg'>


<form action="" onSubmit={handleLogin}>
<div className='w-full'>
  <label className='block text-slate-300 mb-1' htmlFor='email'>Email</label>
<div className="input input-bordered flex items-center gap-2 bg-emerald-700 w-full">
    <MdOutlineMailOutline className="h-4 w-4 opacity-70" />
  <input type="email" className="grow" placeholder="Email" 
  onChange={(e) => setInfo({...info , email : e.target.value})}
  value={info.email}
  />
  
</div>
</div>

<div className='w-full'>
  <label htmlFor="password " className="block text-slate-300 mb-1">Mot de passe</label>
<div className='input input-bordered flex items-center gap-2 bg-emerald-700 w-full'>
  <RiLockPasswordLine className='h-4 w-4 opacity-70' />
  <input type="password" className="grow" placeholder="Mot de passe" 
  onChange={(e) => setInfo({...info, password: e.target.value})}
  value={info.password}
  />
</div>
</div>
<div className='p-1'></div>
<button className='btn w-full bg-gray-600 text-white'>
Se connecter
</button>
</form>


    </div>
    <div className='p-1'></div>
   <Link to="/signup" className='text-sm opacity-60 hover:opacity-100 transation duration-300 ease-in-out'><span>Vous n'avez pas de compte ?</span></Link>
    </div>
  )
}

export default Signin