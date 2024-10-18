import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

  if (!token) {
    return <Navigate to="/" />; // Redirect to login if no token is found
  }

  return children;
};

export default ProtectedRoute;