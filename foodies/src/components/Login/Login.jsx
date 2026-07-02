import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import {StoreContext} from '../../context/StoreContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { login } from '../../service/authService';

const Login = () => {
  const {setToken, loadCartData} = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
  email: '',
  password: ''
});
  const [showPassword, setShowPassword] = useState(false);

   const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) =>({
      ...data,
      [name]: value
    }));
   };


   const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await login(data);
        if(response.status === 200) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          await loadCartData(response.data.token);
          navigate('/');
        }else {
          toast.error('Unable to login. Please try again later.');
        }
    }catch (error) {
      // console.log(error);
      console.log('Unable to login.', error);
      toast.error('Unable to login. Please check your credentials and try again.');
    }
    console.log(data);
   };
  return (
    <div className="login-container">
    <div className="row">
      <div className="col-sm-8 col-md-6 col-lg-4 mx-auto">
        <div className="card border-0 shadow rounded-3 my-5">
          <div className="card-body p-4">
            <h5 className="card-title text-center mb-5 fw-light fs-5">Sign In</h5>
            <form onSubmit={onSubmitHandler}>
              <div className="form-floating mb-3">
                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" 
                name="email"
                onChange={onChangeHandler}
                value={data.email}
                required
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>
              
                 <div className="input-group mb-3">
  <input
    type={showPassword ? "text" : "password"}
    className="form-control"
    id="floatingPassword"
    placeholder="Password"
    name="password"
    onChange={onChangeHandler}
    value={data.password}
    required
  />

  <button
    type="button"
    className="btn btn-outline-secondary mt-1.9"
    onClick={() => setShowPassword(!showPassword) }
    style={{ fontSize: "35px" }}
  >
    {showPassword ? "🙈" : "👁️"}
  </button>

              </div> 
              
              <div className="d-grid">
                <button className="btn btn-primary btn-login text-uppercase" type="submit">Sign
                  in</button>
               
                <button className="btn btn-primary btn-login text-uppercase mt-2"
                  type="button"
                  onClick={() => {
                  setData({
                  email: "",
                  password: ""
                 });
                  setShowPassword(false);
              }}
            >
             Reset
            </button>

              </div>

              <div className="mt-4">
                Don't have an account? <Link to="/register">Sign Up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Login;

