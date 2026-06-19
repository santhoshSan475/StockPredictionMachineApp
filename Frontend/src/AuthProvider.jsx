import {useState,useContext,createContext} from 'react'

const AuthContext = createContext()
const AuthProvider = ({children}) => {
    const [isLoggedIn,setIsLoggedIn] = useState(
        !!localStorage.getItem('accessToken')
    )
  return (
    <>
      <AuthContext.Provider value={{isLoggedIn,setIsLoggedIn}}>
        {children}
      </AuthContext.Provider>
    </>
  )
}

export {AuthContext}
export default AuthProvider
