import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { StoreContext } from '../../context/StoreContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { login } from '../../service/authService';

const Login = () => {
  const { setToken, loadCartData } = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({
      ...data,
      [name]: value
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await login(data);
      if (response.status === 200) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        await loadCartData(response.data.token);
        navigate('/');
      } else {
        toast.error('Unable to login. Please try again later.');
      }
    } catch (error) {
      console.log('Unable to login.', error);
      toast.error('Unable to login. Please check your credentials and try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to access your delicious favorites.</p>
        </div>

        <form onSubmit={onSubmitHandler}>
          
          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <input 
              type="email" 
              className="auth-input" 
              placeholder="name@example.com" 
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              required
            />
          </div>
          
          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="auth-input"
              placeholder="Enter your password"
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
            </button>
          </div>
          
          <button className="auth-btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm"></span> : "Sign In"}
          </button>
          
          <button 
            className="auth-btn-secondary"
            type="button"
            onClick={() => {
              setData({ email: "", password: "" });
              setShowPassword(false);
            }}
          >
            Reset Fields
          </button>

          <div className="auth-footer">
            Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link>
          </div>

        </form>

      </div>
    </div>
  );
}

export default Login;

