import { useState } from 'react';

// Resusable Components
import Sidebar from './sidebar';

// Library Imports
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
    localStorage.clear();
    navigate('/login');
  };
  let username = localStorage.getItem('username');
  return (
    <>
      <div className="wrapper">
        <Sidebar toggleMenu={toggleMenu} mobileToggle={mobileToggle} isMobileClick={isMobileClick} />
        <div className={`${expand ? 'main_content' : 'main_content collapsed'}`}>
          <div className="header">
            Welcome {username}! {!regexp.test(details) && 'Have a health conscious day.'}
            <div className="mobileBtn">
              <button onClick={handleLogout}>Logout</button>
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
