import { useState } from 'react';

// Library Imports
import { Card, Col, Divider, Form, Row, Typography, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// Helper Imports
import api from '../../utils/api';

// Resuable Components
import GenerateWithAIButton from '../../components/GenerateWithAI';
import CommonButton from '../../components/CommonButton';
import CommonInput from '../../components/CommonInput';

const AddFact = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);

  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { facts } = values;
    if (!facts || facts.length === 0) {
      return message.warning('Please add at least one fact.');
    }

    setLoading(true);
    try {
      await api('/facts/bulk', {
        method: 'POST',
        body: JSON.stringify({ facts }),
      });
      message.success('Facts added successfully!');
      navigate('/factsTable');
    } catch (err) {
      message.error(`Failed to add: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnswer = async (index) => {
    try {
      const values = form.getFieldValue('facts');
      const question = values?.[index]?.question;

      if (!question) {
        message.warning('Please enter a question first.');
        return;
      }

      setLoadingIndex(index);

      const data = await api('/facts/generate', {
        method: 'POST',
        body: JSON.stringify({ question }),
      });

      if (data.answer) {
        const updatedFacts = [...values];
        updatedFacts[index].answer = data.answer;
        form.setFieldsValue({ facts: updatedFacts });
      } else {
        message.error('Failed to generate answer');
      }
    } catch (err) {
      message.error(`Something went wrong ${err}`);
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="add-fact-container">
      <Card>
        <Typography.Title level={2}>Add Multiple Facts</Typography.Title>
        <Typography.Paragraph type="secondary">
          Create multiple question-answer pairs and submit them together.
        </Typography.Paragraph>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            facts: [{ question: '', answer: '' }],
          }}
        >
          <Form.List name="facts">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    type="inner"
                    title={`Fact #${name + 1}`}
                    style={{ marginBottom: 16 }}
                    extra={
                      <CommonButton
                        type="text"
                        danger
                        icon={<MinusCircleOutlined style={{ fontSize: 20 }} />}
                        onClick={() => remove(name)}
                      />
                    }
                  >
                    <Row gutter={16}>
                      <Col xs={24} md={24}>
                        <CommonInput
                          {...restField}
                          name={[name, 'question']}
                          label="Question"
                          placeholder="e.g. What is the perfect plate?"
                          rules={[{ required: true, message: 'Please enter a question' }]}
                        />
                      </Col>
                      <Col xs={24} md={24}>
                        <CommonInput
                          {...restField}
                          type="textarea"
                          name={[name, 'answer']}
                          label="Answer"
                          placeholder="e.g. Plate of food with fruits and vegetables..."
                          autoSize={{ minRows: 3, maxRows: 6 }}
                          rules={[{ required: true, message: 'Please enter an answer' }]}
                        />
                      </Col>
                      <GenerateWithAIButton
                        onGenerate={() => handleGenerateAnswer(name)}
                        loading={loadingIndex === name}
                      />
                    </Row>
                  </Card>
                ))}

                <Form.Item>
                  <CommonButton type="dashed" icon={<PlusOutlined />} onClick={() => add()} block text="Add new fact" />
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider />

          <Row justify="end" gutter={12}>
            <Col>
              <CommonButton type="default" onClick={() => navigate('/factsTable')} text="Cancel" />
            </Col>
            <Col>
              <CommonButton type="primary" htmlType="submit" loading={loading} text="Submit" />
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default AddFact;
