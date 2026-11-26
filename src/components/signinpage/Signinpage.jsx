import React, { useState } from 'react';
import logo from '../../assets/attrallogo.png';
import google from '../../assets/google.png';
import apple from '../../assets/apple.png';
import facebook from '../../assets/facebook.png';
import './Signinpage.css';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, setAuthToken, setAuthUser } from '../../services/api';

export const Signinpage = () => {
  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.login({ email, password });
      if (res.data?.token) {
        setAuthToken(res.data.token);
        setAuthUser(res.data.user);
        navigate('/HomePage');
      } else {
        navigate('/HomePage');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='Signinpage'>
        <img className='signin-attral' src={logo} alt="attral" />
        <a href='https://techbrainnetworks.com/' className='signin-Poweredby '>
          Powered by <span className='signin-techbrain'>Techbrain Networks</span>
        </a>
      </div>

      <div className={`signin-container ${expanded ? 'expanded' : ''}`}>
        <h1 className='signin-tittle '>Sign in</h1>

        <form onSubmit={handleSignIn}>
          <div className='signin-input-box'>
            <input
              className='signin-input'
              type="email"
              placeholder='Enter your email ID'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='signin-input-box'>
            <input
              className='signin-input'
              type="password"
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p style={{ color: '#e53e3e', fontSize: '13px', margin: '6px 0 10px', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <div className='signin-input-box'>
            <Link className='forgot-password' to="/PasswordAssistance">
              forgot password ?
            </Link>
            <button className='signin-button' type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <div>
              <p className='or-signup'>or sign up with</p>
            </div>
            <div className='signin-social-icon'>
              <a href="https://accounts.google.com/">
                <img src={google} alt="google-login" />
              </a>
              <a href="https://account.apple.com/sign-in">
                <img src={apple} alt="apple-logo" />
              </a>
              <a href="https://www.facebook.com/">
                <img src={facebook} alt="facebook-logo" />
              </a>
              <span className='no-account'>
                Don't have an account ?{' '}
                <Link to="/Signuppage" className='signin' onClick={handleClick}>
                  {expanded ? 'Close' : 'Sign up'}
                </Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signinpage;
