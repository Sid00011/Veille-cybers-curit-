import React from 'react'
import {Link} from 'react-router-dom'
import { CiShop } from "react-icons/ci";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import { IoIosLogOut } from "react-icons/io";
import { useContextauth } from '../hooks/useContextauth';
import { useLogout } from '../hooks/useLogout';
function Navbar() {
  const Logout = useLogout()
  const {user} = useContextauth()
  const isAdmin = 'Admin'
//   console.log("check" , isAdmin)
//   console.log("here is my user", user.user.Cartitems.length)
  const handleLogout = async (e) => {
    e.preventDefault()
    Logout()
  }
//   console.log("my cart container", cart?.length)
  return (
   <div className='sticky z-100 top-0 left-0 w-full bg-gray-900 h-12 px-5 flex justify-between items-center'>
        <div className='text-xl font-bold text-blue-300'>
            Veille managment 
        </div>
        <div className='text-base font-bold text-white flex gap-3 items-center'>
        <Link to='/' className='cursor-pointer'>Accueil</Link>
            {user ? (
                <>
            <Link to='/cart' className=' flex items-center gap-1  px-3 py-1 rounded-lg cursor-pointer relative bg-emerald-500'>
                <CiShop/>
                <span>messagerie</span>

                {/* { cart?.length > 0 && <span className=' absolute -top-4 left-3 rounded-full w-3 h-3 text-center translate-y-1/2 '>{ cart.length}</span>} */}
            </Link>

            {isAdmin === "Admin" && (
                <Link to='/dashboard' className='flex items-center gap-1 bg-emerald-500 px-3 py-1 rounded-lg text-white cursor-pointer'>
                <MdOutlineSpaceDashboard/>
                <span>Dashboard</span>
            </Link>
            )}
            <button className='flex items-center gap-1 px-3 py-1 rounded-lg text-white cursor-pointer ' onClick={handleLogout}>
           
                <IoIosLogOut/>
                <span>Logout </span>
    
            </button>

                </>
            ): (
                <>
                 <Link to='/signin' className='cursor-pointer'>Se connecter</Link>
                 <Link to='/signup' className='flex items-center gap-1 bg-emerald-500 px-3 py-1 rounded-lg text-white cursor-pointer'>
                <AiOutlineUserAdd/>
                <span>S'inscrire</span>
                </Link>
                </>
            )}
           
        </div>
   </div>
  )
}

export default Navbar