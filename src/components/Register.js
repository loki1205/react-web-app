import React, { useState } from 'react'
import background from '../assets/images/screen-1.jpg'
import logo from '../assets/images/logo.png'
import { Input,Button,message } from 'antd';
import {useNavigate,NavLink} from 'react-router-dom'
const Register = () => {
  const navigate = useNavigate();
  const [first_name,setFirstName] = useState('');
  const [last_name,setLastName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [password_confirmation,setConfirmPassword] = useState('');
  const handleSubmit = async () => {
    let newUser = {first_name,last_name,email,password,password_confirmation}
    let result = await fetch ("https://react-assignment-api.mallow-tech.com/api/register",{
        method:'POST',
        body:JSON.stringify(newUser),
        headers:{
            "Content-Type":'application/json',
            "Accept":'application/json'
        }
    })
    if (result.ok)
    {
        message.success("Registration Successfull!!")
        result = await result.json()
        localStorage.setItem("user-info",JSON.stringify(result))
        navigate("/login")
    }
    else
    {
        result = await result.json()
        if (result.errors.first_name)
        {
          message.error(result.errors.first_name)
        }
        else if (result.errors.last_name)
        {
          message.error(result.errors.last_name)
        }
        else if (result.errors.email)
        {
          message.error(result.errors.email)
        }
        else if (result.errors.password)
        {
          message.error(result.errors.password)
        }
    }
  }
  return (
    <>
        <div className='register-container'>
            <div className='first-half'>
              <img className='register-logo' src={logo} alt=''/>
              <div className='register-form-container'>
                <form>
                  <div className='signup-name-container'>
                    <div className='fistname-container-signup'>
                        <label className='registerFormLabel' for="firstName">First Name</label>
                        <Input onChange={(e) => setFirstName(e.target.value)} className='registerFormInput' id="firstName" placeholder="First Name" />
                    </div>
                    <div className='lastname-container-signup'>
                        <label className='registerFormLabel' for="lastName">Last Name</label>
                        <Input onChange={(e) => setLastName(e.target.value)} className='registerFormInput' id="lastName" placeholder="Last Name" />
                    </div>
                  </div>
                  <label className='registerFormLabel' for="email">Email</label>
                  <Input onChange={(e) => setEmail(e.target.value)} className='registerFormInput' id="email" placeholder="Email" />
                  <label className='registerFormLabel' for="password">Password</label>
                  <Input onChange={(e) => setPassword(e.target.value)} type='password' className='registerFormInput' id="password" placeholder="Password" />
                  <label className='registerFormLabel' for="confirmPassword">Confirm password</label>
                  <Input onChange={(e) => setConfirmPassword(e.target.value)} type='password' className='registerFormInput' id="confirmPassword" placeholder="Confirm Password" />
                  <Button onClick={handleSubmit} className='registerButton' type='primary'>Sign Up</Button>
                </form>
              </div>
              <div className='register-footer-text-container'>
                <p className='register-footer-text'>Already have an account? <NavLink to="/login"><span className='sign-up-text'>Signin</span></NavLink></p>
              </div>
            </div>
            <div className='second-half'>
                <img className='register-background-image' src={background} alt=''/>
            </div>
        </div>
    </>
  )
}

export default Register