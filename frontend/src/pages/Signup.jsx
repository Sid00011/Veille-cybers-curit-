import React from 'react'
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import {Link} from 'react-router-dom'
import { useState } from 'react';
import { useSignup } from '../hooks/useSignup'
import toast from 'react-hot-toast'
function Signup() {
  const {Signup , loading , error} = useSignup()
  const handleSignup = async (e) => {
    e.preventDefault()
    try{
      // if(info.username === '' || info.email === '' || info.password === '') {
      //   return
      // }
      // toast.error("Something went wrong")
      await Signup(info.username , info.email , info.password)
      setInfo({username : '' , email : '' , password : ''})
    }catch(error){
      console.log("here is the errorr" , error)
      toast.error(error.message)
    }
  }
  const [info , setInfo] = useState({username : '' , email : '' , password : ''})
  return (
    <div className='w-screen h-screen flex justify-center items-center overflow-hidden flex-col'>
          <h1 className='text-2xl font-bold text-white-400'>Créez Votre Compte</h1>
          <div className='p-2'></div>
 <div className='flex flex-col items-center justify-center overflow-hidden p-8 space-y-2 w-full sm:w-1/2 lg:w-1/4 bg-gray-800 rounded-lg'>


<form action="" onSubmit={handleSignup}>
<div className='w-full'>
          <label className='block text-slate-300 mb-1' htmlFor='username'>Nom d'utilisateur</label>
          <div className='input input-bordered flex items-center gap-2 bg-emerald-700 w-full'>
            <CiUser className='h-4 w-4 opacity-70' />
            <input id='username' type='text' className='grow bg-transparent text-white placeholder-gray-400' placeholder='Nom utilisateur'
            onChange={(e) => setInfo({...info , username : e.target.value})}
            value={info.username}
            />
          </div>
        </div>

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
   onChange={(e) => setInfo({...info , password : e.target.value})}
   value={info.password}
  />
</div>
</div>
<div className='p-1'></div>
<button className='btn w-full bg-gray-600 text-white'>
S'inscrire
</button>
</form>
    </div>
    <div className='p-1'></div>
   <Link to="/signin" className='text-sm opacity-60 hover:opacity-100 transation duration-300 ease-in-out'><span>Vous avez déjà un compte ?</span></Link>
    </div>
  )
}

export default Signup