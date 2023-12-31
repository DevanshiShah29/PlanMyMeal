import React, { useState } from 'react';
import Sidebar from '../layout/sidebar';
import { useNavigate, Outlet } from 'react-router-dom';

const SideBarLayout = () => {
  const navigate = useNavigate();

  const [expand, setExpand] = useState(false);
  const toggleMenu = () => {
    setExpand(!expand);
  };
  const handleLogout = () => {
    localStorage.removeItem('authentication');
    navigate('/login');
  };
  let username = localStorage.getItem('authentication');
  return (
    <>
      <div className="wrapper">
        <Sidebar toggleMenu={toggleMenu} />
        <div className={`${expand ? 'main_content' : 'main_content collapsed'}`}>
          <div className="header">
            Welcome {username}! Have a health conscious day. <a onClick={handleLogout}>Logout</a>
          </div>

          <Outlet />
        </div>
      </div>
    </>
  );
};
export default SideBarLayout;
