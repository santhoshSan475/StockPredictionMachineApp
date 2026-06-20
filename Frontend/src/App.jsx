import { useState } from 'react'
import './assets/css/Style.css'
import Main from './component/Main'
import Footer from './component/Footer'
import Header from './component/Header'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Register from './component/Register'
import Login from './component/Login'
import AuthProvider from './AuthProvider'
import Dashboard from './component/Dashboard'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
function App() {

  return (
    <>
    <AuthProvider>
    <BrowserRouter>
    <Header />
    <Routes >
        <Route path='/' element={<Main />} />
        <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
        <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    </Routes>
    <Footer />
    </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App
