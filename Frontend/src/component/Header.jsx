import {useContext} from 'react'
import Button from './Button'
import { AuthContext } from '../AuthProvider'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setIsLoggedIn(false)
    navigate('/login')
  }
  return (
    <>
      <nav className='navbar container pt-3 pb-3 align-items-start'>
        <a className='navbar-brand text-light' href="#">Stock Prediction Portal</a>
        <div>
         {
          isLoggedIn ? 
          (
            <button className='btn btn-danger' onClick={handleLogout} >Logout</button>
          )
          :
          (
            <>
              <Button text="Login" class='btn-outline-info' url='/login' />
              &nbsp;
              <Button text="Register" class='btn-info' url='/register' /> 
            </>
          )
         }
        </div>
       </nav>
    </>
  )
}

export default Header