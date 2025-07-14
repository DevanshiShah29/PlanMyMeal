import 'antd/dist/reset.css';
import './App.css';
import './scss/App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Facts from './pages/Facts/Facts';
import FactsTable from './pages/Facts/FactsTable';
import AddFact from './pages/Facts/AddFact';

import General from './pages/foodInfo/General';
import FoodInfoTable from './pages/foodInfo/FoodInfoTable';
import AddFoodInfo from './pages/foodInfo/AddFoodInfo';

import AutoGenerate from './pages/AutoGenerate';
import Breakfast from './pages/breakfast/Breakfast';
import Lunch from './pages/lunch/Lunch';
import LunchDetail from './pages/lunch/LunchDetail';
import Dinner from './pages/dinner/Dinner';
import BreakfastDetail from './pages/breakfast/BreakfastDetail';
import ErrorPage from './pages/ErrorPage';
import Login from './pages/Login';
import SideBarLayout from './layout/Header';
import DinnerDetail from './pages/dinner/DinnerDetail';
import AddRecipe from './pages/recipes/AddRecipe';
import Recipes from './pages/recipes/Recipes';

import PrivateRoute from './utils/PrivateRoute';
import AdminRoute from './utils/AdminRoute';
import UserRoute from './utils/UserRoute';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes wrapped in PrivateRoute + layout */}
          <Route element={<PrivateRoute />}>
            <Route element={<SideBarLayout />}>
              <Route element={<UserRoute />}>
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
              </Route>
              <Route element={<AdminRoute />}>
                <Route path="/add-recipe" element={<AddRecipe />} />
                <Route path="/edit/:id" element={<AddRecipe />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/factsTable" element={<FactsTable />} />
                <Route path="/add-fact" element={<AddFact />} />
                <Route path="/FoodInfoTable" element={<FoodInfoTable />} />
                <Route path="/add-food-info" element={<AddFoodInfo />} />
              </Route>
              <Route path="*" element={<ErrorPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
