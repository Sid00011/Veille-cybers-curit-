import  Addproduct  from '../components/Addproduct';
import Products  from '../components/Products';
import { LuShoppingBasket } from "react-icons/lu";
import { IoAdd } from "react-icons/io5";
import { IoAnalytics } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';



function Dashboard() {
  const [active , setActive] = useState("create")
  return (
    <div className='py-1  w-full max-w-6xl mx-auto overflow-hidden group relative '>
        <motion.div
        className='text-center text-emerald-400 font-bold text-3xl'
        initial={{opacity : 0 , y : -20}}
        animate={{opacity: 1 , y: 0}}
        transition={{duration : 0.5}}
        >
        Admin Dashboard
       </motion.div>
        
        <div className='flex gap-4 justify-center my-4 '>
            <button className= {`cursor-pointer p-1 rounded-lg flex items-center transition-colors duration-300 ${active === "create" ? "bg-emerald-400" : "bg-gray-700"}`} onClick={() => setActive("create")}>
                <IoAdd className='text-xl' />
                <span className='text-lg'>Add Product</span>
            </button>
            <button className={`cursor-pointer p-1 rounded-lg flex items-center transition-colors duration-300 ${active === "products" ? "bg-emerald-400" : "bg-gray-700"}`} onClick={() => setActive("products")}>
                <LuShoppingBasket className='text-xl' />
                <span className='text-lg'>Products</span>
            </button>
            <button className={`cursor-pointer p-1 rounded-lg flex items-center transition-colors duration-300 ${active === "analytics" ? "bg-emerald-400" : "bg-gray-700"}`} onClick={() => setActive("analytics")}>
                <IoAnalytics className='text-xl' />
                <span className='text-lg'>Analytics</span>
            </button>
        </div>

        {active === "create" && <Addproduct />}
        {active === "products" && <Products />}
        {/* {active === "analytics" && <Analytics />} */}
    </div>
  )
}

export default Dashboard