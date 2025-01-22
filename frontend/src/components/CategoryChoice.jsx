import React, { useEffect } from 'react'
import useProduct from '../hooks/useProduct'
import { useParams } from 'react-router-dom'
import { useContextauth } from '../hooks/useContextauth'
import ProductCategory from './ProductCategory'
function CategoryChoice() {
  const {getCategory} = useProduct()
  const {category} = useParams()
  const {products} = useContextauth()
  console.log(category)
  console.log("my products", products)
  useEffect(() => {
    getCategory(category)
  }, [category])
  return (
    <div className='max-w-screen-2xl mx-auto'>
      <div className='text-center text-emerald-400 font-bold text-3xl my-8'>{category}</div>
<div className='grid grid-col-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center max-w-screen-xl'>
      {products?.length == 0 && (
        <div className='flex items-center justify-centerfont-bold mx-auto my-5 px-10 py-10 text-4xl text-white'> No Product found </div>
      )}
      
      {products?.map((product) => (
        <div className='w-full h-ful mx-auto px-10 overflow-hidden' key={product._id}><ProductCategory product={product} /></div>
      ))}
    </div>

    </div>
  )
}

export default CategoryChoice