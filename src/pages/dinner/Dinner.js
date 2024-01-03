import React, { useState } from 'react';
import { DinnerData } from '../../constant/AutoGenerate';
import { Link, useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LocalDiningSharpIcon from '@mui/icons-material/LocalDiningSharp';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import ChevronLeftSharpIcon from '@mui/icons-material/ChevronLeftSharp';

export default function Dinner() {
  const [filteredData, setFilteredData] = useState(DinnerData);
  const navigate = useNavigate();

  const handleChange = (event) => {
    let newData = DinnerData.filter((data) => {
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
        <ChevronLeftSharpIcon onClick={() => navigate(-1)} /> <h1 className="pageDescription">Dinner recipes</h1>
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
                <Link to={`/dinner/` + item.id} className="button">
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
