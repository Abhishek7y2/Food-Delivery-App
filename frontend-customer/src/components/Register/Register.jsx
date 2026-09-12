import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Login/Login.css'; // Using the premium shared Auth CSS
import { toast } from 'react-toastify';
import { registerUser, verifyOtp, resendOtp } from '../../service/authService';
import { StoreContext } from '../../context/StoreContext';

const Register = () => {
  const navigate = useNavigate();
  const { setToken, loadCartData } = useContext(StoreContext);
  
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  const onRegisterSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await registerUser(data);
      if (response.status === 201) {
        toast.success('Registration successful. Please check your email for the OTP.');
        setStep(2); // Move to OTP step
      } else {
        toast.error('Unable to Register. Please try again.');
      }
    } catch (error) {
      toast.error('Unable to register. Please try again later.');
    }
    setLoading(false);
  }

  const onOtpSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await verifyOtp({ email: data.email, otp });
      if (response.status === 200) {
        const token = response.data.token;
        toast.success('Email verified! Logging you in...');
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
  }

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
          <h1 className="auth-title">{step === 1 ? 'Create Account' : 'Verify Email'}</h1>
          <p className="auth-subtitle">
            {step === 1 ? 'Join us to order the best food in town.' : 'Enter the 6-digit code sent to your email.'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={onRegisterSubmit}>
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
              Back to Sign Up
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

export default Register;