import axios from 'axios'
import {useState,useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../AuthProvider'


const Login = () => {
    const [username,setUserName] = useState('')
    const [password,setPassword] = useState('')
    const [errors, setErrors] = useState('')
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        const userData = {username,password} 
        
        try{
          const response = await axios.post('http://127.0.0.1:8000/api/v1/token/',userData)
          localStorage.setItem('accessToken',response.data.access) 
          localStorage.setItem('refreshToken',response.data.refresh) 
          navigate('/')
          setIsLoggedIn(true)
        }
        catch(err){
          setErrors("invalid credentials")
        }
        finally{
          setLoading(false)
        }
    } 
   
  return (
    <>
      <div className='container'>
         <div className='row justify-content-center'>
          <div className='col-md-6 bg-light-dark p-5 rounded'>
             <h3 className='text-light text-center mb-4'>Login to Our Portal</h3>
             <form onSubmit={handleLogin}>
              <div className='mb-3'>
                <input type='text' value={username} className='form-control' placeholder='Enter your username' onChange={(e) => {setUserName(e.target.value)}} />
              </div>
              <div className='mb-3'>
                <input type='password' value={password} className='form-control' placeholder='Enter your password' onChange={(e) => {setPassword(e.target.value)}} />
              </div >
                {
                  loading ? 
                  (
                    <button type='submit' className='btn btn-info d-block mx-auto disabled' >Logging In...</button>
                  )
                  :
                  (
                    <button type='submit' className='btn btn-info d-block mx-auto' >Login</button>
                  )
                }
             </form>
          </div>
         </div>
      </div>
    </>
  )
}

export default Login