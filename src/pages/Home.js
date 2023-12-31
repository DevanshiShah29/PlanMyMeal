import React from 'react';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { homeData } from '../constant/HomeData';

export default function Home() {
  return (
    <div id="homeWrapper">
      <p className="pageDescription">Choose meal</p>
      <div className="homediv">
        {homeData.map((item) => {
          return (
            <div className="card">
              <div className="img">
                <img alt={item.slug} src={item.image} />
              </div>
              <div className="content">
                <div className="title">{item.name}</div>
                <p>{item.description}</p>
              </div>
              <Link to={`/${item.slug}`}>
                <button>
                  <ChevronRightIcon />
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
