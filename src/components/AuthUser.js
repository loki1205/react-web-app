import axios from 'axios'
import { useState } from 'react'

export default function AuthUser(){
    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString)
        return userToken
    }
    const getUser = () => {
        const userString = sessionStorage.getItem('user');
        const user_detail = JSON.parse(userString)
        return user_detail
    }
    const [token,setToken] = useState(getToken())
    const [user,setUser] = useState(getUser())
    const saveToken = (user,token) => {
        sessionStorage.setItem('token',JSON.stringify(token))
        sessionStorage.setItem('user',JSON.stringify(user))
        setToken(token)
        setUser(user)
    }
    const http = axios.create({
        baseURL:"https://react-assignment-api.mallow-tech.com/api",
        headers:{
            "Content-Type":"application/json",
        }
    })
    return{
        http,
        setToken:saveToken,
        user,
        getToken,
        token
    }
}