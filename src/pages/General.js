import React, { useState } from 'react';
import { data } from '../constant/General';
export default function General() {
  const [fliped, setFliped] = useState(0);

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
      <div className="content">
        {data.map((item) => {
          return (
            <div
              className={`${fliped === item.id ? 'flipcard card' : 'card'}`}
              onClick={() => handleCardClick(item.id)}
              key={item.id}
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
          );
        })}
      </div>
    </div>
  );
}
