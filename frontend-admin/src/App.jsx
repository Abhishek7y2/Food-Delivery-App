import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import Orders from './pages/Orders/Orders';
import ListFood from './pages/ListFood/ListFood';
import AddFood from './pages/AddFood/AddFood';
import Login from './pages/Login/Login';
import Sidebar from './components/Sidebar/Sidebar';
import Menubar from './components/Menubar/Menubar';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  }

  // If not authenticated, render only the Login screen
  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer />
        <Login setAuth={setIsAuthenticated} />
      </>
    );
  }

  return (
    <div className="d-flex" id="wrapper">
      {/* <!-- Sidebar--> */}
      <Sidebar sidebarVisible={sidebarVisible}/>
      
      <div id="page-content-wrapper">
        {/* <!-- Top navigation--> */}
        <Menubar toggleSidebar={toggleSidebar} />
        <ToastContainer />

        <div className="container-fluid">
          <Routes>
            <Route path='/add' element={<AddFood />} />
            <Route path='/list' element={<ListFood />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/' element={<Orders />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App;