import { useState, useEffect } from 'react';

// Library Imports
import { useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LocalDiningSharpIcon from '@mui/icons-material/LocalDiningSharp';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import ChevronLeftSharpIcon from '@mui/icons-material/ChevronLeftSharp';
import { message } from 'antd';

// Helper Import
import api from '../../utils/api';

export default function Breakfast() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const breakfastItems = await api('/recipes?type=breakfast', { method: 'GET' });
        setAllData(breakfastItems);
        setFilteredData(breakfastItems);
      } catch (error) {
        message.error('Error fetching recipes:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event) => {
    let newData = allData.filter((data) => {
      return (
        data.name.toString().toLowerCase().includes(event.target.value.toLowerCase()) ||
        data.level.toString().toLowerCase().includes(event.target.value.toLowerCase()) ||
        data.time.toString().toLowerCase().includes(event.target.value.toLowerCase())
      );
    });
    setFilteredData(newData);
  };

  return (
    <div id="breakfastWrapper">
      <div className="backIcon">
        <ChevronLeftSharpIcon onClick={() => navigate(-1)} /> <h1 className="pageDescription">Breakfast recipes</h1>
      </div>
      <div className="searchWrapper">
        <div className="input-box">
          <SearchSharpIcon />
          <input type="text" placeholder="Search here..." onChange={(e) => handleChange(e)} />
        </div>
        <button className="button">Search</button>
      </div>
      <div className="cardParent">
        {filteredData.map((item) => {
          return (
            <div className="cardWrapper" key={item._id} onClick={() => navigate(`/breakfast/${item._id}`)}>
              <div className="time">
                <AccessTimeIcon />
                <div>{item.time}</div>
              </div>
              <img src={item.image} alt={item.name} className="recipeImage" />
              <div className="cardContent">
                <h3>{item.name}</h3>
                <p>{item.description}</p>

                <div className={`${item.level === 'Easy' ? 'easy' : item.level === 'Medium' ? 'medium' : 'hard'}`}>
                  <LocalDiningSharpIcon />
                  {item.level}
                </div>

                <div className={`kcalCount`}>
                  <WhatshotIcon />
                  {item.calories} Cal
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
