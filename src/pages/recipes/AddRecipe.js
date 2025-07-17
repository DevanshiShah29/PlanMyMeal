import { useEffect, useState } from 'react';

// Library Imports
import { Form, Select, Card, Row, Col, message } from 'antd';
import { FireFilled, CheckCircleFilled } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

// Constant Imports
import { recipeTypes, cookingTimes, difficultyLevels, nutritionFields } from '../../constant/Dropdowns';

// Helper Imports
import api from '../../utils/api';

// Resuable Components
import CommonButton from '../../components/CommonButton';
import CommonInput from '../../components/CommonInput';
import CommonSelect from '../../components/CommonSelect';

const AddRecipe = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipeById = async (recipeId) => {
      try {
        setLoading(true);
        const data = await api(`/recipes/${recipeId}`, {
          method: 'GET',
        });
        form.setFieldsValue(data);
        setIsEditMode(true);
      } catch (error) {
        message.error(`Failed to load ${error}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipeById(id);
    }
  }, [id, form]);

  const onFinish = async (values) => {
    try {
      const url = id ? `/recipes/${id}` : '/recipes';
      const method = id ? 'PUT' : 'POST';

      await api(url, {
        method,
        body: JSON.stringify(values),
      });

      message.success(`Recipe ${id ? 'updated' : 'created'} successfully!`);
      navigate('/recipes');
      form.resetFields();
    } catch (error) {
      message.error(`Something went wrong ${error}`);
    }
  };

  return (
    <div className="add-recipe-page">
      <h1 className="pageDescription"> {isEditMode ? 'Edit Recipe' : 'Create New Recipe'}</h1>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* BASIC INFO */}
        <Card
          className="card-section"
          title={
            <div className="card-header orange-header">
              <FireFilled />
              Basic Information
            </div>
          }
        >
          <Row gutter={16}>
            <Col span={12}>
              <CommonInput
                name="name"
                label="Recipe Name"
                rules={[{ required: true, message: 'Please enter a recipe name' }]}
                placeholder="Enter recipe name..."
              />
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Recipe Type"
                rules={[{ required: true, message: 'Please select a recipe type' }]}
              >
                <CommonSelect
                  placeholder="Select recipe type"
                  options={recipeTypes.map((type) => ({
                    value: type,
                    label: type,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <CommonInput
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
            rows={3}
            type="textarea"
            placeholder="Describe your recipe..."
          />

          <CommonInput
            name="image"
            label="Image URL"
            rules={[{ required: true, message: 'Enter a valid image URL' }]}
            placeholder="https://example.com/image.jpg"
          />

          <CommonInput name="youtubeLink" label="Youtube URL" placeholder="https://youtube.com/watch?v=example" />
        </Card>

        {/* RECIPE DETAILS */}
        <Card
          className="card-section"
          title={
            <div className="card-header green-header">
              <CheckCircleFilled />
              Recipe Details
            </div>
          }
        >
          <CommonInput
            name="ingredients"
            label="Ingredients"
            rules={[{ required: true, message: 'Please list ingredients' }]}
            rows={4}
            type="textarea"
            placeholder="List ingredients (one per line)..."
          />

          <CommonInput
            name="instructions"
            label="Instructions"
            rules={[{ required: true, message: 'Please enter instructions' }]}
            rows={5}
            type="textarea"
            placeholder="Step-by-step cooking instructions..."
          />
        </Card>

        {/* COOKING DETAILS */}
        <Card className="card-section" title={<div className="card-header blue-header">⏱️ Cooking Details</div>}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="time"
                label="Cooking Time"
                rules={[{ required: true, message: 'Please select cooking time' }]}
              >
                <CommonSelect
                  placeholder="Select cooking time"
                  options={cookingTimes.map((type) => ({
                    value: type,
                    label: type,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level"
                label="Difficulty Level"
                rules={[{ required: true, message: 'Please select difficulty' }]}
              >
                <CommonSelect
                  placeholder="Select level"
                  options={difficultyLevels.map((type) => ({
                    value: type,
                    label: type,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* NUTRITION */}
        <Card
          className="card-section"
          title={<div className="card-header purple-header">🍎 Nutritional Information</div>}
        >
          <Row gutter={16}>
            {nutritionFields.map((field) => (
              <Col xs={24} sm={12} md={8} key={field.name}>
                <CommonInput name={field.name} label={field.label} placeholder={field.placeholder} />
              </Col>
            ))}
          </Row>
        </Card>

        {/* SUBMIT */}

        <div className="submit-button">
          <CommonButton type="default" onClick={() => navigate('/recipes')} text="Cancel" />

          <CommonButton
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            text={isEditMode ? 'Update Recipe' : 'Submit Recipe'}
          />
        </div>
      </Form>
    </div>
  );
};

export default AddRecipe;
