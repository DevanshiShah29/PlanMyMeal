import { useState, useEffect } from 'react';

// Library Imports
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import FactCheckTwoToneIcon from '@mui/icons-material/FactCheckTwoTone';
import SchoolTwoToneIcon from '@mui/icons-material/SchoolTwoTone';
import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import { NavLink, useLocation, Navigate } from 'react-router-dom';

export default function Sidebar(props) {
  const { pathname } = useLocation();
  const [expand, setExpand] = useState(false);
  const details = navigator.userAgent;
  const regexp = /android|iphone|kindle|ipad/i;

  const handleToggleSidebar = () => {
    setExpand(!expand);
    props.toggleMenu();
  };

  const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    const encodedRole = localStorage.getItem('role');
    const encodedUsername = localStorage.getItem('username');

    if (!token || !encodedRole || !encodedUsername) return null;

    return {
      token,
      username: encodedUsername,
      role: encodedRole,
    };
  };

  const user = getCurrentUser();

  useEffect(() => {
    if (props.isMobileClick) {
      setExpand(true);
      props.mobileToggle();
    }
  }, [props.isMobileClick, expand, props]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`${expand ? 'sidebar' : 'sidebar collapsed'}`}>
      <div className="topsidebar">
        {expand && <h2>MealPlanner</h2>}
        <MenuTwoToneIcon className="hamburger" onClick={handleToggleSidebar} />
        <CloseIcon className="close" onClick={handleToggleSidebar} />
      </div>
      <ul>
        {user.role === 'admin' ? (
          <>
            <li>
              <NavLink
                to="/recipes"
                className={({ isActive }) => (isActive ? 'navbar-item active' : 'navbar-item')}
                onClick={regexp.test(details) ? handleToggleSidebar : undefined}
                role="button"
              >
                <HomeTwoToneIcon /> {expand && 'Recipes'}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/factsTable"
                className={({ isActive }) => (isActive ? 'navbar-item active' : 'navbar-item')}
                onClick={regexp.test(details) ? handleToggleSidebar : undefined}
                role="button"
              >
                <FactCheckTwoToneIcon /> {expand && 'Facts'}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/FoodInfoTable"
                className={({ isActive }) => (isActive ? 'navbar-item active' : 'navbar-item')}
                onClick={regexp.test(details) ? handleToggleSidebar : undefined}
                role="button"
              >
                <SchoolTwoToneIcon /> {expand && 'Food Info'}
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive || pathname === '/breakfast' || pathname === '/lunch' || pathname === '/dinner'
                    ? 'navbar-item active'
                    : 'navbar-item'
                }
                onClick={regexp.test(details) ? handleToggleSidebar : undefined}
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
                onClick={regexp.test(details) ? handleToggleSidebar : undefined}
              >
                <FactCheckTwoToneIcon /> {expand && 'Facts'}
              </NavLink>
            </li>
            <li>
              <NavLink
                className="navbar-item"
                to="/general"
                role="button"
                onClick={regexp.test(details) ? handleToggleSidebar : undefined}
              >
                <SchoolTwoToneIcon /> {expand && 'General'}
              </NavLink>
            </li>
            <li>
              <NavLink
                className="navbar-item"
                to="/random"
                role="button"
                onClick={regexp.test(details) ? handleToggleSidebar : undefined}
              >
                <AutoAwesomeTwoToneIcon />
                {expand && 'Auto generate'}
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
