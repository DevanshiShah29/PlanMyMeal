import { Form, ColorPicker } from 'antd';

const ColorPickerField = ({ name, label }) => {
  const form = Form.useFormInstance();

  const handleChange = (color) => {
    const hex = color.toHexString();
    form.setFieldsValue({ [name]: hex });
  };

  return (
    <Form.Item label={label} name={name} rules={[{ required: true, message: `${label} is required` }]}>
      <ColorPicker value={form.getFieldValue(name) || '#000000'} onChange={handleChange} showText />
    </Form.Item>
  );
};

export default ColorPickerField;
