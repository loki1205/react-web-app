import React from 'react'
import { NavLink } from 'react-router-dom'
const Error = () => {

    return (
      <div className="FourOhFour">
        <div className="code">Oops!</div>
        <div className='text'>404 : Page Not Found</div>
        <NavLink to="/">Go to Home</NavLink>
      </div>
    )
}

export default Error