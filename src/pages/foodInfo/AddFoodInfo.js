import { useState } from 'react';

// Library Imports
import { Card, Col, Divider, Form, Row, Typography, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// Helper Imports
import api from '../../utils/api';

// Resuable Components
import CommonButton from '../../components/CommonButton';
import GenerateWithAIButton from '../../components/GenerateWithAI';
import CommonInput from '../../components/CommonInput';

const AddFoodInfo = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { foodCards } = values;

    if (!foodCards || foodCards.length === 0) {
      return message.warning('Please add at least one food card.');
    }

    setLoading(true);
    try {
      await api('/food-info/bulk', {
        method: 'POST',
        body: JSON.stringify({ foodCards }),
      });

      message.success('Food cards added successfully!');
      navigate('/FoodInfoTable');
    } catch (err) {
      message.error('Failed to add food cards.', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateParagraph = async (index) => {
    try {
      const values = form.getFieldValue('foodCards');
      const front = values?.[index]?.frontParagraph;

      if (!front) {
        return message.warning('Please enter a front paragraph first.');
      }

      setLoadingIndex(index);

      const data = await api('/food-info/generate', {
        method: 'POST',
        body: JSON.stringify({ frontParagraph: front }),
      });

      if (data.answer) {
        const updated = [...values];
        updated[index].backParagraph = data.answer;
        form.setFieldsValue({ foodCards: updated });
      } else {
        message.error('AI failed to generate paragraph.');
      }
    } catch (err) {
      message.error('Something went wrong.', err);
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="add-food-info">
      <Card>
        <Typography.Title level={2}>Add Food Info</Typography.Title>
        <Typography.Paragraph type="secondary">
          Add multiple cards describing nutritional value of foods.
        </Typography.Paragraph>

        <Divider />

        <Form
          name="foodInfoForm"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ foodCards: [{ image: '', frontParagraph: '', backParagraph: '' }] }}
        >
          <Form.List name="foodCards">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    type="inner"
                    title={`Card #${name + 1}`}
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
                      <Col span={24}>
                        <CommonInput
                          {...restField}
                          name={[name, 'image']}
                          label="Image URL"
                          rules={[{ required: true, message: 'Enter image URL' }]}
                          placeholder="https://..."
                          onChange={(e) => {
                            const updated = [...form.getFieldValue('foodCards')];
                            updated[name].image = e.target.value;
                            form.setFieldsValue({ foodCards: updated });
                          }}
                        />

                        {form.getFieldValue('foodCards')?.[name]?.image && (
                          <img
                            src={form.getFieldValue('foodCards')[name].image}
                            alt="preview"
                            style={{ maxHeight: 120, objectFit: 'cover', borderRadius: 6, marginTop: 8 }}
                          />
                        )}
                      </Col>

                      <Col span={24}>
                        <CommonInput
                          {...restField}
                          name={[name, 'frontParagraph']}
                          label="Front"
                          rules={[{ required: true, message: 'Enter front paragraph' }]}
                          placeholder="e.g. Do you know how much value one apple adds?"
                        />
                      </Col>
                      <Col span={24}>
                        <CommonInput
                          type="textarea"
                          {...restField}
                          name={[name, 'backParagraph']}
                          label="Back"
                          placeholder="e.g. Apples are a nutritional powerhouse..."
                          rules={[{ required: true, message: 'Enter back paragraph' }]}
                          autoSize={{ minRows: 3, maxRows: 6 }}
                        />
                      </Col>
                      <GenerateWithAIButton
                        onGenerate={() => handleGenerateParagraph(name)}
                        loading={loadingIndex === name}
                      />
                    </Row>
                  </Card>
                ))}

                <Form.Item>
                  <CommonButton type="dashed" icon={<PlusOutlined />} onClick={() => add()} block text="Add new card" />
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider />

          <Row justify="end" gutter={12}>
            <Col>
              <CommonButton type="default" onClick={() => navigate('/FoodInfoTable')} text="Cancel" />
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

export default AddFoodInfo;
