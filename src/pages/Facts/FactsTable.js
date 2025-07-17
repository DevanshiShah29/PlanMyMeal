import { useEffect, useState } from 'react';

// Library Imports
import { Table, Space, Input, Typography, Popconfirm, message, Row, Col, Card, Form } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// Helper Imports
import api from '../../utils/api';

// Resuable Components
import CommonButton from '../../components/CommonButton';
import CommonInput from '../../components/CommonInput';
import CommonModal from '../../components/CommonModal';

const FactTable = () => {
  const [facts, setFacts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingFact, setEditingFact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  useEffect(() => {
    fetchFacts();
  }, []);

  const openEditModal = (fact) => {
    setEditingFact(fact);
    form.setFieldsValue({
      question: fact.question,
      answer: fact.answer,
    });
    setIsModalOpen(true);
  };

  const handleUpdateFact = async () => {
    try {
      const values = await form.validateFields();

      await api(`/facts/${editingFact._id}`, {
        method: 'PUT',
        body: JSON.stringify(values),
      });

      message.success('Fact updated');
      setIsModalOpen(false);
      setEditingFact(null);
      fetchFacts();
    } catch (err) {
      message.error('Failed to update');
    }
  };

  const fetchFacts = async () => {
    setLoading(true);
    try {
      const data = await api('/facts', {
        method: 'GET',
      });
      setFacts(data);
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
    const filtered = facts.filter((item) =>
      [item.question, item.answer].filter(Boolean).some((field) => field.toLowerCase().includes(value)),
    );
    setFilteredData(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await api(`/facts/${id}`, {
        method: 'DELETE',
      });
      message.success('Fact deleted');
      fetchFacts();
    } catch (err) {
      message.error(`Failed to delete ${err}`);
    }
  };

  const columns = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      width: 400,
      sorter: (a, b) => a.question.localeCompare(b.question),
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
      sorter: (a, b) => a.answer.localeCompare(b.answer),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <CommonButton icon={<EditOutlined />} onClick={() => openEditModal(record)} type="default" />

          <Popconfirm
            title="Are you sure to delete this fact?"
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
      <div className="fact-table-wrapper">
        <Typography.Title level={2} className="table-heading">
          Fact Management
        </Typography.Title>
        <Typography.Text type="secondary">Manage all facts in your database</Typography.Text>

        <Card style={{ marginTop: 24 }}>
          <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ margin: '0px -8px 24px' }}>
            <Col flex="auto">
              <Input
                size="large"
                placeholder="Search by question or answer"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={handleSearch}
                allowClear
              />
            </Col>
            <Col>
              <CommonButton
                size="large"
                className="add-fact-btn"
                icon={<PlusOutlined />}
                onClick={() => navigate('/add-fact')}
                text="Add Fact"
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
            style={{ width: '100%' }}
          />
        </Card>
      </div>
      <CommonModal
        title="Edit Fact"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpdateFact}
        okText="Update"
        form={form}
      >
        <CommonInput
          name="question"
          label="Question"
          rules={[{ required: true, message: 'Please enter a question' }]}
          placeholder="e.g. What is the perfect plate?"
        />
        <CommonInput
          name="answer"
          label="Answer"
          type="textarea"
          placeholder="e.g. Plate of food with fruits and vegetables..."
          autoSize={{ minRows: 3, maxRows: 6 }}
          rules={[{ required: true, message: 'Please enter an answer' }]}
        />
      </CommonModal>
    </>
  );
};

export default FactTable;
