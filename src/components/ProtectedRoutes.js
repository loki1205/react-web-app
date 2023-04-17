import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useEffect,useState } from 'react';
const ProtectedRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = sessionStorage.getItem('token');
      const userToken = JSON.parse(token)
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch ("https://react-assignment-api.mallow-tech.com/api/validate-user",{
          method:'GET',
          headers: {
            "Content-Type":'application/json',
            "Accept":'application/json',
            "Authorization":userToken
          }
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    
    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    isAuthenticated ? <Outlet/> : <Navigate to="/login"/>
  )
}

export default ProtectedRoutes