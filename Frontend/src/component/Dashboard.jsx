import React,{useEffect,useState} from 'react'
import axiosInstance from '../axiosInstance'

const Dashboard = () => {
  const [ticker,setTicker] = useState('')
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')
  const [plot,setPlot] = useState()
  const [ma100,setMa100] = useState()
  const [ma200,setMa200] = useState()
  const [mainPrediction,setMainPrediction] = useState()
  const [mse,setMse] = useState()
  const [rmse,setRmse] = useState()
  const [r2,setR2] = useState()



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


  const handleSubmit =  async (e) => {
    e.preventDefault();
    setLoading(true)
    try{
       const response = await axiosInstance.post('/predict/',{
        ticker : ticker
       })
       console.log(response.data)
       if(response.data.error){
        setError(response.data.error)
       }

       const baseRoot = import.meta.env.VITE_BACKEND_BASE
       const imgUrl = `${baseRoot}${response.data.plot_img}`
       const dma100 = `${baseRoot}${response.data.plot_100ma_img}`
       const dma200 = `${baseRoot}${response.data.plot_200ma_img}`
       const prediction = `${baseRoot}${response.data.plot_final_prediction_img}`
       setPlot(imgUrl) 
       setMa100(dma100)  
       setMa200(dma200)
       setMainPrediction(prediction)
       setMse(response.data.mse)
       setRmse(response.data.rmse)
       setR2(response.data.r2)
    }
    catch(error){
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6 mx-auto'>
           <form onSubmit={handleSubmit} >
            <input type="text" className='form-control' value={ticker} placeholder='Enter your stock ticker' onChange={(e) => {setTicker(e.target.value)}} required />
            <small> {error && <span className='text-warning'>{error}</span> }</small>
            <button className='btn btn-info mt-3'>
              { loading ? <span >please wait</span>  : "See Prediction" }
            </button>
           </form>
        </div>
        {mainPrediction && (
          
        <div className='prediction mt-5'>
           <div className='p-3'>
              {
                plot && ( <img src={plot} width='100%' /> )
              }
           </div>
           <div className='p-3'>
              {
                ma100 && ( <img src={ma100} width='100%' /> )
              }
           </div>
           <div className='p-3'>
              {
                ma200 && ( <img src={ma200} width='100%' /> )
              }
           </div>
           <div className='p-3'>
              {
                mainPrediction && ( <img src={mainPrediction} width='100%' /> )
              }
           </div>
           <div className="text-light p-3">
              <h4>Model Evaluation</h4>
              <p>Mean Squared Error (MSE): {mse}</p>
              <p>Root Mean Squared Error (MSE): {rmse}</p>
              <p>R-Squared : {r2}</p>
           </div>
        </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard