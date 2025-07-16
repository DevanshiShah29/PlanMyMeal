import { useState, useEffect } from 'react';

// Library Imports
import { useNavigate, useParams } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LocalDiningSharpIcon from '@mui/icons-material/LocalDiningSharp';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import ChevronLeftSharpIcon from '@mui/icons-material/ChevronLeftSharp';
import { message } from 'antd';

// Helper Import
import api from '../../utils/api';

export default function RecipeList() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const { type } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api(`/recipes?type=${type}`, { method: 'GET' });
        const recipes = Array.isArray(data) ? data : [];
        setAllData(recipes);
        setFilteredData(recipes);
      } catch (error) {
        message.error('Error fetching recipes');
        setAllData([]);
        setFilteredData([]);
      }
    };

    fetchData();
  }, [type]);

  const handleChange = (event) => {
    const value = event.target.value.toLowerCase();
    const filtered = allData.filter((data) =>
      [data.name, data.level, data.time].some((field) => field?.toString().toLowerCase().includes(value)),
    );
    setFilteredData(filtered);
  };

  return (
    <div id="breakfastWrapper">
      <div className="backIcon">
        <ChevronLeftSharpIcon onClick={() => navigate(-1)} />
        <h1 className="pageDescription">{type} Recipes</h1>
      </div>
      <div className="searchWrapper">
        <div className="input-box">
          <SearchSharpIcon />
          <input type="text" placeholder="Search here..." onChange={handleChange} />
        </div>
        <button className="button">Search</button>
      </div>
      <div className="cardParent">
        {filteredData.map((item) => (
          <div className="cardWrapper" key={item._id} onClick={() => navigate(`/${type}/${item._id}`)}>
            <div className="time">
              <AccessTimeIcon />
              <div>{item.time}</div>
            </div>
            <img src={item.image} alt={item.name} className="recipeImage" />
            <div className="cardContent">
              <h3>{item.name}</h3>
              <p>{item.description}</p>

              <div className={item.level === 'Easy' ? 'easy' : item.level === 'Medium' ? 'medium' : 'hard'}>
                <LocalDiningSharpIcon />
                {item.level}
              </div>

              <div className="kcalCount">
                <WhatshotIcon />
                {item.calories} Cal
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
