import React, { useEffect, useState } from 'react';
import { breakfastData, LunchData, DinnerData } from '../constant/AutoGenerate';
import moment from 'moment';
import { Link } from 'react-router-dom';

export default function AutoGenerate() {
  const [breakfastItems, setBreakfastItems] = useState([]);
  const [lunchItems, setLunchItems] = useState([]);
  const [dinnerItems, setDinnerItems] = useState([]);
  const [currentWeek, setCurrentWeek] = useState([]);
  const [currentDateInfo, setCurrentDateInfo] = useState('');
  const [currentWeekNo, setCurrentWeekNo] = useState('');
  const [today, setToday] = useState('');

  const getRandomItems = (items, numberOfItems) => {
    const pickedItems = [];
    for (let i = 1; i <= numberOfItems; i += 1) {
      pickedItems.push(Math.trunc(Math.random() * items.length + 1));
    }
    return pickedItems;
  };

  const getRandomMealItems = (randomNo, JsonData) => {
    let finalData = randomNo.map((randomId) => {
      return JsonData.filter((item) => item.id === randomId)[0];
    });
    return finalData;
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

    return days;
  };

  const handleGenerate = () => {
    const randomBreakfastIds = getRandomItems(breakfastData, 7);
    const randomLunchIds = getRandomItems(LunchData, 7);
    const randomDinnerIds = getRandomItems(DinnerData, 7);

    setBreakfastItems(getRandomMealItems(randomBreakfastIds, breakfastData));
    setLunchItems(getRandomMealItems(randomLunchIds, LunchData));
    setDinnerItems(getRandomMealItems(randomDinnerIds, DinnerData));
    sessionStorage.setItem('breakfast', JSON.stringify(breakfastItems));
    sessionStorage.setItem('lunch', JSON.stringify(lunchItems));
    sessionStorage.setItem('dinner', JSON.stringify(dinnerItems));
  };

  useEffect(() => {
    getCurrentWeek();
    let breakfast = sessionStorage.getItem('breakfast');
    let lunch = sessionStorage.getItem('lunch');
    let dinner = sessionStorage.getItem('dinner');

    if (breakfast) {
      setBreakfastItems(JSON.parse(breakfast));
      setLunchItems(JSON.parse(lunch));
      setDinnerItems(JSON.parse(dinner));
    } else {
      const randomBreakfastIds = getRandomItems(breakfastData, 7);
      const randomLunchIds = getRandomItems(LunchData, 7);
      const randomDinnerIds = getRandomItems(DinnerData, 7);

      setBreakfastItems(getRandomMealItems(randomBreakfastIds, breakfastData));
      setLunchItems(getRandomMealItems(randomLunchIds, LunchData));
      setDinnerItems(getRandomMealItems(randomDinnerIds, DinnerData));

      sessionStorage.setItem('breakfast', JSON.stringify(breakfastItems));
      sessionStorage.setItem('lunch', JSON.stringify(lunchItems));
      sessionStorage.setItem('dinner', JSON.stringify(dinnerItems));
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div id="randomWrapper">
      <div className="headerWrapper">
        <h1 className="pageDescription">Plan my week </h1>
        <button className="button" onClick={() => handleGenerate()}>
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
          {currentWeek.length > 0 &&
            currentWeek.map((week, index) => {
              return (
                <div className={`${today === week ? 'dayName current' : 'dayName'}`} key={index}>
                  {week}
                </div>
              );
            })}
        </div>
        <div className="row">
          <div className="day">
            <div className="day-number time">Breakfast</div>
          </div>

          {breakfastItems.length > 0 &&
            breakfastItems.map((item, index) => {
              return (
                <div key={index + 1} className="day">
                  <img src={item?.image} alt={item?.name} className="image" />
                  <div className="overlay">
                    <div className="text">
                      <Link to={'/breakfast/' + item.id}> {item?.name}</Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="row">
          <div className="day">
            <div className="day-number time">Lunch</div>
          </div>
          {lunchItems.length > 0 &&
            lunchItems.map((item, index) => {
              return (
                <div key={index + 1} className="day">
                  <img src={item?.image} alt={item?.name} className="image" />
                  <div className="overlay">
                    <div className="text">
                      <Link to={'/breakfast/' + item.id}> {item?.name}</Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="row">
          <div className="day">
            <div className="day-number time">Dinner</div>
          </div>
          {dinnerItems.length > 0 &&
            dinnerItems.map((item, index) => {
              return (
                <div key={index + 1} className="day">
                  <img src={item?.image} alt={item?.name} className="image" />
                  <div className="overlay">
                    <div className="text">
                      <Link to={'/breakfast/' + item.id}> {item?.name}</Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
