import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '32px' }}>
      <div style={{ maxWidth: '540px', textAlign: 'center', background: 'white', padding: '40px 32px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontSize: '56px', marginBottom: '8px' }}>404</h1>
        <h2 style={{ marginBottom: '12px' }}>Page not found</h2>
        <p style={{ marginBottom: '24px', color: '#666', lineHeight: 1.6 }}>
          The page you requested does not exist. Use the button below to return to the store.
        </p>
        <Link to="/" style={{ display: 'inline-block', padding: '14px 24px', borderRadius: '999px', textDecoration: 'none', color: 'white', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontWeight: 700 }}>
          Back to shop
        </Link>
      </div>
    </div>
  );
};

export default NotFound;