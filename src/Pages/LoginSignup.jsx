import React, { useContext, useState } from 'react'
import './CSS/Loginsignup.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthApiContext';

const LoginSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, verifyEmail, setAuthError, authError } = useContext(AuthContext);
  const [mode, setMode] = useState('signup');
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const fromPath = location.state?.from?.pathname || '/';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAuthError('');
    setSuccessMessage('');

    try {
      if (mode === 'signup') {
        const response = await register(formData);
        setPendingVerificationEmail(formData.email.trim().toLowerCase());
        setMode('verify');
        setSuccessMessage(
          response.devVerificationCode
            ? `${response.message || 'Verification code sent.'} Dev code: ${response.devVerificationCode}`
            : (response.message || 'Verification code sent.')
        );
        return;
      }

      if (mode === 'verify') {
        await verifyEmail({
          email: pendingVerificationEmail,
          code: verificationCode,
        });
        navigate(fromPath, { replace: true });
        return;
      } else {
        await login(formData);
      }

      navigate(fromPath, { replace: true });
    } catch (error) {
      setAuthError(error.message);
    }
  };

  return (
    <div className='loginsignup'>
      <div className='loginsignup-container'>
        <h1>{mode === 'signup' ? 'Sign Up' : mode === 'verify' ? 'Verify Email' : 'Login'}</h1>
        <form onSubmit={handleSubmit}>
          <div className='loginsignup-fields'>
            {mode === 'signup' && (
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Your Name'
              />
            )}
            {mode !== 'verify' ? (
              <>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Email Address'
                />
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Password'
                />
              </>
            ) : (
              <>
                <input
                  type='email'
                  value={pendingVerificationEmail}
                  disabled
                />
                <input
                  type='text'
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder='Enter 6-digit verification code'
                />
              </>
            )}
          </div>
          {successMessage && <p className="loginsignup-message loginsignup-success">{successMessage}</p>}
          {authError && <p className="loginsignup-message loginsignup-error">{authError}</p>}
          <button type='submit'>
            {mode === 'signup' ? 'Create account' : mode === 'verify' ? 'Verify code' : 'Login'}
          </button>
        </form>
        {mode !== 'verify' && (
          <p className="loginsignup-login">
            {mode === 'signup' ? 'Already have an account?' : 'Need an account?'}{' '}
            <span
              onClick={() => {
                setMode(mode === 'signup' ? 'login' : 'signup');
                setAuthError('');
                setSuccessMessage('');
              }}
            >
              {mode === 'signup' ? 'Login here' : 'Sign up here'}
            </span>
          </p>
        )}
        {mode === 'verify' && (
          <p className="loginsignup-login">
            Wrong email?{' '}
            <span
              onClick={() => {
                setMode('signup');
                setVerificationCode('');
                setPendingVerificationEmail('');
                setSuccessMessage('');
                setAuthError('');
              }}
            >
              Go back to Sign Up
            </span>
          </p>
        )}
        {mode === 'signup' && (
          <div className="loginsignup-agree">
            <input type="checkbox" name='' id='' defaultChecked />
            <p>By continuing, I agree to the terms of use & privacy policy</p>
          </div>
        )}
    </div>
    </div>
  )
}

export default LoginSignup
