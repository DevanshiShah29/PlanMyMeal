import React, { useState } from 'react';
import Sidebar from '../layout/sidebar';
import { useNavigate, Outlet } from 'react-router-dom';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';

const SideBarLayout = () => {
  const navigate = useNavigate();
  let details = navigator.userAgent;
  let regexp = /android|iphone|kindle|ipad/i;

  const [expand, setExpand] = useState(false);
  const [isMobileClick, setIsMobileClick] = useState(false);
  const toggleMenu = () => {
    setExpand(!expand);
  };
  const mobileToggle = () => {
    setIsMobileClick(false);
  };
  const handleLogout = () => {
    localStorage.removeItem('authentication');
    navigate('/login');
  };
  let username = atob(localStorage.getItem('authentication'));
  return (
    <>
      <div className="wrapper">
        <Sidebar toggleMenu={toggleMenu} mobileToggle={mobileToggle} isMobileClick={isMobileClick} />
        <div className={`${expand ? 'main_content' : 'main_content collapsed'}`}>
          <div className="header">
            Welcome {username}! {!regexp.test(details) && 'Have a health conscious day.'}
            <div className="mobileBtn">
              <a role="button" onClick={handleLogout}>
                Logout
              </a>
              <MenuTwoToneIcon className="hamburger" onClick={() => setIsMobileClick(true)} />
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </>
  );
};
export default SideBarLayout;
