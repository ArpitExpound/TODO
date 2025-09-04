import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  // Optionally, you can accept setUser as a prop as well:
  // const setUser = props.setUser || useContext(UserContext).setUser;

  const handleLogin = async () => {
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        email,
        password
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const userData = res.data?.data;
      if (res.data?.status === 200 && userData) {
        setUser(userData); // This updates context and localStorage
        navigate('/todo');
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>
        {error && <p className="auth-error">{error}</p>}
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="auth-input"
        />
        <div style={{ marginBottom: '10px' }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <button onClick={handleLogin} className="auth-button">Login</button>
        <p className="auth-text">
          Don't have an account?{' '}
          <span className="auth-link" onClick={() => navigate('/signup')}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;