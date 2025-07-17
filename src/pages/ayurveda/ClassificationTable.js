import { useEffect, useState } from 'react';

// Library Imports
import { Table, Space, Input, Popconfirm, message, Row, Col, Form } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Helper function
import api from '../../utils/api';

// Reusable Components
import CommonButton from '../../components/CommonButton';
import CommonInput from '../../components/CommonInput';
import CommonModal from '../../components/CommonModal';
import ColorPickerField from '../../components/ColorPickerField';
import ImageUploader from '../../components/FileUpload';

const ClassificationTable = () => {
  const [classifications, setClassifications] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iconFile, setIconFile] = useState(null);

  const [modalMode, setModalMode] = useState('edit');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchClassifications();
  }, []);

  const fetchClassifications = async () => {
    setLoading(true);
    try {
      const data = await api('/classification', { method: 'GET' });
      setClassifications(data);
      setFilteredData(data);
    } catch (err) {
      message.error(`Failed to load classifications: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = classifications.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.description.toLowerCase().includes(value) ||
        item.subText.toLowerCase().includes(value),
    );
    setFilteredData(filtered);
  };
  const openEditModal = (record) => {
    form.setFieldsValue({
      ...record,
      color: record.color,
      bgColor: record.bgColor,
    });
    setEditing(record);
    setModalMode('edit');
    setIsModalOpen(true);
  };
  const handleDelete = async (id) => {
    try {
      await api(`/classification/${id}`, { method: 'DELETE' });
      message.success('Classification deleted');
      fetchClassifications();
    } catch (err) {
      message.error('Failed to delete classification');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();

      if (iconFile) {
        formData.append('icon', iconFile);
      }

      Object.entries(values).forEach(([key, val]) => {
        formData.append(key, val);
      });

      const endpoint = modalMode === 'edit' ? `/classification/${editing._id}` : '/classification';

      await api(endpoint, {
        method: modalMode === 'edit' ? 'PUT' : 'POST',
        body: formData,
      });

      message.success(`Classification ${modalMode === 'edit' ? 'updated' : 'added'} successfully`);
      setIsModalOpen(false);
      setEditing(null);
      setIconFile(null);
      fetchClassifications();
    } catch (err) {
      message.error(`Failed to ${modalMode === 'edit' ? 'update' : 'add'} classification`);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      sorter: (a, b) => a.name.localeCompare(b.name),
      // filters: classificationOptions.map((val) => ({ text: val, value: val })),
      // onFilter: (value, record) => record.name === value,
      render: (_, record) => (
        <div
          className="classification-chip"
          style={{
            backgroundColor: record.bgColor,
            color: record.color,
          }}
        >
          {record.icon && <img src={record.icon} alt="icon" className="classification-chip__icon" />}
          {record.name}
        </div>
      ),
    },
    {
      title: 'Sub Text',
      dataIndex: 'subText',
      key: 'subText',
      width: 200,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <CommonButton icon={<EditOutlined />} type="default" onClick={() => openEditModal(record)} />
          <Popconfirm
            title="Are you sure to delete this classification?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <CommonButton danger type="default" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="classification-table-wrapper">
      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col flex="auto">
          <Input
            size="large"
            placeholder="Search by name, sub text or description"
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
              setEditing(null);
              setModalMode('add');
              setIsModalOpen(true);
            }}
            text="Add Classification"
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

      <CommonModal
        title={modalMode === 'edit' ? 'Edit Classification' : 'Add Classification'}
        open={isModalOpen}
        onCancel={() => handleCancel()}
        onOk={handleModalSubmit}
        okText={modalMode === 'edit' ? 'Update' : 'Add'}
        form={form}
        width={700}
      >
        <CommonInput
          name="name"
          label="Classification Type"
          placeholder="Name"
          rules={[{ required: true, message: 'Name is required' }]}
        />
        <CommonInput
          name="subText"
          label="Sub Text"
          placeholder="e.g. Pure, balanced, light"
          rules={[{ required: true, message: 'Sub text is required' }]}
        />
        <CommonInput
          name="description"
          label="Description"
          type="textarea"
          placeholder="Detailed description of this classification"
          rules={[{ required: true, message: 'Description is required' }]}
        />
        <Row gutter={16}>
          <Col span={12}>
            <ColorPickerField name="color" label="Text Color" />
          </Col>
          <Col span={12}>
            <ColorPickerField name="bgColor" label="Background Color" />
          </Col>
        </Row>

        <Form.Item label="Classification Icon">
          <ImageUploader
            file={iconFile}
            setFile={setIconFile}
            existingImage={editing?.icon}
            label="Upload Icon"
            previewWidth={80}
            previewHeight={80}
            helpText="JPG or PNG, max 5MB"
            accept="image/jpeg,image/png"
            maxSizeMB={5}
          />
        </Form.Item>
      </CommonModal>
    </div>
  );
};

export default ClassificationTable;
