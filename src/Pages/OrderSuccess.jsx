import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CSS/OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem('shopperLastOrder') || 'null');
    if (!savedOrder) {
      return;
    }

    if (!location.state?.orderId || location.state.orderId === savedOrder.id) {
      setOrder(savedOrder);
    }
  }, [location.state]);

  return (
    <div className="order-success-page">
      <div className="order-success-hero">
        <p>Order confirmed</p>
        <h1>Thank you for your purchase</h1>
        <span>Your order has been placed successfully.</span>
      </div>

      <div className="order-success-container">
        <div className="order-success-card">
          <h2>Order Details</h2>
          {order ? (
            <>
              <div className="order-info">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}</p>
                <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Total Paid:</strong> ${order.total}</p>
              </div>

              <h3>Customer Information</h3>
              <div className="customer-info">
                <p><strong>Name:</strong> {order.customer.fullName}</p>
                <p><strong>Email:</strong> {order.customer.email}</p>
                <p><strong>Phone:</strong> {order.customer.phone}</p>
                <p><strong>Address:</strong> {order.customer.address}</p>
                <p><strong>City:</strong> {order.customer.city}</p>
                <p><strong>State:</strong> {order.customer.state}</p>
                <p><strong>ZIP:</strong> {order.customer.zip}</p>
              </div>

              <h3>Ordered Items</h3>
              <div className="ordered-items">
                {order.items && order.items.length > 0 ? (
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.category}</td>
                          <td>${item.new_price}</td>
                          <td>{item.quantity}</td>
                          <td>${item.new_price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No items in this order.</p>
                )}
              </div>
            </>
          ) : (
            <p>Your latest order details are not available in this session.</p>
          )}
        </div>
      </div>

      <div className="order-success-actions">
        <Link to="/" className="btn-primary">Continue Shopping</Link>
        <Link to="/profile" className="btn-secondary">View Profile</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;