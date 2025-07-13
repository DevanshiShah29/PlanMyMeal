import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

const UserRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    setIsUser(!!token && role === 'user');
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return isUser ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default UserRoute;
