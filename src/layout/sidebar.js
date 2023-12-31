import React, { useState } from 'react';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import FactCheckTwoToneIcon from '@mui/icons-material/FactCheckTwoTone';
import SchoolTwoToneIcon from '@mui/icons-material/SchoolTwoTone';
import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { NavLink, useLocation } from 'react-router-dom';

export default function Sidebar(props) {
  const { pathname } = useLocation();
  const [expand, setExpand] = useState(false);

  const handleToggleSidebar = () => {
    setExpand(!expand);
    props.toggleMenu();
  };
  return (
    <div className={`${expand ? 'sidebar' : 'sidebar collapsed'}`}>
      <div className="topsidebar">
        {expand && <h2>Sidebar</h2>}
        <MenuTwoToneIcon onClick={handleToggleSidebar} />
      </div>
      <ul>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive || pathname === '/breakfast' || pathname === '/lunch' || pathname === '/dinner'
              ? 'navbar-item active'
              : 'navbar-item'
          }
        >
          <li>
            <HomeTwoToneIcon /> {expand && 'Home'}
          </li>
        </NavLink>{' '}
        <NavLink className="navbar-item" to="/facts">
          <li>
            <FactCheckTwoToneIcon /> {expand && 'Facts'}
          </li>
        </NavLink>{' '}
        <NavLink className="navbar-item" to="/general">
          <li>
            <SchoolTwoToneIcon /> {expand && 'General'}
          </li>
        </NavLink>{' '}
        <NavLink className="navbar-item" to="/random">
          <li>
            <AutoAwesomeTwoToneIcon />
            {expand && 'Auto generate'}
          </li>
        </NavLink>
      </ul>
    </div>
  );
}
