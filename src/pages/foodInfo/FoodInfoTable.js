import { useEffect, useState } from 'react';

// Library Imports
import { Table, Input, Space, Typography, Popconfirm, message, Row, Col, Card, Form } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// Helper Imports
import api from '../../utils/api';

// Resuable Components
import CommonButton from '../../components/CommonButton';
import CommonInput from '../../components/CommonInput';
import CommonModal from '../../components/CommonModal';
import MemoizedImage from '../../components/MemoizedImage';

const FoodInfoTable = () => {
  const [foods, setFoods] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  useEffect(() => {
    fetchFoodInfo();
  }, []);

  const openEditModal = (food) => {
    setEditingFood(food);
    form.setFieldsValue({
      image: food.image,
      frontParagraph: food.frontParagraph,
      backParagraph: food.backParagraph,
    });
    setIsModalOpen(true);
  };

  const handleUpdateFood = async () => {
    try {
      const values = await form.validateFields();

      await api(`/food-info/${editingFood._id}`, {
        method: 'PUT',
        body: JSON.stringify(values),
      });

      message.success('Food info updated');
      setIsModalOpen(false);
      setEditingFood(null);
      fetchFoodInfo();
    } catch (err) {
      message.error('Failed to update');
    }
  };

  const fetchFoodInfo = async () => {
    setLoading(true);
    try {
      const data = await api('/food-info', {
        method: 'GET',
      });
      setFoods(data);
      setFilteredData(data);
    } catch (err) {
      message.error(`Failed to load ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = foods.filter((item) =>
      [item.frontParagraph, item.backParagraph].filter(Boolean).some((field) => field.toLowerCase().includes(value)),
    );
    setFilteredData(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await api(`/food-info/${id}`, {
        method: 'DELETE',
      });
      message.success('Food info deleted');
      fetchFoodInfo();
    } catch (err) {
      message.error(`Failed to delete ${err}`);
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: '10%',
      render: (url) => <MemoizedImage src={url} alt="food" className="recipe-img" />,
    },
    {
      title: 'Front',
      dataIndex: 'frontParagraph',
      key: 'frontParagraph',
      width: '35%',
      // ellipsis: true,
      sorter: (a, b) => a.frontParagraph.localeCompare(b.frontParagraph),
    },
    {
      title: 'Back',
      dataIndex: 'backParagraph',
      key: 'backParagraph',
      width: '45%',
      // ellipsis: true,
      sorter: (a, b) => a.backParagraph.localeCompare(b.backParagraph),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_, record) => (
        <Space>
          <CommonButton icon={<EditOutlined />} onClick={() => openEditModal(record)} type="default" />
          <Popconfirm
            title="Are you sure you want to delete this food info?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <CommonButton danger icon={<DeleteOutlined />} type="default" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="food-info-table-wrapper">
        <Typography.Title level={2} className="table-heading">
          Info Management
        </Typography.Title>
        <Typography.Text type="secondary">Manage all nutritional info cards in your database</Typography.Text>

        <Card style={{ marginTop: 24 }}>
          <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ margin: '0px -8px 24px' }}>
            <Col flex="auto">
              <Input
                size="large"
                placeholder="Search by front or back paragraph"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={handleSearch}
                allowClear
              />
            </Col>
            <Col>
              <CommonButton
                size="large"
                icon={<PlusOutlined />}
                text="Add"
                onClick={() => navigate('/add-food-info')}
              />
            </Col>
          </Row>

          <Table
            loading={loading}
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => record._id}
            pagination={{ pageSize: 5 }}
            bordered={false}
            scroll={{ x: true }}
          />
        </Card>
      </div>

      <CommonModal
        title="Edit Nutritional Food Info"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpdateFood}
        okText="Update"
        form={form}
      >
        <CommonInput
          name="image"
          label="Image URL"
          rules={[{ required: true, message: 'Please enter an image URL' }]}
        />
        <CommonInput
          name="frontParagraph"
          label="Front Paragraph"
          rules={[{ required: true, message: 'Please enter the front paragraph' }]}
        />
        <CommonInput
          name="backParagraph"
          label="Back Paragraph"
          rules={[{ required: true, message: 'Please enter the back paragraph' }]}
          type="textarea"
          rows={4}
        />
      </CommonModal>
    </>
  );
};

export default FoodInfoTable;
