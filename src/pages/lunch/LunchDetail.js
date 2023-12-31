import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { LunchData } from '../../constant/AutoGenerate';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LocalDiningSharpIcon from '@mui/icons-material/LocalDiningSharp';
import ChevronLeftSharpIcon from '@mui/icons-material/ChevronLeftSharp';

export default function LunchDetail() {
  const [currentItem, setCurrentItem] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    let finalData = LunchData.filter((item) => item.id === Number(params.id))[0];
    setCurrentItem(finalData);
  }, [params.id]);

  const detectUrls = (data) => {
    console.log(data, 'data');
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
            className={`${currentItem.level === 'easy' ? 'easy' : currentItem.level === 'medium' ? 'medium' : 'hard'}`}
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
          <ul className="numbers">
            {console.log(currentItem)}
            {currentItem?.instructions && detectUrls(currentItem.instructions)}
          </ul>
        </div>
      </div>
    </div>
  );
}
