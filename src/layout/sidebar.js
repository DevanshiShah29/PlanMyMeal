import React, { useState, useEffect } from 'react';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import FactCheckTwoToneIcon from '@mui/icons-material/FactCheckTwoTone';
import SchoolTwoToneIcon from '@mui/icons-material/SchoolTwoTone';
import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { NavLink, useLocation } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

export default function Sidebar(props) {
  const { pathname } = useLocation();
  const [expand, setExpand] = useState(false);
  let details = navigator.userAgent;
  let regexp = /android|iphone|kindle|ipad/i;

  const handleToggleSidebar = () => {
    setExpand(!expand);
    props.toggleMenu();
  };

  useEffect(() => {
    if (props.isMobileClick) {
      console.log(expand);
      setExpand(true);
      props.mobileToggle();
    }
  }, [props.isMobileClick]);
  return (
    <div className={`${expand ? 'sidebar' : 'sidebar collapsed'}`}>
      <div className="topsidebar">
        {expand && <h2>Sidebar</h2>}
        <MenuTwoToneIcon className="hamburger" onClick={handleToggleSidebar} />
        <CloseIcon className="close" onClick={handleToggleSidebar} />
      </div>
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive || pathname === '/breakfast' || pathname === '/lunch' || pathname === '/dinner'
                ? 'navbar-item active'
                : 'navbar-item'
            }
            onClick={regexp.test(details) && handleToggleSidebar}
            role="button"
          >
            <HomeTwoToneIcon /> {expand && 'Home'}
          </NavLink>
        </li>
        <li>
          <NavLink
            className="navbar-item"
            to="/facts"
            role="button"
            onClick={regexp.test(details) && handleToggleSidebar}
          >
            <FactCheckTwoToneIcon /> {expand && 'Facts'}
          </NavLink>
        </li>
        <li>
          <NavLink
            className="navbar-item"
            to="/general"
            role="button"
            onClick={regexp.test(details) && handleToggleSidebar}
          >
            <SchoolTwoToneIcon /> {expand && 'General'}
          </NavLink>
        </li>
        <li>
          <NavLink
            className="navbar-item"
            to="/random"
            role="button"
            onClick={regexp.test(details) && handleToggleSidebar}
          >
            <AutoAwesomeTwoToneIcon />
            {expand && 'Auto generate'}
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
