import { Modal, Form } from 'antd';
import CommonButton from './CommonButton';

const CommonModal = ({
  title,
  open,
  onCancel,
  onOk,
  okText = 'Submit',
  cancelText = 'Cancel',
  form = null,
  children,
  customFooter = false,
  ...modalProps
}) => {
  const defaultFooter = [
    <CommonButton type="default" className="common-btn secondary" onClick={onCancel} text={cancelText} />,
    <CommonButton type="primary" htmlType="submit" className="common-btn primary" onClick={onOk} text={okText} />,
  ];

  return (
    <Modal title={title} open={open} onCancel={onCancel} footer={customFooter ? null : defaultFooter} {...modalProps}>
      {form ? (
        <Form form={form} layout="vertical">
          {children}
        </Form>
      ) : (
        children
      )}
    </Modal>
  );
};

export default CommonModal;
