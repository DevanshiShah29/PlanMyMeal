import './App.css';
import './scss/App.scss';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Facts from './pages/Facts';
import General from './pages/General';
import AutoGenerate from './pages/AutoGenerate';
import Breakfast from './pages/breakfast/Breakfast';
import Lunch from './pages/lunch/Lunch';
import LunchDetail from './pages/lunch/LunchDetail';
import Dinner from './pages/dinner/Dinner';
import BreakfastDetail from './pages/breakfast/BreakfastDetail';
import ErrorPage from './pages/ErrorPage';
import Login from './pages/Login';
import SideBarLayout from './pages/Sidebar';
import DinnerDetail from './pages/dinner/DinnerDetail';

function App() {
  const PrivateRoutes = () => {
    let auth = localStorage.getItem('authentication');
    return auth ? <Outlet /> : <Navigate to="/login" />;
  };
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route element={<SideBarLayout />}>
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Home />} />
              <Route path="/breakfast" element={<Breakfast />} />
              <Route path="/breakfast/:id" element={<BreakfastDetail />} />
              <Route path="/lunch" element={<Lunch />} />
              <Route path="/lunch/:id" element={<LunchDetail />} />
              <Route path="/dinner" element={<Dinner />} />
              <Route path="/dinner/:id" element={<DinnerDetail />} />
              <Route path="/facts" element={<Facts />} />
              <Route path="/general" element={<General />} />
              <Route path="/random" element={<AutoGenerate />} />
              <Route path="*" element={<ErrorPage />} />
            </Route>
          </Route>

          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
