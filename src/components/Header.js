import React, {useState}from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {default as logo} from '../assets/images/group-3.svg'
import avatar from '../assets/images/emotarBread.webp'
const Header = () => {
  const userInfo = JSON.parse(localStorage.getItem('user-info'));
  const fullName = userInfo.first_name + " " + userInfo.last_name
  const [showMenu, setShowMenu] = useState(false);
  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  }
  return (
    <>
    <nav className='navbar'>
        <div className='logo-section'>
            <img src={logo} alt="logo" className='logo-img'/>
        </div>
        <div className='links-section'>
            <NavLink  className={'link'} to="/profile">Profile</NavLink>
            <NavLink className={'link'} to="/dashboard">Dashboard</NavLink>
            <NavLink className={'link'} to="/posts">Posts</NavLink>
        </div>
        <div className='profile-info-section'>
            <p className='logo'>{fullName}</p>
            <img src={userInfo.profile_url ? userInfo.profile_url : avatar} alt="profile" className='profile-img'/>
        </div>
    </nav>
    <nav className='navbar-mobile'>
      <div className='mobile-menu'>
        <button onClick={handleMenuClick}>Menu</button>
        {showMenu && (
          <div className='mobile-menu-links'>
            <NavLink onClick={handleMenuClick} className={'link-mobile'} to="/profile">Profile</NavLink>
            <NavLink onClick={handleMenuClick} className={'link-mobile'} to="/dashboard">Dashboard</NavLink>
            <NavLink onClick={handleMenuClick} className={'link-mobile'} to="/posts">Posts</NavLink>
          </div>
        )}
      </div>
      <div className='profile-info-section'>
        <img src={userInfo.profile_url ? userInfo.profile_url : avatar} alt="profile" className='profile-img' />
      </div>
    </nav>
    <Outlet/>
    </>
  )
}

export default Header;