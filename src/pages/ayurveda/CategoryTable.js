import { useEffect, useState } from 'react';

// Library Imports
import { Table, Space, Input, Popconfirm, message, Row, Col, Form, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Helper Imports
import api from '../../utils/api';

// Reusable components
import CommonButton from '../../components/CommonButton';
import CommonInput from '../../components/CommonInput';
import CommonModal from '../../components/CommonModal';
import CommonSelect from '../../components/CommonSelect';

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('edit');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await api('/ayurveda', { method: 'GET' });
      setCategories(data);
      setFilteredData(data);
    } catch (err) {
      message.error(`Failed to load categories: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = categories.filter(
      (item) => item.name.toLowerCase().includes(value) || item.description.toLowerCase().includes(value),
    );
    setFilteredData(filtered);
  };

  const openEditModal = (category) => {
    setModalMode('edit');
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      items: category.items || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api(`/ayurveda/${id}`, { method: 'DELETE' });
      message.success('Category deleted');
      fetchCategories();
    } catch (err) {
      message.error(`Failed to delete category`);
    }
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = { ...values };

      if (modalMode === 'edit') {
        await api(`/ayurveda/${editingCategory._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        message.success('Category updated');
      } else {
        await api('/ayurveda', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        message.success('Category added');
      }

      setIsModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      message.error(`Failed to ${modalMode === 'edit' ? 'update' : 'add'} category`);
    }
  };

  const columns = [
    {
      title: 'Category',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      width: '50%',
      render: (items) =>
        items.map((item, index) => (
          <Tag key={index} className="category-chip">
            {item}
          </Tag>
        )),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_, record) => (
        <Space>
          <CommonButton icon={<EditOutlined />} onClick={() => openEditModal(record)} type="default" />
          <Popconfirm
            title="Are you sure to delete this category?"
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
    <div className="category-table-wrapper">
      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col flex="auto">
          <Input
            size="large"
            placeholder="Search by category or description"
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
            onClick={() => {
              form.resetFields();
              setEditingCategory(null);
              setModalMode('add');
              setIsModalOpen(true);
            }}
            text="Add Category"
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

      <CommonModal
        title={modalMode === 'edit' ? 'Edit Category' : 'Add Category'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleModalSubmit}
        okText={modalMode === 'edit' ? 'Update' : 'Add'}
        form={form}
      >
        <CommonInput
          name="name"
          label="Category"
          placeholder="e.g. Fresh Fruits"
          rules={[{ required: true, message: 'Category name is required' }]}
        />
        <CommonInput
          name="description"
          label="Description"
          type="textarea"
          placeholder="e.g. Naturally sweet, pure energy"
          rules={[{ required: true, message: 'Description is required' }]}
        />
        <Form.Item label="Items" name="items" rules={[{ required: true, message: 'Please enter at least one item' }]}>
          <CommonSelect mode="tags" placeholder="Type and press Enter" tokenSeparators={[',']} />
        </Form.Item>
      </CommonModal>
    </div>
  );
};

export default CategoryTable;
