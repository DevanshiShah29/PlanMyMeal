import { useEffect, useState } from 'react';

// Library Imports
import { Tabs, Card, Tag, Row, Col, Spin, message } from 'antd';

// Helper function
import api from '../../utils/api';

const FoodClassification = () => {
  const [classifications, setClassifications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClassifications = async () => {
    setLoading(true);
    try {
      const data = await api('/classifications', { method: 'GET' });
      setClassifications(data);
    } catch (err) {
      message.error(`Failed to load classifications: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api('/categories', { method: 'GET' });
      setCategories(res.data);
    } catch (err) {
      message.error(`Failed to load food categories: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassifications();
    fetchCategories();
  }, []);

  const grouped = classifications.map((cls) => ({
    ...cls,
    categories: categories.filter((cat) => cat.classification?.name.trim() === cls.name.trim()),
  }));

  return (
    <div className="food-classification-wrapper">
      <h1 className="pageDescription">Food Classification</h1>

      <Card className="card-wrapper">
        {loading ? (
          <Spin spinning={loading} size="large" className="loader" />
        ) : (
          <Tabs defaultActiveKey="0" centered className="equal-width-tabs">
            {grouped.map((cls, index) => (
              <Tabs.TabPane
                key={index}
                tab={
                  <span
                    className="tab-span"
                    style={{
                      background: cls.bgColor,
                    }}
                  >
                    <img className="img" src={cls.icon} alt={cls.name} />
                    <div className="name" style={{ color: cls.color }}>
                      {cls.name}
                    </div>
                    <div className="subText" style={{ color: cls.color }}>
                      {cls.subText}
                    </div>
                  </span>
                }
              >
                <div className="paragraph">
                  <h2 style={{ color: cls.color }}>
                    {cls.name} Foods - {cls.subText}
                  </h2>
                  <p>{cls.description}</p>
                </div>

                <Row gutter={[16, 16]}>
                  {cls.categories.map((cat) => (
                    <Col xs={24} sm={12} lg={8} key={cat._id}>
                      <Card
                        className="category-card"
                        title={
                          <div className="category-title">
                            <img src={cat.classification?.icon} alt={cat.name} />
                            <span>{cat.name}</span>
                          </div>
                        }
                      >
                        <p>{cat.description}</p>
                        <div className="category-tags">
                          {cat.items.map((item) => (
                            <Tag key={item}>{item}</Tag>
                          ))}
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Tabs.TabPane>
            ))}
          </Tabs>
        )}
      </Card>
    </div>
  );
};
export default FoodClassification;
