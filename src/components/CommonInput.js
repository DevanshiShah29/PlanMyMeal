import { Form, Input } from 'antd';

const { TextArea } = Input;

/**
 * CommonInputBox Component
 *
 * Props:
 * - name: string (required) – form field name
 * - label: string – label to show above input
 * - placeholder: string
 * - rules: array – validation rules
 * - type: 'text' | 'textarea'
 * - inputProps: object – additional props passed to Input/TextArea
 */
const CommonInput = ({ name, label, placeholder = '', rules = [], type = 'text', inputProps = {}, onChange }) => {
  return (
    <Form.Item name={name} label={label} rules={rules}>
      {type === 'textarea' ? (
        <TextArea
          className="common-input"
          placeholder={placeholder}
          autoSize={{ minRows: 3, maxRows: 6 }}
          onChange={onChange}
          {...inputProps}
        />
      ) : (
        <Input className="common-input" placeholder={placeholder} onChange={onChange} type={type} {...inputProps} />
      )}
    </Form.Item>
  );
};

export default CommonInput;
