import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

const AdminRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsAdmin(!!token && role === 'admin');
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAdmin ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default AdminRoute;
