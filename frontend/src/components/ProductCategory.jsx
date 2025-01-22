import React from 'react'
import { CiShop } from 'react-icons/ci';
import {toast} from 'react-hot-toast'
import useCard from '../hooks/useCard';
function ProductCategory({product}) {
    const {addTocard} = useCard()
    const handleshoping = async () => {
        await addTocard(product._id)
        toast.success(`${product.name} added to the cart`);
    }
  return (
    <div className=' flex flex-col w-full bg-gray-800 relative group rounded-lg overflow-hidden border border-gray-300 p-2'>
         <div className='overflow-hidden w-full mb-2 '>
            <img src={product.image} alt={product.name} className='h-60 rounded-xl overflow-hidden w-full object-cover hover:scale-110 transition-transform duration-300 ease-in-out ' /> 
        </div>
        <div className=''>
            <div className='text-gray-200 font-bold'>{product.name}</div>
        </div>
        <div className='mb-1'>
            <div className='text-green-500 font-bold text-2xl'>${product.price}</div>
        </div>
            <div>
            <button className='text-sm  bg-emerald-600 rounded-lg p-2 text-white font-bold' onClick={handleshoping}>Add To Cart <span><CiShop className='inline-block h-6 w-6' /></span></button>
            </div>
    </div>
  )
}

export default ProductCategory