import { useState, useEffect } from 'react';

// Library Imports
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LocalDiningSharpIcon from '@mui/icons-material/LocalDiningSharp';
import ChevronLeftSharpIcon from '@mui/icons-material/ChevronLeftSharp';
import { message } from 'antd';

// Helper Import
import api from '../../utils/api';

export default function LunchDetail() {
  const [currentItem, setCurrentItem] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api('/recipes', { method: 'GET' });
        const lunchItems = res.filter((item) => item.type?.toLowerCase() === 'lunch');
        const item = lunchItems.find((item) => item._id === params.id);
        setCurrentItem(item);
      } catch (err) {
        message.error('Error fetching recipes:', err);
      }
    };

    fetchRecipe();
  }, [params.id]);

  const detectUrls = (data) => {
    return data.includes('\n')
      ? data.split('\n').map((desc, index) => {
          const key = index + 1;
          const parts = desc.split(/(https?:\/\/[^\s]+)/);
          const elements = parts.map((part) =>
            /^https?:\/\/[^\s]+$/i.test(part) ? (
              <a key={key} href={part} target="_blank" rel="noopener noreferrer">
                {part}
              </a>
            ) : (
              part
            ),
          );
          return (
            <li key={key} className="disc">
              {elements}
            </li>
          );
        })
      : data;
  };

  return (
    <div id="breakfastWrapperDetail">
      <div className="card">
        <div className="cardHeader">
          <ChevronLeftSharpIcon onClick={() => navigate(-1)} />
          <div className="title">{currentItem.name}</div>
        </div>
        <div className="image">
          <img src={currentItem.image} alt={currentItem.slug} />
        </div>
        <div className="detailInfo">
          <div
            className={`${currentItem.level === 'Easy' ? 'easy' : currentItem.level === 'Medium' ? 'medium' : 'hard'}`}
          >
            <LocalDiningSharpIcon />
            {currentItem.level}
          </div>

          <div className={`kcalCount`}>
            <WhatshotIcon />
            {currentItem.calories} Cal
          </div>
        </div>
        <div className="ingredients">
          <h3>Ingredients</h3>
          <ul className="disc">{currentItem?.ingredients && detectUrls(currentItem.ingredients)}</ul>
        </div>

        <div className="preparation">
          <h3>Preparation</h3>
          <ul className="numbers">{currentItem?.instructions && detectUrls(currentItem.instructions)}</ul>
        </div>
      </div>
    </div>
  );
}
