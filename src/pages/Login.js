import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      (e.target.username.value === 'Ninad' && e.target.password.value === 'Ninad3110') ||
      (e.target.username.value === 'Devanshi' && e.target.password.value === 'Devanshi2901')
    ) {
      const base64Encoded = btoa(e.target.username.value);
      localStorage.setItem('authentication', base64Encoded);
      navigate('/');
      toast.success('Login successfully!');
    } else {
      toast.error('Incorrect credentials!');
    }
  };
  return (
    <div className="container" id="loginWrapper">
      <div className="form-container" id="login-form">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
