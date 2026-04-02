import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthApiContext';
import './CSS/Profile.css';

const INDIAN_STATE_CITY_MAP = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kurnool'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro'],
  Assam: ['Guwahati', 'Silchar', 'Dibrugarh', 'Nagaon', 'Jorhat'],
  Bihar: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
  Chhattisgarh: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg'],
  Goa: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
  Haryana: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Hisar'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Mandi', 'Solan', 'Kullu'],
  Jharkhand: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh'],
  Karnataka: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi'],
  Kerala: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain'],
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  Manipur: ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Ukhrul'],
  Meghalaya: ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Baghmara'],
  Mizoram: ['Aizawl', 'Lunglei', 'Serchhip', 'Champhai', 'Kolasib'],
  Nagaland: ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'],
  Odisha: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Puri'],
  Punjab: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
  Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
  Sikkim: ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Singtam'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
  Telangana: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
  Tripura: ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar', 'Belonia'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Noida', 'Varanasi', 'Agra'],
  Uttarakhand: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol'],
  'Andaman and Nicobar Islands': ['Port Blair', 'Car Nicobar', 'Diglipur', 'Mayabunder', 'Rangat'],
  Chandigarh: ['Chandigarh'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Diu', 'Silvassa'],
  Delhi: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
  'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur'],
  Ladakh: ['Leh', 'Kargil', 'Diskit', 'Nubra', 'Zanskar'],
  Lakshadweep: ['Kavaratti', 'Agatti', 'Amini', 'Andrott', 'Kalpeni'],
  Puducherry: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam', 'Ozhukarai'],
};

const INDIAN_STATES = Object.keys(INDIAN_STATE_CITY_MAP);

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, authToken } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    photo: null,
    photoPreview: null,
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);
  const availableCities = formData.state ? INDIAN_STATE_CITY_MAP[formData.state] || [] : [];

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Load user profile from localStorage
    const savedProfile = JSON.parse(localStorage.getItem(`userProfile_${currentUser.id}`) || '{}');
    setFormData({
      phone: savedProfile.phone || '',
      address: savedProfile.address || '',
      city: savedProfile.city || '',
      state: savedProfile.state || '',
      zip: savedProfile.zip || '',
      photo: null,
      photoPreview: savedProfile.photoPreview || null,
    });

    // Fetch user orders from backend
    fetchUserOrders();
  }, [currentUser, navigate]);

  const fetchUserOrders = async () => {
    try {
      const response = await fetch('/api/orders/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData({
        ...formData,
        phone: digitsOnly,
      });
      return;
    }

    if (name === 'zip') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 6);
      setFormData({
        ...formData,
        zip: digitsOnly,
      });
      return;
    }

    if (name === 'state') {
      setFormData({
        ...formData,
        state: value,
        city: '',
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photo: file,
          photoPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');

    try {
      if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
        setMessage('Phone number must be exactly 10 digits.');
        return;
      }

      if (formData.zip && !/^\d{6}$/.test(formData.zip)) {
        setMessage('ZIP code must be exactly 6 digits.');
        return;
      }

      if (formData.city && formData.state && !availableCities.includes(formData.city)) {
        setMessage('Please select a valid city for the selected state.');
        return;
      }

      const profileData = {
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        photoPreview: formData.photoPreview,
      };

      // Save to localStorage
      localStorage.setItem(`userProfile_${currentUser.id}`, JSON.stringify(profileData));

      setMessage('Profile updated successfully!');
      setEditMode(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-photo-section">
            <div className="profile-photo">
              {formData.photoPreview ? (
                <img src={formData.photoPreview} alt="Profile" />
              ) : (
                <div className="photo-placeholder">
                  <span>{currentUser.name?.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            {editMode && (
              <label className="photo-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
                <span>📷 Change Photo</span>
              </label>
            )}
          </div>

          <div className="profile-user-info">
            <h2>{currentUser.name}</h2>
            <p>{currentUser.email}</p>
          </div>
        </div>

        <div className="profile-main">
          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="profile-card">
            <div className="profile-card-header">
              <h3>Personal Information</h3>
              <button
                className="edit-btn"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editMode ? (
              <form className="profile-form">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                    maxLength={10}
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>State</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((stateName) => (
                        <option key={stateName} value={stateName}>
                          {stateName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!formData.state}
                    >
                      <option value="">{formData.state ? 'Select City' : 'Select State First'}</option>
                      {availableCities.map((cityName) => (
                        <option key={cityName} value={cityName}>
                          {cityName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      placeholder="6-digit PIN code"
                      inputMode="numeric"
                      maxLength={6}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="save-btn"
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="profile-display">
                <div className="info-item">
                  <span className="label">Phone:</span>
                  <span className="value">{formData.phone || 'Not added'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Address:</span>
                  <span className="value">{formData.address || 'Not added'}</span>
                </div>
                <div className="info-row">
                  <div className="info-item">
                    <span className="label">City:</span>
                    <span className="value">{formData.city || 'Not added'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">State:</span>
                    <span className="value">{formData.state || 'Not added'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">ZIP:</span>
                    <span className="value">{formData.zip || 'Not added'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-card">
            <h3>Order History</h3>
            {orders && orders.length > 0 ? (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-item">
                    <div className="order-header">
                      <span className="order-id">Order #{order.id.substring(0, 8)}</span>
                      <span className="order-date">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="order-total">${order.total}</span>
                    </div>
                    <div className="order-items">
                      {order.items.map((item, idx) => (
                        <span key={idx} className="item-name">
                          {item.name} (x{item.quantity})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-orders">No orders yet. Start shopping!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
