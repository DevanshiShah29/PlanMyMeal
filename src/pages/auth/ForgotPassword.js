import { useState } from 'react';

// Library Imports
import { Row, Col, Card, Typography, Form, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

// Reusable Components
import CommonInput from '../../components/CommonInput';
import CommonButton from '../../components/CommonButton';

// Helper Imports
import api from '../../utils/api';

// Assets
import login from '../../assets/login.svg';

const { Title, Paragraph } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const handleFinish = async ({ email }) => {
    try {
      setLoading(true);
      const res = await api('/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      message.success(res.message);
      form.resetFields();
    } catch (err) {
      message.error(err.message || 'Email does not exist in our records');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="auth-wrapper" align="middle" justify="center">
      <Col xs={22} sm={20} md={16} lg={14} xl={12}>
        <Card className="login-card">
          <Row gutter={[32, 32]} align="middle" justify="center">
            <Col xs={24} md={12} className="login-illustration-section">
              <img src={login} alt="Forgot Password Illustration" />
            </Col>

            <Col xs={24} md={12}>
              <Title level={3}>Forgot Password 🔒</Title>
              <Paragraph className="auth-subtext">
                No worries! Enter your registered email and we’ll send your password.
              </Paragraph>

              <Form form={form} layout="vertical" onFinish={handleFinish} className="auth-form">
                <CommonInput
                  name="email"
                  label="Email"
                  placeholder="Enter your registered email"
                  rules={[{ required: true, message: 'Email is required' }]}
                  inputProps={{ prefix: <MailOutlined /> }}
                />

                <CommonButton text="Send Password" htmlType="submit" block className="auth-btn" loading={loading} />
              </Form>
              <Paragraph className="auth-footer-text">
                <span>Remembered your password?</span> <Link to="/login">Back to Login</Link>
              </Paragraph>

              <Paragraph className="auth-footer-text">© {new Date().getFullYear()} All Rights Reserved.</Paragraph>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
