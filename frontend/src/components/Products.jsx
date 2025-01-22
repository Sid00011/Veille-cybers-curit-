import React from 'react'
import { useContextauth } from '../hooks/useContextauth'
import { FaRegStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {toast} from 'react-hot-toast'
import useProduct from '../hooks/useProduct';
function Products() {
  const {toggleFeaturedProduct, deleteProduct} = useProduct()
  const {products} = useContextauth()
  console.log("products" , products)

  const deleteProductHandler = async (productId) => {
    await deleteProduct(productId)
  }
  const handleFeatured = async (id) => {
     await toggleFeaturedProduct(id)
  }
  return (
    <div className='w-full min-h-screen overflow-hidden'>
        <table className='max-width-6xl mx-auto my-6 shadow-lg border border-gray-900 rounded-xl bg-gray-700 overflow-hidden'>
          <thead className=''>
            <tr className='bg-gray-600 '>
              <th className='py-4 px-8  text-gray-300 text-left'>
                  PRODUCT
              </th>
              <th className='py-4 px-6  text-gray-300 text-left'>
                  PRICE
              </th>
              <th className='py-4 px-6  text-gray-300 text-left'>
                  CATEGORY
              </th>
              <th className='py-4 px-6  text-gray-300 text-left'>
                  FEATURED
              </th>
              <th className='py-4 px-6  text-gray-300 text-left'>
                  ACTIONS
              </th>
           
            </tr>
          </thead>
          <tbody className='bg-gray-800'>
          {
            products?.map((product) => (
              <tr key={product._id} className='border-b border-gray-700 hover:bg-gray-700 transition-colors duration-300'>
                <td className='py-4 px-8 text-gray-300'>
                   <div className='flex items-center gap-2'>
                    <div className='h-10 w-10'>
                    <img src={product.image} className="h-10 w-10 object-cover rounded-full" alt={product.name} />
                    </div>
                    <div className='text-gray-300'>
                      {product.name}
                      {console.log(product.isFeatured)}
                    </div>
                   </div>
                </td>
                <td className='py-4 px-6 text-gray-300'>
                   {product.price}
                </td>
                <td className='py-4 px-6 text-gray-300'>
                   {product.category}
                </td>
                <td className={`py-4 px-6 text-gray-300 group`}>
                  <div className={`flex items-center justify-center h-10 w-10 p-1 ${product.isFeatured ? 'bg-amber-500' : 'bg-gray-500'} rounded-full  cursor-pointer hover:bg-amber-500 transition-colors duration-200`} onClick={(e) =>handleFeatured(product._id)}>
                  <FaRegStar className='h-10 w-10'/>
                  </div>
                </td>
                <td className='py-4 px-6 text-gray-300'>
                   <button className='font-bold py-2 px-4 ' onClick={() => deleteProductHandler(product._id)}>
                      <MdDelete className='h-8 w-8 text-red-500'/>
                   </button>
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
    </div>
  )
}

export default Products