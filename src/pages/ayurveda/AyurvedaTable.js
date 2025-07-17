// Library  Imports
import { Typography, Card, Tabs } from 'antd';
import CategoryTable from './CategoryTable';
import ClassificationTable from './ClassificationTable';

const AyurvedaCategoryTable = () => {
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
      <div className="ayurveda-category-wrapper">
        <Typography.Title level={2} className="table-heading">
          Ayurveda
        </Typography.Title>
        <Typography.Text type="secondary">Manage all Ayurvedic categories</Typography.Text>

        <Card style={{ marginTop: 24 }}>
          <Tabs defaultActiveKey="1" items={items} />
        </Card>
      </div>
    </>
  );
};

export default AyurvedaCategoryTable;
