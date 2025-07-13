import { Button } from 'antd';

const CommonButton = ({
  text,
  icon = null,
  onClick,
  type = 'primary',
  size = 'large',
  className = '',
  disabled = false,
  loading = false,
  shape = 'default',
  block = false,
  danger = false,
  htmlType,
}) => {
  return (
    <Button
      type={type}
      size={size}
      icon={icon}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      className={`common-btn ${className}`}
      shape={shape}
      block={block}
      danger={danger}
      htmlType={htmlType}
    >
      {text}
    </Button>
  );
};

export default CommonButton;
