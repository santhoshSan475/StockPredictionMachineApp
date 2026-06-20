import React,{useEffect} from 'react'
import axiosInstance from '../axiosInstance'

const Dashboard = () => {
  useEffect(()=>{
    const protectedApiRequest = async () =>{
      try{
        let response = await axiosInstance.get('/protect-view/')
      }
      catch(err){
        console.log(err)
      }
    }
    protectedApiRequest()
  },[])

  return (
    <div className='text-light'>Dashboard</div>
  )
}

export default Dashboard