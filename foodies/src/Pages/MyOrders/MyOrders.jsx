import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MyOrders.css';

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Helper to determine status class
  const getStatusClass = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s.includes('preparing') || s.includes('processing')) return 'status-preparing';
    if (s.includes('delivered') || s.includes('completed')) return 'status-delivered';
    if (s.includes('cancel')) return 'status-cancelled';
    return 'status-default';
  };

  return (
    <div className='my-orders-wrapper'>
      <div className='container'>
        <h2 className="my-orders-header text-center">My Orders</h2>

        {data.length === 0 ? (
          <div className="empty-orders-container">
            <i className="bi bi-receipt empty-orders-icon"></i>
            <h3 className="empty-orders-text">No Orders Yet</h3>
            <p className="empty-orders-subtext mb-4">Looks like you haven't placed any orders.</p>
            <Link to="/explore" className="btn btn-premium">
              <i className="bi bi-search me-2"></i> Start Ordering
            </Link>
          </div>
        ) : (
          <div className="orders-list-container">
            {Array.isArray(data) && data.map((order, index) => {
              
              // Safely handle missing orderedItems
              const itemsList = order.orderedItems || [];
              const itemsString = itemsList.length > 0 
                ? itemsList.map((item, idx) => {
                    return idx === itemsList.length - 1 
                      ? `${item.name} x ${item.quantity}` 
                      : `${item.name} x ${item.quantity}, `;
                  }).join('')
                : "No items found in this order";

              return (
                <div className="order-card" key={index}>
                  
                  <div className="order-icon-wrapper">
                    <img src={assets.delivery} alt="Delivery Box" />
                  </div>

                  <div className="order-details-section">
                    <div className="order-items">{itemsString}</div>
                    <div className="order-meta">
                      Items: {order.orderedItems.length} &bull; Order ID: #{order.id || index + 1000}
                    </div>
                  </div>

                  <div className="order-amount">
                    &#8377;{order.amount.toFixed(2)}
                  </div>

                  <div>
                    <div className={`order-status-pill ${getStatusClass(order.orderStatus)}`}>
                      <span className="status-indicator"></span>
                      {order.orderStatus || 'Processing'}
                    </div>
                  </div>

                  <button
                    className="btn-refresh-order"
                    onClick={fetchOrders}
                    title="Track Order"
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyOrders;