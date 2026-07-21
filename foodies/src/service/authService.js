import apiClient from './apiClient';

export const registerUser = async (data) => {
  try {
    const response = await apiClient.post('/register', data); 
    return response;
  } catch (error) {
    throw error;
  }
};

export const login = async (data) => {  
  try {
    const response = await apiClient.post('/login', data);    
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (data) => {
  try {
    const response = await apiClient.post('/verify-otp', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const resendOtp = async (data) => {
  try {
    const response = await apiClient.post('/resend-otp', data);
    return response;
  } catch (error) {
    throw error;
  }
};
