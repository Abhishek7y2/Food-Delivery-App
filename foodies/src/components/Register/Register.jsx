import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Login/Login.css'; // Using the premium shared Auth CSS
import { toast } from 'react-toastify';
import { registerUser } from '../../service/authService';

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await registerUser(data);
      if (response.status === 201) {
        toast.success('Registration Completed. Please log in.');
        navigate('/login');
      } else {
        toast.error('Unable to Register. Please try again.');
      }
    } catch (error) {
      toast.error('Unable to register. Please try again later.');
    }
    setLoading(false);
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us to order the best food in town.</p>
        </div>

        <form onSubmit={onSubmitHandler}>
          
          <div className="auth-form-group">
            <label className="auth-label">Full Name</label>
            <input 
              type="text" 
              className="auth-input" 
              placeholder="John Doe"            
              name="name" 
              onChange={onChangeHandler}
              value={data.name}
              required
            />
          </div>

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
              placeholder="Create a password"
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
            {loading ? <span className="spinner-border spinner-border-sm"></span> : "Sign Up"}
          </button>
          
          <button 
            className="auth-btn-secondary"
            type="button"
            onClick={() => {
              setData({ name: "", email: "", password: "" });
              setShowPassword(false);
            }}
          >
            Reset Fields
          </button>

          <div className="auth-footer">
            Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
          </div>

        </form>

      </div>
    </div>
  );
}

export default Register;