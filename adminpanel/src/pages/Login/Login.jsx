import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Login.css';

const API_URL = 'http://localhost:8080/api';

const Login = ({ setAuth }) => {
    const [currState, setCurrState] = useState('Login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [image, setImage] = useState(false);

    const handleResendOtp = async () => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            if (image) {
                formData.append('file', image);
            }
            
            const response = await axios.post(`${API_URL}/admin/send-otp`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("OTP Resent Successfully!");
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message || error.response.data);
            } else {
                toast.error("Failed to resend OTP.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (currState === 'Sign Up') {
                // Request OTP from backend using FormData for file upload
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('password', password);
                if (image) {
                    formData.append('file', image);
                }
                
                const response = await axios.post(`${API_URL}/admin/send-otp`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success(response.data);
                setCurrState('OTP');
            } else if (currState === 'OTP') {
                // Verify OTP
                const response = await axios.post(`${API_URL}/admin/verify-signup`, { email, otp });
                toast.success(response.data);
                setCurrState('Login');
                setPassword(''); // clear password for them to login properly
            } else {
                // Login via existing backend endpoint
                const response = await axios.post(`${API_URL}/login`, { email, password });
                toast.success("Login Successful!");
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminName', response.data.name);
                localStorage.setItem('adminEmail', response.data.email || email);
                if (response.data.profilePictureUrl) {
                    localStorage.setItem('adminProfilePic', response.data.profilePictureUrl);
                } else {
                    localStorage.removeItem('adminProfilePic');
                }
                setAuth(true);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message || error.response.data);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Admin {currState}</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    {currState === 'Sign Up' && (
                        <>
                            <div className="profile-upload-container">
                                <label htmlFor="profileUpload" className="profile-upload-circle">
                                    {image ? (
                                        <img src={URL.createObjectURL(image)} alt="Profile Preview" className="profile-preview" />
                                    ) : (
                                        <div className="profile-placeholder">
                                            <i className="bi bi-camera-fill"></i>
                                            <span>Upload</span>
                                        </div>
                                    )}
                                </label>
                                <span className="text-muted mt-2" style={{ fontSize: '0.85rem', fontWeight: '500' }}>Upload Profile Picture</span>
                                <input 
                                    type="file" 
                                    id="profileUpload" 
                                    onChange={(e) => setImage(e.target.files[0])} 
                                    accept="image/*" 
                                    style={{ display: 'none' }} 
                                />
                            </div>
                            <div className="form-group floating">
                                <input type="text" id="name" placeholder=" " value={name} onChange={(e) => setName(e.target.value)} required />
                                <label htmlFor="name">Full Name</label>
                            </div>
                        </>
                    )}
                    
                    {currState !== 'OTP' && (
                        <>
                            <div className="form-group floating">
                                <input type="email" id="email" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <label htmlFor="email">Email Address</label>
                            </div>
                            <div className="form-group floating">
                                <input type={showPassword ? "text" : "password"} id="password" placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <label htmlFor="password">Password</label>
                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} password-toggle-icon`} onClick={() => setShowPassword(!showPassword)}></i>
                            </div>
                        </>
                    )}

                    {currState === 'OTP' && (
                        <>
                            <div className="form-group floating">
                                <input type="text" id="otp" placeholder=" " value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength="6" />
                                <label htmlFor="otp">6-Digit OTP</label>
                            </div>
                            <div className="text-end mb-3 mt-1">
                                <span className="text-muted" style={{fontSize: '0.85rem'}}>Didn't receive code? </span>
                                <span className="text-primary" style={{fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500', textDecoration: 'underline'}} onClick={handleResendOtp}>Resend OTP</span>
                            </div>
                        </>
                    )}

                    <button type="submit" className="login-btn">
                        {currState === 'Sign Up' ? 'Request OTP' : currState === 'OTP' ? 'Verify OTP' : 'Login'}
                    </button>
                    
                    <div className="login-toggle">
                        {currState === 'Login' ? (
                            <p>Don't have an account? <span onClick={() => setCurrState('Sign Up')}>Sign Up</span></p>
                        ) : currState === 'Sign Up' ? (
                            <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                        ) : (
                            <p>Wrong email? <span onClick={() => setCurrState('Sign Up')}>Go back</span></p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
