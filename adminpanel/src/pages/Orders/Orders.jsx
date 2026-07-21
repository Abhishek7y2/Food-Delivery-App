import React, { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";
import './Orders.css';

const Orders = () => {
  const [data, setData] = useState([]);

  // Fetch Orders
  const fetchOrders = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/orders/all"
    );
    setData(response.data);
  };

  // Update Status
  const updateStatus = async (event, orderId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/orders/status/${orderId}`,
        null,
        {
          params: {
            status: event.target.value
          }
        }
      );
      if (response.status === 200) {
        await fetchOrders();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    if (status === 'Preparing') return 'status-preparing';
    if (status === 'Out for delivery') return 'status-out-for-delivery';
    if (status === 'Delivered') return 'status-delivered';
    return '';
  };

  const getOrderDate = (objectId) => {
    if (!objectId || objectId.length !== 24) return "";
    const timestamp = parseInt(objectId.substring(0, 8), 16) * 1000;
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="orders-container">
      <div className="modern-orders-card">
        <h2 className="modern-orders-title">Customer Orders</h2>
        <div className="orders-table-wrapper">
          <table className="modern-orders-table">
            <thead>
              <tr>
                <th><span className="header-badge">Order Number</span></th>
                <th></th>
                <th><span className="header-badge">Order Details</span></th>
                <th><span className="header-badge">Price</span></th>
                <th><span className="header-badge">Items</span></th>
                <th><span className="header-badge">Status</span></th>
                <th><span className="header-badge">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {data.map((order, index) => {
                return (
                  <tr key={index}>
                    <td className="order-serial">
                      <div>#{index + 1}</div>
                      <div className="text-muted mt-2" style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>
                        {getOrderDate(order.id)}
                      </div>
                    </td>
                    <td>
                      <img src={assets.parcel} alt="Parcel" height={52} width={52} className="order-icon" />
                    </td>

                    <td className="order-details-col">
                      <div className="order-items">
                        {order.orderedItems?.map((item, idx) => {
                          if (idx === order.orderedItems.length - 1) {
                            return item.name + " x " + item.quantity;
                          } else {
                            return item.name + " x " + item.quantity + ", ";
                          }
                        }) || "No items"}
                      </div>
                      <div className="order-address mt-2 text-muted" style={{fontSize: '0.85rem'}}>
                        <i className="bi bi-geo-alt-fill me-1"></i>
                        {order.userAddress || "No address provided"}
                      </div>
                    </td>

                    <td className="order-price">
                      <div>&#8377;{order.amount ? order.amount.toFixed(2) : "0.00"}</div>
                      <div className="mt-2">
                        <span className={`badge ${order.paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {order.paymentStatus || 'Pending'}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="order-count">Items: {order.orderedItems?.length || 0}</span>
                    </td>

                    <td className="order-status-col">
                      <span className={`text-capitalize order-status-text ${getStatusClass(order.orderStatus)}`}>
                        <i className="bi bi-circle-fill me-2" style={{fontSize: '0.6rem'}}></i>
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="order-action-col">
                      <select
                        className={`status-badge ${getStatusClass(order.orderStatus)}`}
                        onChange={(event) => updateStatus(event, order.id)}
                        value={order.orderStatus}
                      >
                        <option value="Preparing">Food Preparing</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;

