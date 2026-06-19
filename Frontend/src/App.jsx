import { useState } from 'react'
import './assets/css/Style.css'
import Main from './component/Main'
import Footer from './component/Footer'
import Header from './component/Header'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Register from './component/Register'
import Login from './component/Login'
import AuthProvider from './AuthProvider'

function App() {

  return (
    <>
    <AuthProvider>
    <BrowserRouter>
    <Header />
    <Routes >
        <Route path='/' element={<Main />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
    </Routes>
    <Footer />
    </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App
