import React,{useState} from 'react'
import axios from 'axios'

const Register = () => {
  const [username,setUserName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [success,setSuccss] = useState(false)
  const [loading,setLoading] = useState(false)

  const handleRegistration = async (e) => {
      e.preventDefault()
      setLoading(true);
      const userData = { username,email,password }      
      try{
        let response = await axios.post('http://127.0.0.1:8000/api/v1/register/',userData)
        setErrors({})
        setSuccss(true)

      }
      catch(err){
        setErrors(err.response.data)
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
             <h3 className='text-light text-center mb-4'>Create an Account</h3>
             <form onSubmit={handleRegistration}>
              <div className='mb-3'>
                <input type='text' value={username} className='form-control' placeholder='Enter your username' onChange={(e) => {setUserName(e.target.value)}} />
                {errors.username && <div className='text-warning' >{errors.username}</div> }
              </div>
              <div className='mb-3'>
                <input type='email' value={email} className='form-control' placeholder='Enter your email' onChange={(e) => {setEmail(e.target.value)}} />
                {errors.email && <div className='text-warning' >{errors.email}</div> }
              </div>
              <div className='mb-3'>
                <input type='password' value={password} className='form-control' placeholder='Enter your password' onChange={(e) => {setPassword(e.target.value)}} />
                {errors.password && <div className='text-warning' >{errors.password}</div> }
              </div >
                {success && <div className='alert alert-success'>Registration Successful</div> }
                {
                  loading ? 
                  (
                    <button type='submit' className='btn btn-info d-block mx-auto disabled' >Please Wait...</button>
                  )
                  :
                  (
                    <button type='submit' className='btn btn-info d-block mx-auto' >Register</button>
                  )
                }
             </form>
          </div>
         </div>
      </div>
    </>
  )
}

export default Register