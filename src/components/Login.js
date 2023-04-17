import React, { useState } from 'react'
import background from '../assets/images/screen-1.jpg'
import logo from '../assets/images/logo.png'
import { Input,Button,message } from 'antd';
import AuthUser from './AuthUser';
import {NavLink, useNavigate} from 'react-router-dom'
const Login = () => {
  const navigate = useNavigate();
  const {setToken} = AuthUser();
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const handleSubmit = async () => {
    let checkUser = {email,password}
    let result = await fetch ("https://react-assignment-api.mallow-tech.com/api/login",{
      method:'POST',
      headers: {
        "Content-Type":'application/json',
        "Accept":'application/json'
      },
      body:JSON.stringify(checkUser)
    })
    if (result.ok)
    {
      sessionStorage.clear();
      localStorage.clear();
      message.success("Login Successfull!!")
      const token = result.headers.get('Authorization')
      result = await result.json()
      setToken(result.email,token)
      localStorage.setItem("user-info",JSON.stringify(result))
      navigate("/posts")
    }
    else {
      result = await result.json()
      if (result.error)
      {
          message.error(result.error)
      }
      else if (result.errors.password)
      {
        message.error(result.errors.password)
      }
      else if (result.errors.email)
      {
        message.error(result.errors.email)
      }
  }
  }
  return (
    <>
        <div className='login-container'>
            <div className='first-half'>
              <img className='login-logo' src={logo} alt=''/>
              <div className='login-form-container'>
                <form>
                  <label className='loginFormLabel' for="email">Email</label>
                  <Input onChange={(e) => setEmail(e.target.value)} className='loginFormInput' id="email" placeholder="Email" />
                  <div className='password-label-container'>
                    <label className='loginFormLabel' for="password">Password</label>
                    <p className='forgotPasswordText'>Forgot Password?</p>
                  </div>
                  <Input onChange={(e) => setPassword(e.target.value)} type='password' className='loginFormInput' id="password" placeholder="Password" />
                  <Button onClick={handleSubmit} className='loginButton' type='primary'>Sign In</Button>
                </form>
              </div>
              <div className='login-footer-text-container'>
                <p className='login-footer-text'>Don't have an account? <NavLink to="/register"><span className='sign-up-text'>Signup</span></NavLink></p>
              </div>
            </div>
            <div className='second-half'>
                <img className='login-background-image' src={background} alt=''/>
            </div>
        </div>
    </>
  )
}

export default Login