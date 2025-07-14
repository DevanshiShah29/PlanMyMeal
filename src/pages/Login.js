// Library Imports
import { Row, Col, Card, Typography, Form } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Reusable Components
import CommonInput from '../components/CommonInput';
import CommonButton from '../components/CommonButton';

// Helper Imports
import api from '../utils/api';

// Assets
import login from '../assets/login.svg';

const { Title, Paragraph } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleFinish = async ({ username, password }) => {
    try {
      const res = await api('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      if (!res.token) throw new Error('No token');

      localStorage.setItem('token', res.token);
      localStorage.setItem('role', res.role);
      localStorage.setItem('username', res.username);

      toast.success('Login successful!');
      navigate(res.role === 'admin' ? '/recipes' : '/');
    } catch (err) {
      console.error(err);
      toast.error('Login failed!');
    }
  };

  return (
    <Row className="auth-wrapper" align="middle" justify="center">
      <Col xs={22} sm={20} md={16} lg={14} xl={12}>
        <Card className="login-card">
          <Row gutter={[32, 32]} align="middle" justify="center">
            <Col xs={24} md={12} className="login-illustration-section">
              <img src={login} alt="Login Illustration" />
            </Col>

            <Col xs={24} md={12}>
              <Title level={3}>Welcome back! 👋</Title>

              <Paragraph className="auth-subtext">
                Store, manage, and explore delicious recipes with ease. Let’s get cooking!
              </Paragraph>

              <Form form={form} layout="vertical" onFinish={handleFinish} className="auth-form">
                <CommonInput
                  name="username"
                  label="Username"
                  placeholder="Enter your username"
                  rules={[{ required: true, message: 'Username is required' }]}
                  inputProps={{ prefix: <UserOutlined /> }}
                />

                <CommonInput
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  rules={[{ required: true, message: 'Password is required' }]}
                  inputProps={{ prefix: <LockOutlined /> }}
                />

                <Paragraph className="auth-forgot">
                  <a onClick={() => navigate('/forgot-password')}>Forgot password?</a>
                </Paragraph>

                <CommonButton text="Login" htmlType="submit" block />
              </Form>

              <Paragraph className="auth-footer-text">© {new Date().getFullYear()} All Rights Reserved.</Paragraph>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
