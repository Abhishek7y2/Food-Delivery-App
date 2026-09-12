import React, { useState, useEffect } from 'react'
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

function Menubar({toggleSidebar}) {
  const adminName = localStorage.getItem('adminName') || 'Admin User';
  const adminEmail = localStorage.getItem('adminEmail') || 'admin@foodies.com'; // or decode from token if email isn't in localStorage
  const adminProfilePic = localStorage.getItem('adminProfilePic');

  const [dateTime, setDateTime] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [previousCount, setPreviousCount] = useState(parseInt(localStorage.getItem('orderCount')) || 0);
  const [newOrders, setNewOrders] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/orders/all`);
        const currentOrders = res.data;
        
        // If this is the very first time loading and we have no previous count,
        // just set the count to current length to avoid showing all old orders as new
        if (previousCount === 0 && currentOrders.length > 0 && !localStorage.getItem('orderCount')) {
           setPreviousCount(currentOrders.length);
           localStorage.setItem('orderCount', currentOrders.length);
        } else if (currentOrders.length > previousCount) {
          // We have new orders
          const newOrds = currentOrders.slice(previousCount);
          setNewOrders(newOrds);
          setHasUnreadNotifications(true);
        }
        setOrders(currentOrders);
      } catch (err) {
        console.error("Error fetching orders for notifications", err);
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [previousCount]);

  const handleNotificationsClick = () => {
    // When opened, clear the badge and update the count
    if (newOrders.length > 0) {
      setPreviousCount(orders.length);
      localStorage.setItem('orderCount', orders.length);
      setHasUnreadNotifications(false);
      // We don't clear newOrders array immediately so the user can still see them in the dropdown
      // They will be cleared on next fetch or we can keep them until page reload
    }
  };

  const formattedDate = dateTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const formattedTime = dateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid">
        <button className="btn btn-primary" id="sidebarToggle" onClick={toggleSidebar}>
        <i className="bi bi-list-ul"></i>
        </button>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mt-2 mt-lg-0 align-items-center">
            
            <li className="nav-item me-4 d-none d-md-flex align-items-center text-muted fw-semibold">
              <i className="bi bi-calendar3 me-2"></i>
              <span>{formattedDate}, {formattedTime}</span>
            </li>
            
            <li className="nav-item dropdown me-3">
              <a className="nav-link position-relative text-secondary" href="#" id="notificationDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={handleNotificationsClick}>
                <i className="bi bi-bell fs-5"></i>
                {hasUnreadNotifications && (
                  <span className="position-absolute top-25 start-75 translate-middle p-1 bg-danger border border-light rounded-circle">
                    <span className="visually-hidden">New alerts</span>
                  </span>
                )}
              </a>
              <div className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="notificationDropdown" style={{ minWidth: '300px', maxHeight: '400px', overflowY: 'auto' }}>
                <h6 className="dropdown-header">Notifications</h6>
                {newOrders.length === 0 ? (
                  <div className="dropdown-item text-muted">No new orders</div>
                ) : (
                  newOrders.map((order, idx) => (
                    <div key={idx} className="dropdown-item border-bottom pb-2">
                      <div className="fw-bold">New Order! (&#8377;{order.amount})</div>
                      <small className="text-muted d-block text-wrap">
                        {order.orderedItems?.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                      </small>
                    </div>
                  ))
                )}
              </div>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle d-flex align-items-center" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {adminProfilePic ? (
                    <img src={adminProfilePic} alt="Profile" className="rounded-circle shadow-sm" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                ) : (
                    <i className="bi bi-person-circle fs-4 text-primary"></i>
                )}
              </a>
              <div className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="navbarDropdown" style={{ minWidth: '250px' }}>
                <div className="dropdown-item-text d-flex align-items-center mb-2 pb-3 border-bottom">
                  {adminProfilePic ? (
                      <img src={adminProfilePic} alt="Profile" className="rounded-circle shadow-sm me-3" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                  ) : (
                      <i className="bi bi-person-circle fs-1 text-primary me-3"></i>
                  )}
                  <div>
                    <h6 className="mb-0 fw-bold">{adminName}</h6>
                    {/* <small className="text-muted">{adminEmail}</small> */}
                  </div>
                </div>
                <a className="dropdown-item py-2" href="#!">
                  <i className="bi bi-person me-2"></i> My Profile
                </a>
                <a className="dropdown-item py-2" href="#!">
                  <i className="bi bi-gear me-2"></i> Settings
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item py-2 text-danger" href="#!" onClick={() => { localStorage.clear(); window.location.reload(); }}>
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Menubar;