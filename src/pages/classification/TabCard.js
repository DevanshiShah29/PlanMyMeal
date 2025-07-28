// Library  Imports
import { Typography, Card, Tabs } from 'antd';
import CategoryTable from './CategoryTable';
import ClassificationTable from './ClassificationTable';

const FoodCategoryTable = () => {
  const items = [
    {
      label: 'Classifications',
      key: '1',
      children: <ClassificationTable />,
    },
    {
      label: 'Categories',
      key: '2',
      children: <CategoryTable />,
    },
  ];
  return (
    <>
      <div className="category-wrapper">
        <Typography.Title level={2} className="table-heading">
          Food Categories
        </Typography.Title>
        <Typography.Text type="secondary">Food’s Energetic Qualities</Typography.Text>

        <Card style={{ marginTop: 24 }}>
          <Tabs defaultActiveKey="1" items={items} />
        </Card>
      </div>
    </>
  );
};

export default FoodCategoryTable;
