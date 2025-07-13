import { useState, useEffect } from 'react';

// Helper Imports
import api from '../../utils/api';

// Library Imports
import { message, Empty } from 'antd';

export default function General() {
  const [fliped, setFliped] = useState(0);
  const [foodData, setFoodData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api('/food-info', {
          method: 'GET',
        });
        setFoodData(res);
      } catch (err) {
        console.error('Failed to load food info:', err);
        message.error('Failed to load food information');
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (id) => {
    if (id !== fliped) {
      setFliped(id);
    } else {
      setFliped(false);
    }
  };

  return (
    <div id="generalWrapper">
      <h1 className="pageDescription">Nutritional Information</h1>
      {Array.isArray(foodData) && foodData.length > 0 ? (
        <div className="content">
          {foodData.map((item) => (
            <div
              className={`${fliped === item._id ? 'flipcard card' : 'card'}`}
              onClick={() => handleCardClick(item._id)}
              key={item._id}
            >
              <div className="front" style={{ backgroundImage: `url(${item.image})` }}>
                <p>{item.frontParagraph}</p>
              </div>
              <div className="back">
                <div>
                  <p>{item.backParagraph}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="emptyWrapper">
          <Empty description="No food data found" />
        </div>
      )}
    </div>
  );
}
