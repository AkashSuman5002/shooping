import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Checkout.css';
import { ShopContext } from '../Context/ShopContext';
import { AuthContext } from '../Context/AuthApiContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { getCartLineItems, getTotalCartAmount, clearCart } = useContext(ShopContext);
  const { currentUser, authToken } = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const cartItemsList = getCartLineItems();

  const subtotal = getTotalCartAmount();
  const grandTotal = subtotal;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    const requiredFields = Object.values(formData).every((value) => value.trim() !== '');
    if (!requiredFields) {
      setSubmitError('Please complete the shipping form before placing your order.');
      return;
    }

    if (grandTotal <= 0) {
      navigate('/cart');
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          customer: formData,
          items: cartItemsList,
          total: grandTotal,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to place order.');
      }

      localStorage.setItem('shopperLastOrder', JSON.stringify(data.order));
      clearCart();
      navigate('/order-success', { state: { orderId: data.order.id } });
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-hero">
        <p>Secure checkout</p>
        <h1>Complete your order</h1>
        <span>Signed in as {currentUser?.name}</span>
      </div>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping details</h2>
          <div className="checkout-fields">
            <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full name" />
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email address" />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" />
            <input name="address" value={formData.address} onChange={handleChange} placeholder="Street address" />
            <input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
            <input name="state" value={formData.state} onChange={handleChange} placeholder="State / Region" />
            <input name="zip" value={formData.zip} onChange={handleChange} placeholder="ZIP / Postal code" />
          </div>

          <h2>Payment method</h2>
          <div className="checkout-payment">
            <label>
              <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
              Card
            </label>
            <label>
              <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              Cash on delivery
            </label>
            <label>
              <input type="radio" name="payment" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
              PayPal
            </label>
          </div>

          {submitError && <p className="checkout-error">{submitError}</p>}
          <button type="submit">Place order</button>
        </form>

        <aside className="checkout-summary">
          <h2>Order summary</h2>
          <div className="checkout-summary-items">
            {cartItemsList.map((item) => (
              <div className="checkout-summary-item" key={`${item.id}_${item.size}`}>
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <span>Size {item.size} • Qty {item.quantity}</span>
                </div>
                <strong>${item.new_price * item.quantity}</strong>
              </div>
            ))}
          </div>

          <div className="checkout-summary-totals">
            <div><span>Subtotal</span><strong>${subtotal}</strong></div>
            <div><span>Shipping</span><strong>Free</strong></div>
            <div className="checkout-grand-total"><span>Total</span><strong>${grandTotal}</strong></div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;