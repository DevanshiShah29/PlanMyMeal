import React, { useState } from 'react';
import { LunchData } from '../../constant/AutoGenerate';
import { Link, useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LocalDiningSharpIcon from '@mui/icons-material/LocalDiningSharp';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import ChevronLeftSharpIcon from '@mui/icons-material/ChevronLeftSharp';

export default function Lunch() {
  const [filteredData, setFilteredData] = useState(LunchData);
  const navigate = useNavigate();

  const handleChange = (event) => {
    let newData = LunchData.filter((data) => {
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
        <ChevronLeftSharpIcon onClick={() => navigate(-1)} /> <p className="pageDescription">Lunch recipes</p>
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
            <div className="cardWrapper" key={item.id}>
              <div className="time">
                <AccessTimeIcon />
                <div>{item.time}</div>
              </div>
              <img src={item.image} alt={item.name} className="recipeImage" />
              <div className="cardContent">
                <h3>{item.name}</h3>

                <div className={`${item.level === 'easy' ? 'easy' : item.level === 'medium' ? 'medium' : 'hard'}`}>
                  <LocalDiningSharpIcon />
                  {item.level}
                </div>

                <div className={`kcalCount`}>
                  <WhatshotIcon />
                  {item.calories} Cal
                </div>
                <p>"{item.description}"</p>
                <Link to={`/lunch/` + item.id} className="button">
                  View
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
