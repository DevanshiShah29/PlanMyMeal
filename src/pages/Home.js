// Library Imports
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Row, Col } from 'antd';

// Constant Imports
import { homeData } from '../constant/HomeData';

export default function Home() {
  return (
    <div id="homeWrapper">
      <h1 className="pageDescription">Choose meal</h1>
      <div className="homediv">
        <Row gutter={[24, 24]}>
          {homeData.map((item) => {
            return (
              <Col
                key={item.id}
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={6}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <div className="card" key={item.id}>
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
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
