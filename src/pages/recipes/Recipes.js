import { useEffect, useState } from 'react';

// Library Imports
import { Table, Input, Space, Typography, Popconfirm, message, Row, Col, Card } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// Resusable Components
import MemoizedImage from '../../components/MemoizedImage';
import CommonButton from '../../components/CommonButton';

// Helper Imports
import api from '../../utils/api';

const RecipeTable = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await api('/recipes', {
        method: 'GET',
      });
      setRecipes(data);
      setFilteredData(data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      message.error('Failed to load recipes.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = recipes.filter((item) =>
      [item.name, item.type, item.difficulty].filter(Boolean).some((field) => field.toLowerCase().includes(value)),
    );
    setFilteredData(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await api(`/recipes/${id}`, {
        method: 'DELETE',
      });
      message.success('Recipe deleted');
      fetchRecipes();
    } catch (err) {
      console.error('Delete failed:', err);
      message.error('Failed to delete recipe');
    }
  };

  const columns = [
    {
      title: 'Recipe',
      key: 'recipe',
      width: 220,
      render: (_, record) => (
        <div className="recipe-row">
          <MemoizedImage src={record.image} alt={record.name} className="recipe-img" />
          <span>{record.name}</span>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      sorter: (a, b) => a.type?.localeCompare(b.type),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      sorter: (a, b) => a.difficulty?.localeCompare(b.difficulty),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: 100,
      sorter: (a, b) => {
        const getMins = (t) => {
          if (!t) return 0;
          if (t.includes('hour')) return parseInt(t) * 60;
          if (t.includes('min')) return parseInt(t);
          return 0;
        };
        return getMins(a.time) - getMins(b.time);
      },
    },
    {
      title: 'Calories',
      dataIndex: 'calories',
      key: 'calories',
      width: 100,
      sorter: (a, b) => parseInt(a.calories || 0) - parseInt(b.calories || 0),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <CommonButton type="default" icon={<EditOutlined />} onClick={() => navigate(`/edit/${record._id}`)} />
          <Popconfirm
            title="Are you sure to delete this recipe?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <CommonButton type="default" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="recipe-table-wrapper">
      <Typography.Title level={2} className="table-heading">
        Recipe Management
      </Typography.Title>
      <Typography.Text type="secondary">Manage all recipes in your database</Typography.Text>

      <Row gutter={[16, 16]} style={{ margin: '24px -8px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Typography.Title level={5} style={{ marginBottom: 4 }}>
              Total Recipes
            </Typography.Title>
            <Typography.Text strong>{filteredData.length}</Typography.Text>
          </Card>
        </Col>

        <Col xs={24} sm={6}>
          <Card>
            <Typography.Title level={5} style={{ marginBottom: 4 }}>
              Average Calories
            </Typography.Title>
            <Typography.Text strong>
              {Math.round(
                filteredData.reduce((sum, r) => sum + (parseInt(r.calories) || 0), 0) / (filteredData.length || 1),
              )}{' '}
              kcal
            </Typography.Text>
          </Card>
        </Col>

        <Col xs={24} sm={6}>
          <Card>
            <Typography.Title level={5} style={{ marginBottom: 4 }}>
              Most Common Type
            </Typography.Title>
            <Typography.Text strong>
              {(() => {
                const count = {};
                filteredData.forEach((r) => {
                  if (r.type) count[r.type] = (count[r.type] || 0) + 1;
                });
                const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
                return sorted[0]?.[0] || '—';
              })()}
            </Typography.Text>
          </Card>
        </Col>

        <Col xs={24} sm={6}>
          <Card>
            <Typography.Title level={5} style={{ marginBottom: 4 }}>
              Average Preparation Time
            </Typography.Title>
            <Typography.Text strong>
              {(() => {
                const totalMins = filteredData.reduce((sum, r) => {
                  const time = r.time ? r.time.match(/(\d+)\s*(hour|min)/) : null;
                  if (time) {
                    return sum + (time[2] === 'hour' ? parseInt(time[1]) * 60 : parseInt(time[1]));
                  }
                  return sum;
                }, 0);

                const avgMins = filteredData.length ? Math.round(totalMins / filteredData.length) : 0;
                return `${avgMins} mins`;
              })()}
            </Typography.Text>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col flex="auto">
            <Input
              size="large"
              placeholder="Search by name, type or level"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              allowClear
            />
          </Col>
          <Col>
            <CommonButton
              size="large"
              className="add-recipe-btn"
              icon={<PlusOutlined />}
              onClick={() => navigate('/add-recipe')}
              text="Add Recipe"
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
        />
      </Card>
    </div>
  );
};

export default RecipeTable;
