import React from 'react'
import { Link } from 'react-router-dom'
function CategorieItem({Vul}) {
  return (
    <div className='rounded-lg border border-gray-500 h-72 w-full bg-red-600 relative p-4 group overflow-hidden'>
      <Link to={`/categorie${Vul.href}`}>
        <div className='absolute inset-0 overflow-hidden'>
            <img src='v1.png' alt={Vul.name} className='w-full h-full object-cover rounded-lg hover:scale-110 transition-transform duration-300 ease-in-out ' />
        </div>
        <div className='flex flex-col z-10 absolute bottom-5 left-5'>
            <div className='text-white font-bold'>{Vul.name}</div>
            <button className='opacity-70 text-white text-sm'>Explore {Vul.name}</button>
        </div>
        </Link>
    </div>
  )
}

export default CategorieItem