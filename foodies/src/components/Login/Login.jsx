import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { StoreContext } from '../../context/StoreContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { login, verifyOtp, resendOtp } from '../../service/authService';

const Login = () => {
  const { setToken, loadCartData } = useContext(StoreContext);
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  
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
        if (response.data.requiresOtp) {
          toast.success(response.data.message || 'OTP sent to your email.');
          setStep(2);
        } else {
          // Fallback if OTP is disabled or skipped
          setToken(response.data.token || response.data.jwtToken);
          localStorage.setItem('token', response.data.token || response.data.jwtToken);
          await loadCartData();
          navigate('/');
        }
      } else {
        toast.error('Unable to login. Please try again later.');
      }
    } catch (error) {
      console.log('Unable to login.', error);
      toast.error('Unable to login. Please check your credentials and try again.');
    }
    setLoading(false);
  };
  
  const onOtpSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await verifyOtp({ email: data.email, otp });
      if (response.status === 200) {
        const token = response.data.token;
        toast.success('Login successful!');
        setToken(token);
        localStorage.setItem("token", token);
        await loadCartData();
        navigate('/');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    }
    setLoading(false);
  };

  const onResendOtp = async () => {
    setLoading(true);
    try {
      const response = await resendOtp({ email: data.email });
      if (response.status === 200) {
        toast.success(response.data.message || 'OTP resent successfully!');
        setOtp('');
      } else {
        toast.error('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        
        <div className="auth-header">
          <h1 className="auth-title">{step === 1 ? 'Welcome Back' : 'Verify Email'}</h1>
          <p className="auth-subtitle">
            {step === 1 ? 'Log in to access your delicious favorites.' : 'Enter the 6-digit code sent to your email.'}
          </p>
        </div>

        {step === 1 ? (
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
        ) : (
          <form onSubmit={onOtpSubmit}>
            <div className="auth-form-group">
              <label className="auth-label">6-Digit OTP</label>
              <input 
                type="text" 
                className="auth-input" 
                placeholder="123456"            
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength="6"
                required
                style={{ textAlign: 'center', letterSpacing: '5px', fontSize: '1.5rem', fontWeight: 'bold' }}
              />
            </div>
            
            <button className="auth-btn-primary" type="submit" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm"></span> : "Verify OTP"}
            </button>

            <button 
              className="auth-btn-secondary"
              type="button"
              onClick={onResendOtp}
              disabled={loading}
              style={{ marginTop: '10px' }}
            >
              Resend OTP
            </button>

            <button 
              className="auth-btn-secondary"
              type="button"
              onClick={() => setStep(1)}
              disabled={loading}
              style={{ marginTop: '10px' }}
            >
              Back to Login
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

export default Login;

