// Library imports
import 'antd/dist/reset.css';
import './App.css';
import './scss/App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';

// Auth pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';

// Middleware pages
import PrivateRoute from './utils/PrivateRoute';
import AdminRoute from './utils/AdminRoute';
import UserRoute from './utils/UserRoute';

// Recipe pages
import AddRecipe from './pages/recipes/AddRecipe';
import Recipes from './pages/recipes/Recipes';
import RecipeList from './pages/recipes/RecipeList';
import RecipeDetail from './pages/recipes/RecipeDetail';

// Facts pages
import FactsPage from './pages/facts/FactsPage';
import FactsTable from './pages/facts/FactsTable';
import AddFact from './pages/facts/AddFact'; 

// Food info pages
import General from './pages/foodInfo/General';
import FoodInfoTable from './pages/foodInfo/FoodInfoTable';
import AddFoodInfo from './pages/foodInfo/AddFoodInfo';

// Classification pages
import FoodTabCard from './pages/classification/TabCard';
import FoodClassification from './pages/classification/FoodClassification';

// Plan week page
import AutoGenerate from './pages/AutoGenerate';

// Layout pages
import SideBarLayout from './layout/Header';

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
                <Route path="/:type" element={<RecipeList />} />
                <Route path="/:type/:id" element={<RecipeDetail />} />
                <Route path="/facts" element={<FactsPage />} />
                <Route path="/general" element={<General />} />
                <Route path="/foodClassification" element={<FoodClassification />} />
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
                <Route path="/foodCategoryTable" element={<FoodTabCard />} />
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
