import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { IoAdd } from 'react-icons/io5'
import useProduct from '../hooks/useProduct'
import { toast } from 'react-hot-toast'
import { useContextauth } from '../hooks/useContextauth'
function cart() {

    const {getAllProducts, CreateProduct , error , loading} = useProduct()
    const {products, dispatch} = useContextauth()
    const convertImage = (e) => {
      e.preventDefault()
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setInfo({...info , image : reader.result})
      }
      // console.log("my image", info.image)
      // console.log("my result " , reader.result)
    }
    const handleCreate = async (e) => {
    e.preventDefault()
    if(info.category)
      info.category = info.category.charAt(0).toUpperCase() + info.category.slice(1)
      // console.log(info)
      // console.log(JSON.parse(localStorage.getItem('data')).token)
      await CreateProduct(info.name , info.description , info.price , info.category , info.image)
      setInfo({name: '' , description: '' , price : '' , category : '' , image : null })
      // toast.error(error.message)
  
  }
  const categories = ['Jeans' , 'Shoes' , 'Shirts' , 'Watches' , 'Glasses' , 'Hats' , 'Rings' , 'Pants']
  const [info , setInfo] = useState({name: '', description: '' , price : '' , category : '',  image : '' })
  useEffect(() => {
    getAllProducts()
  }, [])
  return (
    <motion.div
    className='max-w-lg mx-auto p-4 rounded-xl bg-gray-800 border border-gray-900 my-4'
    initial={{opacity : 0 , y : -20}}
    animate={{opacity: 1 , y: 0}}
    transition={{duration : 0.5}}
    >
    <div className='text-xl font-bold text-emerald-400 mb-3'>Envoyer un message</div>
    <form action="" onSubmit={handleCreate}>
<div className='w-full'>
  <label className='block text-slate-300 mb-1' htmlFor='email'>L'objectife</label>
<div className="input input-bordered flex items-center gap-2 bg-gray-700 w-full">
    {/* <MdOutlineMailOutline className="h-4 w-4 opacity-70" /> */}
  <input type="text" className="grow" placeholder="L'objectife" required
  value={info.name}
  onChange={(e) => setInfo({...info , name : e.target.value})}
  /> 
</div>
</div>
<label className='block text-slate-300 mb-1 mt-3' htmlFor='email'>Description</label>
<textarea className="textarea w-full bg-gray-700 " placeholder="Description"
value={info.description}
onChange={(e) => setInfo({...info , description : e.target.value})}
></textarea>


{/* <div className='w-full'>
  <label className='block text-slate-300 mb-1' htmlFor='email'>Price</label>
<div className="input input-bordered flex items-center gap-2 bg-gray-700 w-full">
    {/* <MdOutlineMailOutline className="h-4 w-4 opacity-70" /> */}
  {/* <input type="Number" className="grow" min={0}  required */}
  {/* // value={info.price} */}
  {/* onChange={(e) => setInfo({...info , price : e.target.value})} */}
  {/* />  */}
{/* </div> */}
{/* </div> */} 

  <label className='block text-slate-300 mb-1 mt-3' htmlFor='email'>niveau de risque</label>
    {/* <MdOutlineMailOutline className="h-4 w-4 opacity-70" /> */}
  <select name="category" id="" className='select select-bordered bg-gray-700 w-full' required
  value={info.category}
  onChange={(e) => setInfo({...info , category : e.target.value})}
  >
    <option value="" defaultValue={"Select a category"}>Select a category</option>
    <option value="Haut risque">Haut risque</option>
    <option value="Haut risque">Risque moyen</option>
    <option value="Haut risque">Faible risque</option>

  </select>


<div className='p-1'></div>
<button className='btn w-full bg-emerald-600 text-white hover:bg-emerald-800 transition-colors duration-200 ease-in-out'>
  <IoAdd className='text-2xl font-bold' />
  Envoyer
</button>
</form>

    </motion.div>
  )
}

export default cart