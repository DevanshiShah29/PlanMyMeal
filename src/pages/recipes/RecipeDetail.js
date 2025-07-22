import { useState, useEffect } from 'react';

// Library Imports
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LocalDiningSharpIcon from '@mui/icons-material/LocalDiningSharp';
import ChevronLeftSharpIcon from '@mui/icons-material/ChevronLeftSharp';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { message } from 'antd';

// Helper Import
import api from '../../utils/api';

export default function RecipeDetail() {
  const [currentItem, setCurrentItem] = useState({});
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    currentItem.image && { type: 'image', src: currentItem.image },
    currentItem.youtubeLink && { type: 'video', src: currentItem.youtubeLink },
  ].filter(Boolean);

  const { type, id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api(`/recipes?type=${type}`, { method: 'GET' });
        const item = res.find((item) => item._id === id);
        setCurrentItem(item || {});
      } catch (err) {
        message.error(`Error fetching ${err}`);
      }
    };

    fetchRecipe();
  }, [type, id]);

  const goPrev = () => setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setSlideIndex((prev) => (prev + 1) % slides.length);
  if (slides.length === 0) return null;
  const showNav = slides.length > 1;

  const detectUrls = (data) =>
    data?.includes('\n')
      ? data.split('\n').map((desc, index) => {
          const key = index + 1;
          const parts = desc.split(/(https?:\/\/[^\s]+)/);
          const elements = parts.map((part) =>
            /^https?:\/\/[^\s]+$/.test(part) ? (
              <a key={part} href={part} target="_blank" rel="noopener noreferrer">
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

  return (
    <div id="breakfastWrapperDetail">
      <div className="card">
        <div className="cardHeader">
          <ChevronLeftSharpIcon onClick={() => navigate(-1)} />
          <div className="title">{currentItem.name}</div>
        </div>

        <div className="mediaSlider">
          <div className="sliderContent">
            {showNav && (
              <button className="arrow left" onClick={goPrev}>
                <ChevronLeftIcon />
              </button>
            )}

            {slides[slideIndex].type === 'image' ? (
              <img src={slides[slideIndex].src} alt="recipe" key={slideIndex} />
            ) : (
              <iframe
                src={slides[slideIndex].src}
                title="Recipe Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                key={slideIndex}
              ></iframe>
            )}

            {showNav && (
              <button className="arrow right" onClick={goNext}>
                <ChevronRightIcon />
              </button>
            )}
          </div>

          {showNav && (
            <div className="sliderNav">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  className={idx === slideIndex ? 'active' : ''}
                  onClick={() => setSlideIndex(idx)}
                ></button>
              ))}
            </div>
          )}
        </div>
        <div className="detailInfo">
          <div className={currentItem.level === 'Easy' ? 'easy' : currentItem.level === 'Medium' ? 'medium' : 'hard'}>
            <LocalDiningSharpIcon />
            {currentItem.level}
          </div>

          <div className="kcalCount">
            <WhatshotIcon />
            {currentItem.calories} Cal
          </div>
        </div>
        <div className="ingredients">
          <h3>Ingredients</h3>
          <ul className="disc">{detectUrls(currentItem.ingredients)}</ul>
        </div>

        <div className="preparation">
          <h3>Preparation</h3>
          <ul className="numbers">{detectUrls(currentItem.instructions)}</ul>
        </div>
      </div>
    </div>
  );
}
