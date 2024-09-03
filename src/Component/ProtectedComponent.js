
// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import { useContext } from 'react';

const ProtectedRoute = ({ children }) => {
  const { isLogin } = useContext(AuthContext);

  if (!isLogin) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
