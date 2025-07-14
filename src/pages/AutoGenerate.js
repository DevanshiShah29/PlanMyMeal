import { useEffect, useState } from 'react';
// Library Imports
import moment from 'moment';
import { Link } from 'react-router-dom';

// Helper Import
import api from '../utils/api';

export default function AutoGenerate() {
  const [breakfastItems, setBreakfastItems] = useState([]);
  const [lunchItems, setLunchItems] = useState([]);
  const [dinnerItems, setDinnerItems] = useState([]);
  const [currentWeek, setCurrentWeek] = useState([]);
  const [currentDateInfo, setCurrentDateInfo] = useState('');
  const [currentWeekNo, setCurrentWeekNo] = useState('');
  const [today, setToday] = useState('');

  const fetchRecipesByType = async (type) => {
    try {
      const data = await api(`/recipes?type=${type}`, { method: 'GET' });
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(`Failed to fetch ${type} recipes`, err);
      return [];
    }
  };

  const getRandomItems = (items, count) => {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getCurrentWeek = () => {
    let currentDate = moment();
    let weekStart = currentDate.clone().startOf('isoWeek');
    const startOfWeekWeekNumber = moment().startOf('week').week();

    let days = [];

    setCurrentDateInfo(currentDate.format('MMMM YYYY'));
    setCurrentWeekNo(startOfWeekWeekNumber);
    setToday(currentDate.format('dddd D'));

    for (let i = 0; i <= 6; i++) {
      days.push(moment(weekStart).add(i, 'days').format('dddd D'));
    }
    setCurrentWeek(days);
  };

  const handleGenerate = async () => {
    const breakfast = await fetchRecipesByType('breakfast');
    const lunch = await fetchRecipesByType('lunch');
    const dinner = await fetchRecipesByType('dinner');

    const randomBreakfast = getRandomItems(breakfast, 7);
    const randomLunch = getRandomItems(lunch, 7);
    const randomDinner = getRandomItems(dinner, 7);

    setBreakfastItems(randomBreakfast);
    setLunchItems(randomLunch);
    setDinnerItems(randomDinner);

    sessionStorage.setItem('breakfast', JSON.stringify(randomBreakfast));
    sessionStorage.setItem('lunch', JSON.stringify(randomLunch));
    sessionStorage.setItem('dinner', JSON.stringify(randomDinner));
  };

  useEffect(() => {
    getCurrentWeek();
    const breakfast = sessionStorage.getItem('breakfast');
    const lunch = sessionStorage.getItem('lunch');
    const dinner = sessionStorage.getItem('dinner');

    if (breakfast && lunch && dinner) {
      setBreakfastItems(JSON.parse(breakfast));
      setLunchItems(JSON.parse(lunch));
      setDinnerItems(JSON.parse(dinner));
    } else {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="randomWrapper">
      <div className="headerWrapper">
        <h1 className="pageDescription">Plan my week</h1>
        <button className="button" onClick={handleGenerate}>
          Generate
        </button>
      </div>

      <div className="container">
        <div className="title">
          {currentDateInfo} - Week {currentWeekNo}
        </div>
        <div className="days">
          <div className="filler"></div>
          <div className="filler"></div>
          {currentWeek.map((week, index) => (
            <div className={today === week ? 'dayName current' : 'dayName'} key={index}>
              {week}
            </div>
          ))}
        </div>

        {/* Breakfast Row */}
        <div className="row">
          <div className="day">
            <div className="day-number time">Breakfast</div>
          </div>
          {breakfastItems.map((item) =>
            item?._id ? (
              <div key={item._id} className="day">
                <img src={item.image} alt={item.name} className="image" />
                <div className="overlay">
                  <div className="text">
                    <Link to={`/breakfast/${item._id}`}>{item.name}</Link>
                  </div>
                </div>
              </div>
            ) : null,
          )}
        </div>

        {/* Lunch Row */}
        <div className="row">
          <div className="day">
            <div className="day-number time">Lunch</div>
          </div>
          {lunchItems.map((item) =>
            item?._id ? (
              <div key={item._id} className="day">
                <img src={item.image} alt={item.name} className="image" />
                <div className="overlay">
                  <div className="text">
                    <Link to={`/lunch/${item._id}`}>{item.name}</Link>
                  </div>
                </div>
              </div>
            ) : null,
          )}
        </div>

        {/* Dinner Row */}
        <div className="row">
          <div className="day">
            <div className="day-number time">Dinner</div>
          </div>
          {dinnerItems.map((item) =>
            item?._id ? (
              <div key={item._id} className="day">
                <img src={item.image} alt={item.name} className="image" />
                <div className="overlay">
                  <div className="text">
                    <Link to={`/dinner/${item._id}`}>{item.name}</Link>
                  </div>
                </div>
              </div>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}
