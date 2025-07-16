import { useEffect, useState } from 'react';

// Library Imports
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Skeleton, Card, List, Space, Typography, message } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import LocalDiningSharpIcon from '@mui/icons-material/LocalDiningSharp';

// Helper Import
import api from '../utils/api';

// Reusable components
import CommonButton from '../components/CommonButton';
import CommonModal from '../components/CommonModal';
import MemoizedImage from '../components/MemoizedImage';

export default function AutoGenerate() {
  const [breakfastItems, setBreakfastItems] = useState([]);
  const [lunchItems, setLunchItems] = useState([]);
  const [dinnerItems, setDinnerItems] = useState([]);
  const [currentWeek, setCurrentWeek] = useState([]);
  const [currentDateInfo, setCurrentDateInfo] = useState('');
  const [currentWeekNo, setCurrentWeekNo] = useState('');
  const [today, setToday] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalDayIndex, setModalDayIndex] = useState(null);
  const [allRecipes, setAllRecipes] = useState([]);

  const fetchRecipesByType = async (type) => {
    try {
      const data = await api(`/recipes?type=${type}`, { method: 'GET' });
      return Array.isArray(data) ? data : [];
    } catch (err) {
      message.error(`Error fetching data: ${err}`);
      return [];
    }
  };

  const getRandomItems = (items, count) => {
    if (!items || items.length === 0) return Array(count).fill(null);

    // If we have exactly enough items, return them shuffled
    if (items.length === count) {
      return [...items].sort(() => 0.5 - Math.random());
    }

    // If we have fewer items than needed, fill with null
    if (items.length < count) {
      const shuffled = [...items].sort(() => 0.5 - Math.random());
      return [...shuffled, ...Array(count - items.length).fill(null)];
    }

    // If we have more items than needed, shuffle and slice
    return [...items].sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const [breakfast, lunch, dinner] = await Promise.all([
        fetchRecipesByType('breakfast'),
        fetchRecipesByType('lunch'),
        fetchRecipesByType('dinner'),
      ]);

      // Get exactly 7 unique items for each meal type
      const randomBreakfast = getRandomItems(breakfast, 7);
      const randomLunch = getRandomItems(lunch, 7);
      const randomDinner = getRandomItems(dinner, 7);

      setBreakfastItems(randomBreakfast);
      setLunchItems(randomLunch);
      setDinnerItems(randomDinner);

      sessionStorage.setItem('breakfast', JSON.stringify(randomBreakfast));
      sessionStorage.setItem('lunch', JSON.stringify(randomLunch));
      sessionStorage.setItem('dinner', JSON.stringify(randomDinner));
    } catch (error) {
      message.error(`Error generating: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentWeek = () => {
    let currentDate = moment();
    let weekStart = currentDate.clone().startOf('isoWeek');
    const startOfWeekWeekNumber = weekStart.week();

    let days = [];

    setCurrentDateInfo(currentDate.format('MMMM YYYY'));
    setCurrentWeekNo(startOfWeekWeekNumber);
    setToday(currentDate.format('dddd D'));

    for (let i = 0; i <= 6; i++) {
      days.push(moment(weekStart).add(i, 'days').format('dddd D'));
    }
    setCurrentWeek(days);
  };

  const handleClear = () => {
    sessionStorage.removeItem('breakfast');
    sessionStorage.removeItem('lunch');
    sessionStorage.removeItem('dinner');
    setBreakfastItems(Array(7).fill(null));
    setLunchItems(Array(7).fill(null));
    setDinnerItems(Array(7).fill(null));
  };

  const openModal = async (type, index) => {
    setModalType(type);
    setModalDayIndex(index);
    try {
      const recipes = await fetchRecipesByType(type);
      setAllRecipes(recipes);
      setIsModalOpen(true);
    } catch (error) {
      message.error(`Error fetching: ${error}`);
    }
  };

  const handleRecipeSelect = (selected) => {
    const updateItems = (items, newItem) => {
      const newItems = [...items];
      newItems[modalDayIndex] = newItem;
      return newItems;
    };

    if (modalType === 'breakfast') {
      const updated = updateItems(breakfastItems, selected);
      setBreakfastItems(updated);
      sessionStorage.setItem('breakfast', JSON.stringify(updated));
    }
    if (modalType === 'lunch') {
      const updated = updateItems(lunchItems, selected);
      setLunchItems(updated);
      sessionStorage.setItem('lunch', JSON.stringify(updated));
    }
    if (modalType === 'dinner') {
      const updated = updateItems(dinnerItems, selected);
      setDinnerItems(updated);
      sessionStorage.setItem('dinner', JSON.stringify(updated));
    }

    setIsModalOpen(false);
  };

  useEffect(() => {
    getCurrentWeek();
    const loadFromStorage = () => {
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
    };

    loadFromStorage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getUniqueKey = (item, index) => {
    return item ? `${item._id}-${index}` : `null-${index}`;
  };

  const renderRow = (items, type) => (
    <div className="row">
      <div className="day">
        <div className="day-number time">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
      </div>
      {(loading ? [...Array(7)] : items).map((item, index) => (
        <div key={getUniqueKey(item, index)} className="day" onClick={() => !loading && openModal(type, index)}>
          {loading ? (
            <Skeleton.Avatar active shape="square" style={{ width: '100%', height: '100%' }} />
          ) : !item ? (
            <div className="empty-slot">
              <CommonButton
                type="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(type, index);
                }}
                text="+ Add"
              />
            </div>
          ) : (
            <>
              <img src={item.image} alt={item.name} className="image" />
              <div className="overlay">
                <div className="text">
                  <Link to={`/${type}/${item._id}`}>{item.name}</Link>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div id="randomWrapper">
      <div className="headerWrapper">
        <h1 className="pageDescription">Plan my week</h1>
        <div>
          <CommonButton type="secondary" onClick={handleGenerate} loading={loading} text="Generate" />
          <CommonButton type="default" onClick={handleClear} text="Clear Week" />
        </div>
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

        {renderRow(breakfastItems, 'breakfast')}
        {renderRow(lunchItems, 'lunch')}
        {renderRow(dinnerItems, 'dinner')}
      </div>

      <CommonModal
        title={`Select ${modalType.charAt(0).toUpperCase() + modalType.slice(1)} Recipe`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="recipe-modal"
      >
        <div className="recipe-scrollable-list">
          <List
            dataSource={allRecipes}
            renderItem={(item) => (
              <Card hoverable onClick={() => handleRecipeSelect(item)} className="recipe-card">
                <div className="recipe-card-content">
                  <div className="recipe-image-wrapper">
                    <MemoizedImage alt={item.name} src={item.image} className="recipe-image" />
                  </div>
                  <div className="recipe-details">
                    <Typography.Title level={5} className="recipe-title">
                      {item.name}
                    </Typography.Title>
                    <div className="recipe-tags">
                      <Space size={[8, 8]} wrap>
                        <div
                          className={`${item.level === 'Easy' ? 'easy' : item.level === 'Medium' ? 'medium' : 'hard'}`}
                        >
                          <LocalDiningSharpIcon />
                          {item.level}
                        </div>
                        <div className={`kcalCount`}>
                          <ClockCircleOutlined />
                          {item.time}
                        </div>
                      </Space>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          />
        </div>
      </CommonModal>
    </div>
  );
}
