import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import { AuthProvider } from './contexts/authContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
 <BrowserRouter>
   <StrictMode>
    <App />
  </StrictMode>
  </BrowserRouter>
  </AuthProvider>

)
