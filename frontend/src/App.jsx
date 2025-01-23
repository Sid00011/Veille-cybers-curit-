import {Routes , Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import { Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useContextauth } from './hooks/useContextauth'
import CategoryChoice from './components/CategoryChoice'
import Dashboard from './pages/Dashboard'
import { useEffect } from 'react'
import useCard from './hooks/useCard'
function App() {
  const {user} = useContextauth()
  return (
    <div className='min-h-screen bg-gray-800 text-white relative overflow-hidden '>
      <div className='absolute inset-0 overflow-hidden z-0'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
				</div>
			</div>
      <Toaster/>
      <div className='z-1000 relative w-full min-h-screen'>
      <Navbar/>
     <Routes>
      <Route path= '/' element= {user ? <Home/> : <Navigate to = '/signin'/>}/> 
      <Route path='/cart' element= {user ? <Cart /> : <Navigate to = '/signin'/>} />
      <Route path='/signin' element= {!user ? <Signin /> : <Navigate to = '/'/>} />
      <Route path='/signup' element= {!user ? <Signup /> : <Navigate to = '/'/>} />
      <Route path='/dashboard' element= {user ? <Dashboard /> : <Navigate to = '/signin'/>} />
      {/* <Route path='/vulnerability/:Vul' element= {<CategoryChoice/>} /> */}
      <Route path="/vulnerability/:Vul" element={<CategoryChoice />} />

     </Routes>
      </div>
    </div>
  )
}

export default App
