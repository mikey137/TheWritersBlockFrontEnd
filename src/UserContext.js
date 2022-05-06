import React,{useState, createContext, useEffect} from "react"
import axios from "axios"

export const UserContext = createContext()

export const UserProvider = props => {
    const [userInfo, setUserInfo] = useState({
        user_name: '',
        user_email: '',
        user_photo: '',
        user_cover_photo: '',
        user_id: ''
    })

    const getUserInfo = async () => {
        try{
            const config = {
                headers: {
                  "Content-Type": "application/json",
                  token: localStorage.token
                }
            }
            const response = await axios("http://localhost:5000/users/userinfo", config)
            
            setUserInfo(response.data)
        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        getUserInfo()
    },[props.isAuthenticated])

    return(
        <UserContext.Provider value = {[userInfo, setUserInfo]}>
            {props.children}
        </UserContext.Provider>
    )
}

